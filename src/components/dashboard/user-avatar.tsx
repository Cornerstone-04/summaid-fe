import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu } from "lucide-react";

interface UserAvatarProps {
  firstName: string;
  userPhotoURL: string;
  avatarFallbackLetter: string;
  onClick: () => void;
}

export const UserAvatar = ({
  firstName,
  userPhotoURL,
  avatarFallbackLetter,
  onClick,
}: UserAvatarProps) => {
  return (
    <>
      {/* Desktop: Avatar, Name & Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="hidden sm:flex items-center gap-2 border-l border-border pl-4 cursor-pointer">
            <span className="text-sm font-medium text-foreground hidden md:inline">
              {firstName}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userPhotoURL || "/placeholder.svg"}
                alt="User Avatar"
              />
              <AvatarFallback>{avatarFallbackLetter}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={onClick}
            className="text-red-500 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile: Hamburger dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>{firstName}</DropdownMenuItem>
          <DropdownMenuItem
            onClick={onClick}
            className="text-red-500 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
