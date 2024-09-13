"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateChannelModal } from "../store/use-create-channel-modal";

export const CreateChannelModal = () => {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useCreateChannelModal();
  // const { mutate, isPending } = useCreateWorkspace();
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    // mutate(
    //   { name },
    //   {
    //     onSuccess: (id) => {
    //       router.push(`/workspace/${id}`);
    //       handleClose();
    //       toast.success("Workspace created");
    //     },
    //   }
    // );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            // disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            value={name}
            onChange={handleChange}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button
            // disabled={isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
