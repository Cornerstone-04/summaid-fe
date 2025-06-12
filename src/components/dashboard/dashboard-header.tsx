import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Brain, Search, LogOut, Menu } from "lucide-react";
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
import { AnimatePresence, motion } from "framer-motion";

export function DashboardHeader({ sessionTitle }: { sessionTitle?: string }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4 gap-4 justify-between md:justify-normal">
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
          <h1 className="hidden md:block text-sm sm:text-base md:text-lg font-semibold text-center flex-1 truncate">
            {sessionTitle || "Untitled Session"}
          </h1>

          {/* Right: Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search icon (sm+) */}
            <div className="relative hidden sm:flex items-center">
              <AnimatePresence initial={false}>
                {!isSearchOpen ? (
                  <motion.button
                    key="search-icon"
                    className="p-2 rounded-full hover:bg-muted transition"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setTimeout(() => searchRef.current?.focus(), 100);
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Search className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                ) : (
                  <motion.div
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "16rem", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={searchRef}
                        type="search"
                        placeholder="Search..."
                        className="pl-9 rounded-full bg-muted border-none ring-1 ring-transparent focus:ring-2 focus:ring-blue-500"
                        onBlur={() => setIsSearchOpen(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setIsSearchOpen(false);
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                  onClick={() => setShowSignOutDialog(true)}
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
                  onClick={() => setShowSignOutDialog(true)}
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Signout Dialog */}
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
