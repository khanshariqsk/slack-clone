import { mutation } from "./_generated/server";

export const generateUploadByUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
