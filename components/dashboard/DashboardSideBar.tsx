"use client";
import {
  CircleQuestionMark,
  PanelRightClose,
  PanelLeftClose,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  dashboardSidebarLinks as sidebarLinks,
  currentUser,
} from "@/data/navigation";
import { useSession } from "@/lib/auth";
import { useProfile, initialsFromName } from "@/lib/profileStore";
// Button component from shadcn/ui (base-ui)
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardSideBarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSideBar({
  mobileOpen,
  onMobileClose,
}: DashboardSideBarProps) {
  // --- Persist collapsed state to localStorage ---
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const collapsed = localStorage.getItem("sidebar-collapsed") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must sync after mount to avoid SSR/hydration mismatch
    setIsOpen(!collapsed);
  }, []);

  const sessionUser = useSession();

  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar-collapsed", String(!next));
      }
      return next;
    });
  };

  const isActiveRoute = (link: string) => {
    if (link === "/dashboard") return pathname === "/dashboard";
    return pathname === link || pathname.startsWith(`${link}/`);
  };

  const getLinkClasses = (active: boolean) =>
    `flex items-center p-2.5 rounded-lg transition-colors group ${
      isOpen || mobileOpen ? "gap-3" : "lg:justify-center"
    } ${
      active
        ? "text-primary bg-primary/10 font-semibold"
        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
    }`;

  const labelClasses = (extra: string = "") =>
    `whitespace-nowrap font-medium transition-all duration-300 ${
      mobileOpen ? "block opacity-100" : "hidden opacity-0"
    } ${isOpen ? "lg:block lg:opacity-100" : "lg:hidden lg:opacity-0"} ${extra}`;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onMobileClose}
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-xs transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen flex flex-col bg-card border-r border-border transition-all duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0 shadow-2xl lg:shadow-none"
            : "-translate-x-full"
        } ${isOpen ? "lg:w-64" : "lg:w-20"}`}
      >
        {/* Top Section: Logo & Brand */}
        <div className="flex items-center justify-between h-16 border-b border-border px-4">
          <div
            className={`flex items-center min-w-0 flex-1 ${
              isOpen || mobileOpen ? "gap-2.5" : "lg:justify-center"
            }`}
            title="Task Board"
          >
            {/* App logo mark — always visible, keeps identity when collapsed */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
              TB
            </div>
            {/* Wordmark — slides away when collapsed on desktop */}
            <div className={labelClasses("overflow-hidden")}>
              <h1 className="font-bold text-xl text-foreground whitespace-nowrap">
                Task Board
              </h1>
            </div>
          </div>

          {/* Mobile Close Button — dismisses the drawer on small screens */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden shrink-0"
            title="Close Sidebar"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
          <ul className="flex flex-col gap-2">
            {sidebarLinks.map((sidebar) => {
              const active = isActiveRoute(sidebar.link);
              return (
                <li key={sidebar.id}>
                  <Link
                    href={sidebar.link}
                    onClick={onMobileClose}
                    className={getLinkClasses(active)}
                    title={!isOpen && !mobileOpen ? sidebar.name : ""}
                  >
                    <div
                      className={`min-w-fit ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"} transition-colors`}
                    >
                      <sidebar.icon size={20} />
                    </div>
                    <span className={labelClasses()}>{sidebar.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section: Settings, Help & Profile */}
        <div className="border-t border-border p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2 pb-2 border-b border-border">
            <Link
              href="/dashboard/settings"
              onClick={onMobileClose}
              className={getLinkClasses(isActiveRoute("/dashboard/settings"))}
              title={!isOpen && !mobileOpen ? "Settings" : ""}
            >
              <div className="min-w-fit">
                <Settings size={20} />
              </div>
              <span className={labelClasses()}>Settings</span>
            </Link>
            <Link
              href="/dashboard/help&support"
              onClick={onMobileClose}
              className={getLinkClasses(
                isActiveRoute("/dashboard/help&support"),
              )}
              title={!isOpen && !mobileOpen ? "Help & Support" : ""}
            >
              <div className="min-w-fit">
                <CircleQuestionMark size={20} />
              </div>
              <span className={labelClasses()}>Help & Support</span>
            </Link>
          </div>

          {/* User Profile — links to settings */}
          <Link
            href="/dashboard/settings"
            className={`flex items-center p-2 mt-2 rounded-lg transition-colors cursor-pointer ${
              isOpen || mobileOpen ? "gap-3 justify-start hover:bg-muted" : "lg:justify-center"
            }`}
          >
            <div className="p-2 bg-primary/15 text-primary rounded-full min-w-fit">
              <UserRound size={20} />
            </div>
            <div
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                mobileOpen ? "opacity-100 block" : "opacity-0 hidden"
              } ${isOpen ? "lg:block lg:opacity-100" : "lg:hidden lg:opacity-0"}`}
            >
              <h1 className="font-bold text-sm text-foreground">
                {sessionUser?.fullName ?? currentUser.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {sessionUser?.role ?? currentUser.role}
              </p>
            </div>
          </Link>
        </div>

        {/* Collapse Toggle — desktop only, pinned at the bottom so it never floats in a wrong spot */}
        <div className="border-t border-border p-3 hidden lg:block">
          <button
            type="button"
            onClick={toggleSidebar}
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            className={`flex items-center w-full p-2.5 rounded-lg transition-colors text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer ${
              isOpen ? "gap-3" : "lg:justify-center"
            }`}
          >
            <div className="min-w-fit">
              {isOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelRightClose size={20} />
              )}
            </div>
            <span className={labelClasses()}>
              {isOpen ? "Collapse" : "Expand"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
