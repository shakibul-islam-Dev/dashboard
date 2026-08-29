"use client";

import React from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Mail,
  MailOpen,
  Inbox,
} from "lucide-react";
import { useNotifications } from "@/lib/notificationsStore";
import { type DropdownNotification } from "@/data/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, UserPlus } from "lucide-react";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";

export default function NotificationsPage() {
  const {
    notifications,
    markRead,
    markUnread,
    markAllRead,
    removeNotification,
    clearAll,
    unreadCount,
  } = useNotifications();

  const todayNotifications = notifications.filter((n) => n.section === "TODAY");
  const earlierNotifications = notifications.filter(
    (n) => n.section === "EARLIER",
  );

  return (
    <PageContainer className="space-y-6">
      <PageNav />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Notifications
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Updates from your tasks, projects, and teammates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearAll} className="gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </Button>
          {unreadCount > 0 && (
            <Button size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Card className="shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {/* Summary strip */}
          <div className="px-5 py-3 border-b border-border bg-muted/40 flex items-center gap-3 text-xs text-muted-foreground">
            <Inbox className="w-4 h-4" />
            <span>{notifications.length} notification{notifications.length !== 1 ? "s" : ""}</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-0.5 text-[10px] font-semibold">
                {unreadCount} unread
              </Badge>
            )}
          </div>

          {/* Empty state */}
          {notifications.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                You&apos;re all caught up
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                New activity will show up here.
              </p>
            </div>
          )}

          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <div>
              <div className="px-5 pt-4 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Today
              </div>
              <div className="divide-y divide-border">
                {todayNotifications.map((notification) => (
                  <FeedRow
                    key={notification.id}
                    notification={notification}
                    onRead={markRead}
                    onUnread={markUnread}
                    onDelete={removeNotification}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Earlier Section */}
          {earlierNotifications.length > 0 && (
            <div>
              <div className="px-5 pt-4 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Earlier
              </div>
              <div className="divide-y divide-border">
                {earlierNotifications.map((notification) => (
                  <FeedRow
                    key={notification.id}
                    notification={notification}
                    onRead={markRead}
                    onUnread={markUnread}
                    onDelete={removeNotification}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

/* === Full-page notification row === */
function FeedRow({
  notification,
  onRead,
  onUnread,
  onDelete,
}: {
  notification: DropdownNotification;
  onRead: (id: string) => void;
  onUnread: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onRead(notification.id)}
      className={`group flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${
        notification.unread ? "bg-primary/10" : "hover:bg-muted/40"
      }`}
    >
      {/* Unread dot */}
      {notification.unread && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
      )}

      {/* Avatar with Status Icon Badge */}
      <div className="relative shrink-0 ml-1">
        {notification.avatar ? (
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={notification.avatar}
              alt={notification.actor ?? ""}
            />
            <AvatarFallback>
              {notification.actor?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground border border-border">
            {notification.actor?.charAt(0) ?? "?"}
          </div>
        )}
        {notification.type === "completed" && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center text-white ring-2 ring-card">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        )}
        {notification.type === "assigned" && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-primary rounded-full flex items-center justify-center text-white ring-2 ring-card">
            <UserPlus className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 pr-1">
        <p className={`text-sm leading-snug ${notification.unread ? "font-medium text-foreground" : "text-foreground/80"}`}>
          {notification.actor && (
            <strong className="font-semibold text-foreground">
              {notification.actor}{" "}
            </strong>
          )}
          {notification.title}{" "}
          {notification.target && (
            <span className="font-semibold text-foreground">
              {notification.target}
            </span>
          )}
        </p>
        <span className="text-[11px] font-mono text-muted-foreground mt-1 block">
          {notification.time}
        </span>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-0.5 shrink-0 text-muted-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-auto py-1.5"
          title={notification.unread ? "Mark as read" : "Mark as unread"}
          onClick={() =>
            notification.unread
              ? onRead(notification.id)
              : onUnread(notification.id)
          }
        >
          {notification.unread ? (
            <MailOpen className="w-3.5 h-3.5" />
          ) : (
            <Mail className="w-3.5 h-3.5" />
          )}
          {notification.unread ? "Read" : "Unread"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-auto py-1.5 text-rose-600 hover:text-rose-600"
          title="Delete"
          onClick={() => onDelete(notification.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}