import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  const { data: otherMember, isLoading: otherMemberLoading } = useGetMember({
    id: memberId,
  });

  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const { loadMore, results, status } = useGetMessages({ conversationId: id });

  if (otherMemberLoading || status == "LoadingFirstPage") {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={otherMember?.user?.name}
        memberImage={otherMember?.user?.image}
        onClick={() => {
          onOpenProfile(memberId);
        }}
        memberId={otherMember?._id}
      />
      <MessageList
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        variant="conversation"
        memberName={otherMember?.user?.name}
        memberImage={otherMember?.user?.image}
      />
      <ChatInput
        conversationId={id}
        placeholder={`${currentMember?._id == otherMember?._id ? "Message Yourself" : `Message ${otherMember?.user?.name}`}`}
      />
    </div>
  );
};
