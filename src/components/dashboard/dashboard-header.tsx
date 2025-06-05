import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { RocketIcon, Search } from "lucide-react";
import { Link } from "react-router";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
        >
          <RocketIcon className="w-5 h-5" />
          <span className="text-lg font-bold">SummAid</span>
        </Link>

        {/* Right: Search, Notifications, Toggle, User */}
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

          <div className="flex items-center gap-2 border-l border-border pl-4">
            <span className="text-sm font-medium text-foreground">
              Cornerstone
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User Avatar" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
