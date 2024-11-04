"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface ProfileHeaderProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const ProfileHeader = ({ children, onClose }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 border-b h-[49px]">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size="iconSm" variant={"ghost"}>
          <XIcon className="size-5 stroke-1.5" />
        </Button>
      </div>
      {children}
    </div>
  );
};
