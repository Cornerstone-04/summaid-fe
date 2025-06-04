import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="text-lg font-semibold text-blue-600">StudySphere</div>
      <div className="flex items-center space-x-4">
        <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
        <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Cornerstone E.</span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white">
              E
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
