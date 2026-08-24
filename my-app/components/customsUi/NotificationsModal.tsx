"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  UserPlus,
  History,
  AtSign,
  AlertTriangle,
} from "lucide-react";
import {
  dropdownNotifications as initialData,
  type DropdownNotification,
} from "@/data/notifications";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<DropdownNotification[]>(
    initialData,
  );

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
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
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-primary hover:text-primary transition-colors"
          >
            Mark all as read
          </button>
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
                  <div
                    key={notification.id}
                    className={`relative flex items-start gap-3 px-5 py-3.5 transition-colors ${
                      notification.unread
                        ? "bg-primary/20"
                        : "hover:bg-muted/50"
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
                      <img
                        src={notification.avatar}
                        alt={notification.actor}
                        className="w-9 h-9 rounded-full object-cover border border-border"
                      />
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
                  </div>
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
                  <div
                    key={notification.id}
                    className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-muted/50 transition-colors"
                  >
                    {/* Icon Category Badges */}
                    <div className="shrink-0">
                      {notification.type === "updated" && (
                        <div className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                          <History className="w-4 h-4" />
                        </div>
                      )}
                      {notification.type === "mentioned" && (
                        <div className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                          <AtSign className="w-4 h-4" />
                        </div>
                      )}
                      {notification.type === "warning" && (
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Detail Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">
                        {notification.title}
                      </p>
                      <span className="text-[11px] font-mono text-muted-foreground mt-1 block">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-3 border-t border-border text-center bg-muted/30">
          <button
            type="button"
            className="text-xs font-semibold text-primary hover:text-primary transition-colors w-full py-1 rounded-md hover:bg-primary/10"
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
