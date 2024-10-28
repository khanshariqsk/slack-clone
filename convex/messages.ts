import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (!messages.length) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessageUser?._creationTime,
  };
};

const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorised");
    }

    let _conversationId = args.conversationId;

    //Only possible if we are replying in a thread in 1:1 conversation
    if (!args.channelId && !args.conversationId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const structuredPages: any[] = [];
    for (let message of results.page) {
      const member = await populateMember(ctx, message.memberId);

      const user = member ? await populateUser(ctx, member.userId) : null;

      if (!user || !member) {
        continue;
      }

      const reactions = await populateReactions(ctx, message._id);

      const thread = await populateThread(ctx, message._id);

      let image: string | undefined | null = undefined;

      if (message.image) {
        image = await ctx.storage.getUrl(message.image);
      }

      const reactionsWithCounts = await reactions.map((reaction) => {
        return {
          ...reaction,
          count: reactions.filter((r) => r.value == reaction.value).length,
        };
      });

      const dedupedReactions = reactionsWithCounts.reduce(
        (acc, reaction) => {
          const existingReaction = acc.find((r) => r.value == reaction.value);

          if (existingReaction) {
            existingReaction.memberIds = Array.from(
              new Set([...existingReaction.memberIds, reaction.memberId])
            );
          } else {
            acc.push({ ...reaction, memberIds: [reaction.memberId] });
          }

          return acc;
        },
        [] as (Doc<"reactions"> & {
          count: number;
          memberIds: Id<"members">[];
        })[]
      );

      const reactionsWithoutMemberIdProperty = dedupedReactions.map(
        ({ memberId, ...rest }) => rest
      );

      structuredPages.push({
        ...message,
        image,
        member,
        user,
        reactions: reactionsWithoutMemberIdProperty,
        threadCount: thread.count,
        threadImage: thread.image,
        threadTimestamp: thread.timestamp,
      });
    }

    return {
      ...results,
      page: structuredPages,
    };
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      throw new Error("Unauthorized");
    }

    let _conversationId = args.conversationId;

    //Only possible if we are replying in a thread in 1:1 conversation
    if (!args.channelId && !args.conversationId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      conversationId: _conversationId,
    });

    return messageId;
  },
});