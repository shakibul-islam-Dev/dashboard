"use client";

import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
