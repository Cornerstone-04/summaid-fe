import { FormEvent, useState } from "react";
import { Link } from "react-router";
import { Brain, Search, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSignout } from "@/hooks/useSignout";
import { useAuth } from "@/store/useAuth";

export function DashboardHeader() {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const { signoutUser } = useSignout();
  const { user } = useAuth();

  const firstName = user?.displayName?.split(" ")[0] || "Guest";
  const avatarFallbackLetter =
    user?.displayName?.charAt(0).toUpperCase() || "G";

  console.log(user?.photoURL);

  const handleConfirmSignOut = async (event: FormEvent) => {
    event.preventDefault();

    await signoutUser();
    setShowSignOutDialog(false);
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sa-primary dark:text-blue-400"
          >
            <div className="w-8 h-8 bg-sa-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">SummAid</span>
          </Link>

          {/* Right: Search, Toggle, Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 rounded-full bg-muted border-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 border-l border-border pl-4 cursor-pointer">
                  <span className="text-sm font-medium text-foreground">
                    {firstName}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.photoURL || "/placeholder.svg"}
                      alt="User Avatar"
                    />
                    <AvatarFallback>{avatarFallbackLetter}</AvatarFallback>{" "}
                    {/* Fallback for initial */}
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowSignOutDialog(true)}
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Signout Confirmation Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to sign out?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSignOutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmSignOut}>
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
