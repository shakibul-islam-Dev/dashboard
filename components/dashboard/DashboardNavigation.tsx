"use client";

import { Bell, CircleHelp, Menu, LogOut, Settings, User } from "lucide-react";
import { currentUser } from "@/data/navigation";
import { logoutUser, useSession } from "@/lib/auth";
import { useProfile, initialsFromName } from "@/lib/profileStore";
import { useNotifications } from "@/lib/notificationsStore";
import { useState, useRef, useEffect } from "react";
import NotificationsModal from "../customsUi/NotificationsModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Button component from shadcn/ui (base-ui) — used for all icon actions
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardNavigationProps {
  onMenuClick?: () => void;
}

export default function DashboardNavigation({
  onMenuClick,
}: DashboardNavigationProps) {
  const router = useRouter();

  // --- Notifications modal state ---
  const [isShowComponent, setShowComponent] = useState(false);

  // --- Unread notification count (reactive: read/delete in the feed updates it) ---
  const { unreadCount } = useNotifications();

  // --- User menu dropdown ---
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // --- Logged-in user from localStorage session ---
  const sessionUser = useSession();

  // --- Profile (uploaded photo / name / job title) ---
  const profile = useProfile();
  const displayName = profile.fullName || sessionUser?.fullName || currentUser.name;
  const displayRole = sessionUser?.email ?? profile.jobTitle ?? currentUser.role;
  const avatarSrc = profile.avatar || currentUser.avatar;

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

  return (
    <nav className="flex items-center justify-between w-full h-16 px-3 sm:px-4 md:px-6 bg-card border-b border-border gap-2">
      {/* Left Side: Mobile Menu + App Branding */}
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

        {/* App brand — shown on responsive screens where the sidebar is a drawer */}
        <div className="lg:hidden flex items-center min-w-0">
          <h1 className="font-bold text-xl text-foreground truncate whitespace-nowrap">
            Task Board
          </h1>
        </div>
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
            className="relative overflow-hidden rounded-full cursor-pointer sm:ml-2"
            onClick={() => setShowUserMenu((prev) => !prev)}
            title={displayName}
          >
            <Avatar className="size-8 sm:size-9">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="text-xs font-semibold">
                {initialsFromName(displayName)}
              </AvatarFallback>
            </Avatar>
          </button>
          {/* User dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border rounded-lg shadow-xl z-50 py-1 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {displayRole}
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
