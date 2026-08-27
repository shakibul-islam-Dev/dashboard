"use client";

import { Search, Bell, CircleHelp, Menu, LogOut, Settings, User } from "lucide-react";
import { currentUser } from "@/data/navigation";
import { dropdownNotifications } from "@/data/notifications";
import { logoutUser, useSession } from "@/lib/auth";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import NotificationsModal from "../customsUi/NotificationsModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Button component from shadcn/ui (base-ui) — used for all icon actions
import { Button } from "@/components/ui/button";
// Input component from shadcn/ui (base-ui) — replaces the raw <input> search field
import { Input } from "@/components/ui/input";

interface DashboardNavigationProps {
  onMenuClick?: () => void;
}

export default function DashboardNavigation({
  onMenuClick,
}: DashboardNavigationProps) {
  const router = useRouter();

  // --- Notifications modal state ---
  const [isShowComponent, setShowComponent] = useState(false);

  // --- Search input state ---
  const [searchQuery, setSearchQuery] = useState("");

  // --- Unread notification count ---
  const unreadCount = dropdownNotifications.filter((n) => n.unread).length;

  // --- User menu dropdown ---
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // --- Logged-in user from localStorage session ---
  const sessionUser = useSession();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  // --- Search handler: shows toast with search query ---
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      toast.info("Search", {
        description: `Searching for "${searchQuery.trim()}"...`,
      });
      setSearchQuery("");
    }
  };

  return (
    <nav className="flex items-center justify-between w-full h-16 px-3 sm:px-4 md:px-6 bg-card border-b border-border gap-2">
      {/* Left Side: Mobile Menu + Search Bar */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile menu toggle — ghost icon button for opening the sidebar on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden shrink-0"
          title="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Desktop search input — uses the shadcn/ui Input component */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Mobile search toggle — ghost icon button for triggering search on small screens */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden shrink-0"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* Right Side: Icons & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
        {/* Notifications bell with unread count badge */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowComponent(true)}
            title="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {/* Unread notification badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </Button>
          {isShowComponent && <NotificationsModal isOpen={isShowComponent} onClose={() => setShowComponent(false)} />}
        </div>

        {/* Help Icon — ghost icon button linking to help & support page */}
        <Link href={`/dashboard/help&support`}>
          <Button variant="ghost" size="icon">
            <CircleHelp className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </Link>

        {/* User Avatar with dropdown menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-full border border-border cursor-pointer sm:ml-2"
            onClick={() => setShowUserMenu((prev) => !prev)}
          >
            <Image
              src={currentUser.avatar}
              alt={currentUser.name}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </button>
          {/* User dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border rounded-lg shadow-xl z-50 py-1 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground">
                  {sessionUser?.fullName ?? currentUser.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sessionUser?.email ?? currentUser.role}
                </p>
              </div>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                onClick={() => { setShowUserMenu(false); router.push("/dashboard/settings"); }}
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Profile
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                onClick={() => { setShowUserMenu(false); router.push("/dashboard/settings"); }}
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                Settings
              </button>
              <div className="border-t border-border" />
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-600 hover:bg-muted transition-colors"
                onClick={() => {
                  setShowUserMenu(false);
                  logoutUser();
                  toast.success("Signed out", {
                    description: "You have been logged out successfully.",
                  });
                  router.replace("/login");
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
