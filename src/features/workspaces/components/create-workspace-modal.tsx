"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkSpaceModal = () => {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = useCreateWorkspace();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus(); // Set focus on input
    }
  }, [open]);

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
            ref={inputRef}
            disabled={isPending}
            required
            minLength={3}
            maxLength={80}
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
