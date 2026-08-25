"use client";

import React, { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  mailNotifications as initialNotifications,
  type MailNotification,
} from "@/data/notifications";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<MailNotification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<"primary" | "social" | "updates">(
    "primary",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // --- Search Filtering ---
  const [searchQuery, setSearchQuery] = useState("");
  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);

  // Tab + Search Filtering
  const filteredNotifications = useMemo(() => {
    const tabFiltered = notifications.filter((n) => n.category === activeTab);
    if (!searchQuery.trim()) return tabFiltered;
    const q = searchQuery.toLowerCase();
    return tabFiltered.filter(
      (n) =>
        n.sender.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        n.snippet.toLowerCase().includes(q),
    );
  }, [notifications, activeTab, searchQuery]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedNotifications = filteredNotifications.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );
  const pageStart = filteredNotifications.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const pageEnd = Math.min(safePage * ITEMS_PER_PAGE, filteredNotifications.length);

  // Selection Logic
  const allSelected =
    paginatedNotifications.length > 0 &&
    paginatedNotifications.every((n) => selectedIds.includes(n.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedNotifications.map((n) => n.id));
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

  // --- Single delete: removes just one notification by id ---
  const deleteSingle = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // --- Reply / Forward placeholder handlers (show toast) ---
  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Reply", {
      description: "Reply functionality coming soon.",
    });
  };

  const handleForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Forward", {
      description: "Forward functionality coming soon.",
    });
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
          {/* Search input for filtering notifications */}
          <Input
            type="text"
            placeholder="Search mail and notifications..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-muted hover:bg-muted focus:bg-card border border-transparent focus:border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          {/* More options menu button */}
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between text-muted-foreground bg-card">
        <div className="flex items-center gap-2">
          {/* Select all / deselect all toggle */}
          <Button variant="ghost" size="icon" onClick={toggleSelectAll}>
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-primary" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </Button>

          {/* Bulk Actions (Only visible when items are selected) */}
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-1 pl-2 border-l border-border animate-in fade-in duration-150">
              {/* Bulk action: mark selected as read */}
              <Button variant="ghost" size="icon" onClick={() => markSelectedAsRead(true)} title="Mark as read">
                <MailOpen className="w-4 h-4" />
              </Button>
              {/* Bulk action: mark selected as unread */}
              <Button variant="ghost" size="icon" onClick={() => markSelectedAsRead(false)} title="Mark as unread">
                <Mail className="w-4 h-4" />
              </Button>
              {/* Bulk action: delete selected */}
              <Button variant="ghost" size="icon" onClick={deleteSelected} title="Delete">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            {pageStart}–{pageEnd} of {filteredNotifications.length}
          </span>
          <div className="flex items-center gap-1">
            {/* Pagination: previous page */}
            <Button
              variant="ghost"
              size="icon"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {/* Pagination: next page */}
            <Button
              variant="ghost"
              size="icon"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Gmail-Style Category Tabs */}
      <div className="flex border-b border-border bg-card">
        {/* Category tab: Primary */}
        <Button
          variant={activeTab === "primary" ? "default" : "ghost"}
          onClick={() => { setActiveTab("primary"); setCurrentPage(1); }}
          className="flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 rounded-none transition-colors"
        >
          <Inbox className="w-4 h-4" />
          <span>Primary</span>
        </Button>

        {/* Category tab: Updates */}
        <Button
          variant={activeTab === "updates" ? "default" : "ghost"}
          onClick={() => { setActiveTab("updates"); setCurrentPage(1); }}
          className="flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 rounded-none transition-colors"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Updates</span>
        </Button>

        {/* Category tab: Social */}
        <Button
          variant={activeTab === "social" ? "default" : "ghost"}
          onClick={() => { setActiveTab("social"); setCurrentPage(1); }}
          className="flex-1 flex items-center gap-3 px-6 py-3 text-xs font-semibold border-b-2 rounded-none transition-colors"
        >
          <Users className="w-4 h-4" />
          <span>Social</span>
        </Button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {paginatedNotifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No notifications in this category.
          </div>
        ) : (
          paginatedNotifications.map((item) => {
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
                  {/* Row checkbox for individual selection */}
                  <Button variant="ghost" size="icon" onClick={(e) => toggleSelectOne(item.id, e)}>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Star/unstar toggle for this notification */}
                  <Button variant="ghost" size="icon" onClick={(e) => toggleStar(item.id, e)}>
                    <Star
                      className={`w-4 h-4 ${
                        item.isStarred ? "text-amber-400 fill-amber-400" : ""
                      }`}
                    />
                  </Button>

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
                    {/* Row action: delete single notification */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSingle(item.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </Button>
                    {/* Row action: toggle read/unread */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === item.id ? { ...n, isRead: !n.isRead } : n,
                          ),
                        );
                      }}
                    >
                      {item.isRead ? (
                        <Mail className="w-3.5 h-3.5" />
                      ) : (
                        <MailOpen className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Inline Expanded View */}
                {isExpanded && (
                  <div className="px-6 sm:px-12 pb-4 pt-1 text-xs text-muted-foreground border-t border-border bg-muted/50">
                    <p className="leading-relaxed">{item.snippet}</p>
                    <div className="mt-3 flex items-center gap-2">
                      {/* Reply to this notification */}
                      <Button variant="outline" size="sm" onClick={handleReply}>
                        Reply
                      </Button>
                      {/* Forward this notification */}
                      <Button variant="outline" size="sm" onClick={handleForward}>
                        Forward
                      </Button>
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
