"use client";

import React, { useState } from "react";
import {
  Square,
  CheckSquare,
  Star,
  Trash2,
  Mail,
  MailOpen,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  Users,
  Search,
  MoreVertical,
} from "lucide-react";
import {
  mailNotifications as initialNotifications,
  type MailNotification,
} from "@/data/notifications";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<MailNotification[]>(initialNotifications);
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
    <div className="w-full max-w-5xl mx-auto bg-card rounded-2xl shadow-xl border border-border overflow-hidden font-sans text-foreground">
      {/* Top Search Bar */}
      <div className="px-6 py-3 border-b border-border flex items-center justify-between gap-4 bg-muted/50">
        <div className="flex-1 max-w-2xl relative flex items-center">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5" />
          <input
            type="text"
            placeholder="Search mail and notifications..."
            className="w-full pl-10 pr-4 py-2 bg-muted hover:bg-muted focus:bg-card border border-transparent focus:border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button className="p-1.5 hover:bg-muted/60 rounded-full transition-colors text-muted-foreground">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between text-muted-foreground bg-card">
        <div className="flex items-center gap-2">
          {/* Select All Checkbox */}
          <button
            onClick={toggleSelectAll}
            className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-primary" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>

          {/* Bulk Actions (Only visible when items are selected) */}
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-1 pl-2 border-l border-border animate-in fade-in duration-150">
              <button
                onClick={() => markSelectedAsRead(true)}
                title="Mark as read"
                className="p-1.5 hover:bg-muted rounded text-muted-foreground"
              >
                <MailOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => markSelectedAsRead(false)}
                title="Mark as unread"
                className="p-1.5 hover:bg-muted rounded text-muted-foreground"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={deleteSelected}
                title="Delete"
                className="p-1.5 hover:bg-muted rounded text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            1–{filteredNotifications.length} of {filteredNotifications.length}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-muted rounded disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-muted rounded disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gmail-Style Category Tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab("primary")}
          className={`flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "primary"
              ? "border-primary text-primary bg-primary/20"
              : "border-transparent text-muted-foreground hover:bg-muted"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Primary</span>
        </button>

        <button
          onClick={() => setActiveTab("updates")}
          className={`flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "updates"
              ? "border-primary text-primary bg-primary/20"
              : "border-transparent text-muted-foreground hover:bg-muted"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Updates</span>
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "social"
              ? "border-primary text-primary bg-primary/20"
              : "border-transparent text-muted-foreground hover:bg-muted"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Social</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
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
                    ? "bg-primary/30"
                    : item.isRead
                      ? "bg-muted/40 hover:bg-muted/60"
                      : "bg-card font-semibold hover:bg-muted"
                }`}
              >
                {/* Compact Row Header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Row Checkbox */}
                  <button
                    onClick={(e) => toggleSelectOne(item.id, e)}
                    className="text-muted-foreground hover:text-muted-foreground"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  {/* Star */}
                  <button
                    onClick={(e) => toggleStar(item.id, e)}
                    className="text-muted-foreground/70 hover:text-destructive"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isStarred ? "text-amber-400 fill-amber-400" : ""
                      }`}
                    />
                  </button>

                  {/* Sender Name */}
                  <div className="w-24 sm:w-32 shrink-0 truncate text-xs text-foreground">
                    {item.sender}
                  </div>

                  {/* Subject & Snippet Container */}
                  <div className="flex-1 min-w-0 flex items-center gap-2 text-xs">
                    <span className="text-foreground truncate">
                      {item.subject}
                    </span>
                    <span className="text-muted-foreground font-normal truncate hidden md:inline">
                      — {item.snippet}
                    </span>
                  </div>

                  {/* Date/Time */}
                  <div className="w-20 text-right shrink-0 text-[11px] font-mono text-muted-foreground group-hover:hidden">
                    {item.time}
                  </div>

                  {/* Hover Quick Action Icons */}
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0 text-muted-foreground">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSelected();
                      }}
                      className="p-1 hover:text-rose-600 hover:bg-muted/50 rounded"
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
                      className="p-1 hover:text-foreground hover:bg-muted/50 rounded"
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
                  <div className="px-6 sm:px-12 pb-4 pt-1 text-xs text-muted-foreground border-t border-border bg-muted/50">
                    <p className="leading-relaxed">{item.snippet}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="px-3 py-1 bg-card border border-border rounded text-foreground hover:bg-muted font-medium text-[11px]">
                        Reply
                      </button>
                      <button className="px-3 py-1 bg-card border border-border rounded text-foreground hover:bg-muted font-medium text-[11px]">
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
