"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceBasicInfo } from "@/features/workspaces/api/use-get-workspace-basic-info";
import { useJoinMember } from "@/features/workspaces/api/use-join-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FaSlackHash } from "react-icons/fa";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinMemberPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceBasicInfo({ id: workspaceId });

  const router = useRouter();

  const { mutate, isPending } = useJoinMember();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { joinCode: value, workspaceId },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Workspace joined.");
        },
        onError: () => {
          toast.error("Failed to join workspace.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 justify-center items-center bg-white p-8 shadow-md">
      <FaSlackHash className="size-16 text-[#7a177b] font-bold" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500 ",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button asChild size="lg" variant={"outline"}>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinMemberPage;
