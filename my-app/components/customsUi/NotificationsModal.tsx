"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  UserPlus,
  History,
  AtSign,
  AlertTriangle,
} from "lucide-react";

interface Notification {
  id: string;
  type: "completed" | "assigned" | "updated" | "mentioned" | "warning";
  actor?: string;
  avatar?: string;
  title: string;
  target?: string;
  time: string;
  unread: boolean;
  section: "TODAY" | "EARLIER";
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "completed",
      actor: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      title: "completed",
      target: '"API Integration"',
      time: "2m ago",
      unread: true,
      section: "TODAY",
    },
    {
      id: "2",
      type: "assigned",
      actor: "John Carter",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      title: 'assigned "Authentication UI" to you',
      time: "1h ago",
      unread: true,
      section: "TODAY",
    },
    {
      id: "3",
      type: "updated",
      title: '"Website Redesign" was updated',
      time: "Yesterday",
      unread: false,
      section: "EARLIER",
    },
    {
      id: "4",
      type: "mentioned",
      title: "You were mentioned in TASK-124",
      time: "Yesterday",
      unread: false,
      section: "EARLIER",
    },
    {
      id: "5",
      type: "warning",
      title: '"Mobile App" deadline is approaching',
      time: "Oct 24",
      unread: false,
      section: "EARLIER",
    },
  ]);

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
        className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden font-sans text-slate-800 z-10 border border-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-200 mt-12 sm:mr-8"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Notifications</h2>
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[75vh] overflow-y-auto divide-y divide-slate-100">
          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <div>
              <div className="px-5 pt-3.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Today
              </div>
              <div>
                {todayNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative flex items-start gap-3 px-5 py-3.5 transition-colors ${
                      notification.unread
                        ? "bg-blue-50/30"
                        : "hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Unread Active Blue Indicator Bar & Dot */}
                    {notification.unread && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-600 rounded-r" />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute left-2.5 top-6" />
                      </>
                    )}

                    {/* Avatar with Status Icon Badge */}
                    <div className="relative shrink-0 ml-2">
                      <img
                        src={notification.avatar}
                        alt={notification.actor}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      {notification.type === "completed" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white ring-2 ring-white">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                      {notification.type === "assigned" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white ring-2 ring-white">
                          <UserPlus className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    {/* Notification Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-xs text-slate-800 leading-snug">
                        <strong className="font-semibold text-slate-900">
                          {notification.actor}{" "}
                        </strong>
                        {notification.title}{" "}
                        {notification.target && (
                          <span className="font-semibold text-slate-900">
                            {notification.target}
                          </span>
                        )}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400 mt-1 block">
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
              <div className="px-5 pt-3.5 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Earlier
              </div>
              <div className="divide-y divide-slate-100/60">
                {earlierNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Icon Category Badges */}
                    <div className="shrink-0">
                      {notification.type === "updated" && (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                          <History className="w-4 h-4" />
                        </div>
                      )}
                      {notification.type === "mentioned" && (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
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
                      <p className="text-xs text-slate-800 leading-snug">
                        {notification.type === "mentioned" ? (
                          <>
                            You were mentioned in{" "}
                            <strong className="font-semibold text-slate-900">
                              TASK-124
                            </strong>
                          </>
                        ) : notification.type === "updated" ? (
                          <>
                            <strong className="font-semibold text-slate-900">
                              &quot;Website Redesign&quot;
                            </strong>{" "}
                            was updated
                          </>
                        ) : (
                          <>
                            <strong className="font-semibold text-slate-900">
                              &quot;Mobile App&quot;
                            </strong>{" "}
                            deadline is approaching
                          </>
                        )}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400 mt-1 block">
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
        <div className="p-3 border-t border-slate-100 text-center bg-slate-50/30">
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors w-full py-1 rounded-md hover:bg-blue-50/50"
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
