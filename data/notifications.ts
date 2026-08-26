export type MailCategory = "primary" | "social" | "updates";

export interface MailNotification {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  category: MailCategory;
  isRead: boolean;
  isStarred: boolean;
}

export type DropdownNotificationType =
  | "completed"
  | "assigned"
  | "updated"
  | "mentioned"
  | "warning";

export interface DropdownNotification {
  id: string;
  type: DropdownNotificationType;
  actor?: string;
  avatar?: string;
  title: string;
  target?: string;
  time: string;
  unread: boolean;
  section: "TODAY" | "EARLIER";
}

export const mailNotifications: MailNotification[] = [
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

export const dropdownNotifications: DropdownNotification[] = [
  {
    id: "1",
    type: "completed",
    actor: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
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
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
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
];

export const workspaceInfo = {
  name: "Acme Development",
  plan: "Enterprise Plan",
  description:
    "Enterprise project management and collaborative development workspace.",
};

export const settingsTabs = [
  { id: "general", label: "General" },
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "preferences", label: "Preferences" },
];
