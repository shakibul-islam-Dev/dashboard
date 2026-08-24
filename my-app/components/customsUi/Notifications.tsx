"use client";

import React, { useState } from "react";
import {
  Square,
  CheckSquare,
  Star,
  Trash2,
  Mail,
  MailOpen,
  Tag,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  Users,
  Search,
  MoreVertical,
} from "lucide-react";

interface NotificationItem {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  category: "primary" | "social" | "updates";
  isRead: boolean;
  isStarred: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    sender: "GitHub",
    subject: "[Security] High severity vulnerability found in next.js",
    snippet:
      "We found a potential security vulnerability in your repository main-branch...",
    time: "10:42 AM",
    category: "primary",
    isRead: false,
    isStarred: true,
  },
  {
    id: "2",
    sender: "Vercel Team",
    subject: "Deployment Successful: production-api-v2",
    snippet:
      "Your project SunCart was successfully deployed to production in 42 seconds...",
    time: "8:15 AM",
    category: "updates",
    isRead: false,
    isStarred: false,
  },
  {
    id: "3",
    sender: "Sarah Chen",
    subject: "Mentioned you in TASK-124: Authentication flow",
    snippet:
      "@shakib can you take a look at the token refresh interval issue before merged?",
    time: "Yesterday",
    category: "primary",
    isRead: true,
    isStarred: true,
  },
  {
    id: "4",
    sender: "LinkedIn",
    subject: "Alex Morgan and 3 others viewed your profile",
    snippet:
      "See who is looking at your profile this week and connect with team leads...",
    time: "Aug 21",
    category: "social",
    isRead: true,
    isStarred: false,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [activeTab, setActiveTab] = useState<"primary" | "social" | "updates">(
    "primary",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Tab Filtering
  const filteredNotifications = notifications.filter(
    (n) => n.category === activeTab,
  );

  // Selection Logic
  const allSelected =
    filteredNotifications.length > 0 &&
    filteredNotifications.every((n) => selectedIds.includes(n.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Toggle Star
  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isStarred: !n.isStarred } : n)),
    );
  };

  // Bulk Actions
  const markSelectedAsRead = (isRead: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.includes(n.id) ? { ...n, isRead } : n)),
    );
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  // Row Click
  const handleRowClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans text-slate-800">
      {/* Top Search Bar */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex-1 max-w-2xl relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search mail and notifications..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1.5 hover:bg-slate-200/60 rounded-full transition-colors text-slate-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-slate-600 bg-white">
        <div className="flex items-center gap-2">
          {/* Select All Checkbox */}
          <button
            onClick={toggleSelectAll}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>

          {/* Bulk Actions (Only visible when items are selected) */}
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200 animate-in fade-in duration-150">
              <button
                onClick={() => markSelectedAsRead(true)}
                title="Mark as read"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
              >
                <MailOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => markSelectedAsRead(false)}
                title="Mark as unread"
                className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={deleteSelected}
                title="Delete"
                className="p-1.5 hover:bg-slate-100 rounded text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            1–{filteredNotifications.length} of {filteredNotifications.length}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gmail-Style Category Tabs */}
      <div className="flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveTab("primary")}
          className={`flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "primary"
              ? "border-blue-600 text-blue-600 bg-blue-50/20"
              : "border-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Primary</span>
        </button>

        <button
          onClick={() => setActiveTab("updates")}
          className={`flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "updates"
              ? "border-blue-600 text-blue-600 bg-blue-50/20"
              : "border-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Updates</span>
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "social"
              ? "border-blue-600 text-blue-600 bg-blue-50/20"
              : "border-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Social</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleRowClick(item.id)}
                className={`group flex flex-col cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-50/60"
                    : item.isRead
                      ? "bg-slate-50/40 hover:bg-slate-100/60"
                      : "bg-white font-semibold hover:bg-slate-50"
                }`}
              >
                {/* Compact Row Header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Row Checkbox */}
                  <button
                    onClick={(e) => toggleSelectOne(item.id, e)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  {/* Star */}
                  <button
                    onClick={(e) => toggleStar(item.id, e)}
                    className="text-slate-300 hover:text-amber-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isStarred ? "text-amber-400 fill-amber-400" : ""
                      }`}
                    />
                  </button>

                  {/* Sender Name */}
                  <div className="w-32 shrink-0 truncate text-xs text-slate-900">
                    {item.sender}
                  </div>

                  {/* Subject & Snippet Container */}
                  <div className="flex-1 min-w-0 flex items-center gap-2 text-xs">
                    <span className="text-slate-900 truncate">
                      {item.subject}
                    </span>
                    <span className="text-slate-400 font-normal truncate">
                      — {item.snippet}
                    </span>
                  </div>

                  {/* Date/Time */}
                  <div className="w-20 text-right shrink-0 text-[11px] font-mono text-slate-400 group-hover:hidden">
                    {item.time}
                  </div>

                  {/* Hover Quick Action Icons */}
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0 text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSelected();
                      }}
                      className="p-1 hover:text-rose-600 hover:bg-slate-200/50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, isRead: !n.isRead } : n,
                          ),
                        );
                      }}
                      className="p-1 hover:text-slate-700 hover:bg-slate-200/50 rounded"
                    >
                      {item.isRead ? (
                        <Mail className="w-3.5 h-3.5" />
                      ) : (
                        <MailOpen className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline Expanded View */}
                {isExpanded && (
                  <div className="px-12 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50">
                    <p className="leading-relaxed">{item.snippet}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium text-[11px]">
                        Reply
                      </button>
                      <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium text-[11px]">
                        Forward
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
