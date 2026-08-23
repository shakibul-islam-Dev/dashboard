"use client";
import {
  CircleQuestionMark,
  FolderOpenDot,
  LayoutDashboard,
  PanelRightClose,
  PanelLeftClose,
  Settings,
  UserRound,
  FolderRoot,
  ClipboardCheck,
  ClockFading,
  ChartColumnBig,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const dashboardSidebarLink = [
  {
    id: 1,
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    id: 2,
    icon: <FolderOpenDot size={20} />,
    name: "Projects",
    link: "/dashboard/projects",
  },
  {
    id: 3,
    icon: <FolderRoot size={20} />,
    name: "Projects Board",
    link: "/dashboard/project-board",
  },
  {
    id: 4,
    icon: <ClipboardCheck size={20} />,
    name: "My Tasks",
    link: "/dashboard/my-task",
  },
  {
    id: 5,
    icon: <ClockFading size={20} />,
    name: "Activity",
    link: "/dashboard/activity",
  },
  {
    id: 6,
    icon: <UserRound size={20} />,
    name: "Team",
    link: "/dashboard/team",
  },
  {
    id: 7,
    icon: <ChartColumnBig size={20} />,
    name: "Analytics",
    link: "/dashboard/analytics",
  },
];

export default function DashboardSideBar() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside
      className={`h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Top Section: Logo/Title & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
        <div
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
          }`}
        >
          <h1 className="font-bold text-xl text-gray-800">Task Board</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors mx-auto"
          title="Toggle Sidebar"
        >
          {isOpen ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelRightClose size={20} />
          )}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3">
        <ul className="flex flex-col gap-2">
          {dashboardSidebarLink.map((sidebar) => (
            <li key={sidebar.id}>
              <Link
                href={sidebar.link}
                className="flex items-center gap-3 p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors group"
                title={!isOpen ? sidebar.name : ""}
              >
                <div className="min-w-fit">{sidebar.icon}</div>
                <span
                  className={`whitespace-nowrap transition-all duration-300 font-medium ${
                    isOpen ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                >
                  {sidebar.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section: Settings, Help & Profile */}
      <div className="border-t border-gray-200 p-3 flex flex-col gap-2">
        <div className="flex flex-col gap-2 pb-2 border-b border-gray-100">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title={!isOpen ? "Settings" : ""}
          >
            <div className="min-w-fit">
              <Settings size={20} />
            </div>
            <span
              className={`whitespace-nowrap font-medium transition-all duration-300 ${isOpen ? "opacity-100 block" : "opacity-0 hidden"}`}
            >
              Settings
            </span>
          </Link>
          <Link
            href="/dashboard/help-support"
            className="flex items-center gap-3 p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title={!isOpen ? "Help & Support" : ""}
          >
            <div className="min-w-fit">
              <CircleQuestionMark size={20} />
            </div>
            <span
              className={`whitespace-nowrap font-medium transition-all duration-300 ${isOpen ? "opacity-100 block" : "opacity-0 hidden"}`}
            >
              Help & Support
            </span>
          </Link>
        </div>

        {/* User Profile */}
        <div
          className={`flex items-center gap-3 p-2 mt-2 rounded-lg ${isOpen ? "hover:bg-gray-50" : ""} transition-colors cursor-pointer`}
        >
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full min-w-fit">
            <UserRound size={20} />
          </div>
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100 w-auto block" : "opacity-0 w-0 hidden"}`}
          >
            <h1 className="font-bold text-sm text-gray-800">Alex Morgan</h1>
            <p className="text-xs text-gray-500">Product Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
