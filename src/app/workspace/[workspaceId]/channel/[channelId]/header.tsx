import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useChannelId } from "@/hooks/use-channel-id";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useConfirm } from "@/hooks/use-confirm";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const [value, setValue] = useState<string>(title);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const router = useRouter();

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: isMemberLoading } = useCurrentMember({
    workspaceId,
  });

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          router.replace(`/workspace/${workspaceId}`);
          toast.success("Channel removed");
        },
        onError: () => {
          toast.error("Failed to remove the channel");
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { name: value, id: channelId },
      {
        onSuccess: (id) => {
          toast.success("Channel updated.");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size={"sm"}
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle className="font-semibold"># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel Name</p>
                    {member?.role == "admin" && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    disabled={isUpdatingChannel}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    value={value}
                    onChange={handleChange}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <div className="flex justify-end">
                      <Button disabled={isUpdatingChannel}>Save</Button>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role == "admin" && (
              <button
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                onClick={handleDelete}
                disabled={isRemovingChannel}
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
