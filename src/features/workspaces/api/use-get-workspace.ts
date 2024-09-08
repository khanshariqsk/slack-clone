"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEffect, useState } from "react";

interface UseGetWorkspaceProps {
  id: Id<"workspaces">;
}

export const useGetWorkspace = ({ id }: UseGetWorkspaceProps) => {
  const [error, setError] = useState<Error | null>(null);

  const data = useQuery(api.workspaces.getById, { id });

  useEffect(() => {
    if (data === undefined) {
      setError(null);
    } else if (data === null) {
      setError(new Error("Workspace not found"));
    } else {
      setError(null);
    }
  }, [data]);

  return {
    data: data,
    isLoading: data === undefined,
    error,
  };
};
