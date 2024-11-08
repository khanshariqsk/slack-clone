"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

export const Sidebar = () => {
  const [_open, setOpen] = useCreateWorkspaceModal();
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[14px]">
      <WorkspaceSwitcher />
      {/* <SidebarButton icon={Home} label="Home" isActive /> */}
      {/* <SidebarButton icon={MessagesSquare} label="DMs" /> */}
      <SidebarButton icon={Bell} label="Activity" />

      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="flex flex-col gap-y-1 items-center justify-center mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
