"use client";

import { Search, Bell, CircleHelp, Menu } from "lucide-react";
import { currentUser } from "@/data/navigation";
import Image from "next/image";

interface DashboardNavigationProps {
  onMenuClick?: () => void;
}

export default function DashboardNavigation({
  onMenuClick,
}: DashboardNavigationProps) {
  return (
    <nav className="flex items-center justify-between w-full h-16 px-3 sm:px-4 md:px-6 bg-card border-b border-border gap-2">
      {/* Left Side: Mobile Menu + Search Bar */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0 cursor-pointer"
          title="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 text-sm text-foreground bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary transition-all placeholder:text-muted-foreground"
            placeholder="Search..."
          />
        </div>

        {/* Mobile Search Icon */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0 cursor-pointer"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right Side: Icons & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
        {/* Notification Icon */}
        <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Help Icon */}
        <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <CircleHelp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* User Avatar */}
        <button className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-full border border-border cursor-pointer sm:ml-2">
          <Image
            src={currentUser.avatar}
            alt={currentUser.name}
            className="object-cover w-full h-full"
          />
        </button>
      </div>
    </nav>
  );
}
