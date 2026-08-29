"use client";

import React, { useEffect, useRef } from "react";
import {
  CheckCircle2,
  UserPlus,
  History,
  AtSign,
  AlertTriangle,
  CheckCheck,
  Trash2,
  Mail,
  MailOpen,
} from "lucide-react";
import { type DropdownNotification } from "@/data/notifications";
import { useNotifications } from "@/lib/notificationsStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    notifications,
    markRead,
    markAllRead,
    removeNotification,
    unreadCount,
  } = useNotifications();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Mark a single notification as read and close modal
  const handleNotificationClick = (id: string) => {
    markRead(id);
    onClose();
  };

  const todayNotifications = notifications.filter((n) => n.section === "TODAY");
  const earlierNotifications = notifications.filter(
    (n) => n.section === "EARLIER",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6">
      {/* Invisible Backdrop for click outside overlay handling */}
      <div className="fixed inset-0 bg-transparent" onClick={onClose} />

      {/* Notifications Card Container */}
      <div
        ref={modalRef}
        className="relative w-full max-w-sm bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 border border-border animate-in fade-in slide-in-from-top-2 duration-200 mt-12 sm:mr-8"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-1.5" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[75vh] overflow-y-auto divide-y divide-border">
          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <div>
              <div className="px-5 pt-3.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Today
              </div>
              <div>
                {todayNotifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onRead={markRead}
                    onDelete={removeNotification}
                    onClick={(id) => handleNotificationClick(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Earlier Section */}
          {earlierNotifications.length > 0 && (
            <div>
              <div className="px-5 pt-3.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Earlier
              </div>
              <div className="divide-y divide-border/60">
                {earlierNotifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onRead={markRead}
                    onDelete={removeNotification}
                    onClick={(id) => handleNotificationClick(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {notifications.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                You&apos;re all caught up
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No notifications right now.
              </p>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-3 border-t border-border text-center bg-muted/30">
          {/* Navigate to full notifications page */}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              onClose();
              router.push("/dashboard/notifications");
            }}
          >
            View All Notifications
          </Button>
        </div>
      </div>
    </div>
  );
}

/* === Single notification row (shared by the dropdown + full page) === */
function NotificationRow({
  notification,
  onRead,
  onDelete,
  onClick,
}: {
  notification: DropdownNotification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onClick(notification.id)}
      className={`group relative flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
        notification.unread ? "bg-primary/20" : "hover:bg-muted/50"
      }`}
    >
      {/* Unread Active Blue Indicator Bar & Dot */}
      {notification.unread && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-primary rounded-r" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary absolute left-2.5 top-6" />
        </>
      )}

      {/* Avatar with Status Icon Badge */}
      <div className="relative shrink-0 ml-2">
        {notification.avatar ? (
          <Avatar className="w-9 h-9">
            <AvatarImage
              src={notification.avatar}
              alt={notification.actor ?? ""}
            />
            <AvatarFallback>
              {notification.actor?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground border border-border">
            {notification.actor?.charAt(0) ?? "?"}
          </div>
        )}
        {notification.type === "completed" && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white ring-2 ring-card">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        )}
        {notification.type === "assigned" && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white ring-2 ring-card">
            <UserPlus className="w-2.5 h-2.5" />
          </div>
        )}
      </div>

      {/* Notification Details */}
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs text-foreground leading-snug">
          <strong className="font-semibold text-foreground">
            {notification.actor}{" "}
          </strong>
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

      {/* Hover Quick Actions */}
      <div
        className="hidden group-hover:flex items-center gap-0.5 shrink-0 text-muted-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          title={notification.unread ? "Mark as read" : "Mark as unread"}
          onClick={() => onRead(notification.id)}
        >
          {notification.unread ? (
            <MailOpen className="w-3.5 h-3.5" />
          ) : (
            <Mail className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 text-rose-600 hover:text-rose-600"
          title="Delete"
          onClick={() => onDelete(notification.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* === Icon badge helper for "Earlier" category notifications === */
export function NotificationTypeIcon({
  type,
}: {
  type: DropdownNotification["type"];
}) {
  if (type === "updated") {
    return (
      <div className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
        <History className="w-4 h-4" />
      </div>
    );
  }
  if (type === "mentioned") {
    return (
      <div className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
        <AtSign className="w-4 h-4" />
      </div>
    );
  }
  if (type === "warning") {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center">
        <AlertTriangle className="w-4 h-4" />
      </div>
    );
  }
  return null;
}