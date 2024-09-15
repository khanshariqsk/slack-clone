"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  id: Id<"channels">;
};

type ResponseType = Id<"channels"> | null;

type Options = {
  onSuccess?: (reponse: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useRemoveChannel = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.channels.remove);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        //resets the state
        setData(null);
        setError(null);

        setStatus("pending");
        const response = await mutation(values);
        options?.onSuccess?.(response);
        setData(response);
        setStatus("success");
        return response;
      } catch (error) {
        options?.onError?.(error as Error);
        setError(error as Error);
        setStatus("error");
        if (options?.throwError) {
          throw error;
        }
      } finally {
        options?.onSettled?.();
        setStatus("settled");
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    error,
    isSuccess,
    isError,
    isPending,
    isSettled,
  };
};
