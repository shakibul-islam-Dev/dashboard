import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <DashboardSideBar />

      <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header>
          <DashboardNavigation />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
