"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEffect, useState } from "react";

interface UseGetWorkspaceBasicInfoProps {
  id: Id<"workspaces">;
}

export const useGetWorkspaceBasicInfo = ({
  id,
}: UseGetWorkspaceBasicInfoProps) => {
  const data = useQuery(api.workspaces.getBasicInfoById, { id });
  const isLoading = data === undefined;
  return { data, isLoading };
};
