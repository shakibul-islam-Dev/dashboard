"use client";

import React, { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  Calendar,
  ChevronDown,
  Check,
  ArrowRight,
  Plus,
  UserPlus,
  Pencil,
  MessageSquare,
  LucideIcon,
} from "lucide-react";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    initials: string;
  };
  action: string;
  target?: string;
  time: string;
  project?: string | null;
  comment?: string;
  icon: LucideIcon;
  iconBg: string;
}

interface ActivityGroup {
  section: string;
  items: ActivityItem[];
}

const activityData: ActivityGroup[] = [
  {
    section: "TODAY",
    items: [
      {
        id: "1",
        user: { name: "Sarah Chen", initials: "SC" },
        action: "completed",
        target: '"Navbar Design"',
        time: "2 hours ago",
        project: "Website Redesign",
        icon: Check,
        iconBg: "bg-emerald-500",
      },
      {
        id: "2",
        user: { name: "John Carter", initials: "JC" },
        action: 'moved "Authentication UI" to Review',
        time: "4 hours ago",
        project: "Authentication System",
        icon: ArrowRight,
        iconBg: "bg-amber-500",
      },
    ],
  },
  {
    section: "YESTERDAY",
    items: [
      {
        id: "3",
        user: { name: "Alex Morgan", initials: "AM" },
        action: "created",
        target: '"Database Schema"',
        time: "Yesterday",
        project: "Mobile App",
        icon: Plus,
        iconBg: "bg-blue-600",
      },
      {
        id: "4",
        user: { name: "Maya Patel", initials: "MP" },
        action: 'assigned "Mobile Navigation" to Alex Morgan',
        time: "Yesterday",
        project: "Mobile App",
        icon: UserPlus,
        iconBg: "bg-slate-700",
      },
    ],
  },
  {
    section: "EARLIER THIS WEEK",
    items: [
      {
        id: "5",
        user: { name: "David Kim", initials: "DK" },
        action: "updated description for Website Redesign",
        time: "Earlier This Week",
        project: null,
        icon: Pencil,
        iconBg: "bg-slate-600",
      },
      {
        id: "6",
        user: { name: "Emily Wilson", initials: "EW" },
        action: 'commented on "API Integration"',
        time: "Earlier This Week",
        project: null,
        comment:
          '"I\'ve pushed the latest endpoints to staging. The documentation is updated in the wiki."',
        icon: MessageSquare,
        iconBg: "bg-blue-600",
      },
    ],
  },
];

const tabs = ["All Activity", "Tasks", "Projects", "Team", "Comments"];

export default function ActivityPages() {
  const [activeTab, setActiveTab] = useState("All Activity");

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <PathProvider />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Activity</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track recent changes across your workspace.
        </p>
      </div>

      {/* Navigation Tabs and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 mb-8 gap-4">
        <nav className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap relative ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="pb-3 self-end sm:self-auto">
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Date Range</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Activity Timeline */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 md:p-8 shadow-xs max-w-5xl">
        <div className="relative">
          {/* Vertical Timeline Bar */}
          <div className="absolute top-3 left-4.75 bottom-6 w-[1.5px] bg-slate-200/80" />

          <div className="space-y-8 relative">
            {activityData.map((group) => (
              <div key={group.section} className="space-y-6">
                <div className="pl-12">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {group.section}
                  </span>
                </div>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-4 items-start"
                    >
                      {/* Avatar Circle & Badge */}
                      <div className="relative z-10 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center ring-4 ring-white">
                          {item.user.initials}
                        </div>

                        <div
                          className={`absolute -bottom-0.5 -right-0.5 ${item.iconBg} text-white p-0.5 rounded-full ring-2 ring-white flex items-center justify-center`}
                        >
                          <Icon className="w-2.5 h-2.5 stroke-3" />
                        </div>
                      </div>

                      {/* Item Content */}
                      <div className="pt-1 flex-1 min-w-0">
                        <p className="text-sm text-slate-800 leading-snug">
                          <span className="font-semibold text-slate-900">
                            {item.user.name}
                          </span>{" "}
                          <span className="text-slate-700">{item.action}</span>{" "}
                          {item.target && (
                            <span className="font-semibold text-blue-600">
                              {item.target}
                            </span>
                          )}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span>{item.time}</span>
                          {item.project && (
                            <>
                              <span>•</span>
                              <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[11px]">
                                {item.project}
                              </span>
                            </>
                          )}
                        </div>

                        {item.comment && (
                          <div className="mt-3 p-3.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 leading-relaxed max-w-xl">
                            {item.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
