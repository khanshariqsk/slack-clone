import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { FaChevronDown } from "react-icons/fa";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
  memberId: Id<"members"> | undefined;
}

export const Header = ({
  memberName = "Image",
  memberImage,
  onClick,
  memberId,
}: HeaderProps) => {
  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">
          {memberName} {currentMember?._id === memberId && "(You)"}
        </span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};
