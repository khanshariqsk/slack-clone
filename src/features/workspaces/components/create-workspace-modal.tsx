"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkSpaceModal = () => {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = useCreateWorkspace();
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess: (id) => {
          router.push(`/workspace/${id}`);
          handleClose();
          toast.success("Workspace created");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace name e.g. 'Work','Personal','Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
