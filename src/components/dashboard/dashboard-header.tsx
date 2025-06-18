import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Brain } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useSignout } from "@/hooks/useSignout";
import { useAuth } from "@/store/useAuth";
import { UserAvatar } from "./user-avatar";
import { SearchComponent } from "./search-component";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Button } from "../ui/button";

export function DashboardHeader({ sessionTitle }: { sessionTitle?: string }) {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const { signoutUser } = useSignout();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userFullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Guest";
  const firstName = userFullName.split(" ")[0];

  const userPhotoURL =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const avatarFallbackLetter = userFullName.charAt(0).toUpperCase();

  const handleConfirmSignOut = async (event: FormEvent) => {
    event.preventDefault();
    await signoutUser();
    setShowSignOutDialog(false);
    navigate("/");
  };

  const handleSearch = (query: string) => {
    // Handle search functionality here
    console.log("Search query:", query);
  };

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-8 lg:px-16 xl:px-24">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sa-primary dark:text-blue-400 flex-shrink-0"
          >
            <div className="w-8 h-8 bg-sa-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">SummAid</span>
          </Link>

          {/* Center: Title (md+) */}
          {sessionTitle && (
            <h1 className="hidden md:block text-sm sm:text-base md:text-lg font-semibold text-center flex-1 truncate uppercase">
              {sessionTitle}
            </h1>
          )}

          {/* Right: Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search component */}
            <SearchComponent onSearch={handleSearch} />

            <UserAvatar
              firstName={firstName}
              userPhotoURL={userPhotoURL}
              avatarFallbackLetter={avatarFallbackLetter}
              onClick={() => setShowSignOutDialog(true)}
            />

            {/* Theme toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>

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
