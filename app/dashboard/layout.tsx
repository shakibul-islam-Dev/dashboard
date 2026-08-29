"use client";

import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { useSession } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSession();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <div className="flex h-screen w-full bg-muted overflow-hidden">
      <DashboardSideBar
        mobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 w-full min-w-0 h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header>
          <DashboardNavigation
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
