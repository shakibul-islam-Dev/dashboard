import {
  Check,
  ArrowRight,
  Plus,
  UserPlus,
  Pencil,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export interface ActivityItem {
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

export interface ActivityGroup {
  section: string;
  items: ActivityItem[];
}

export const activityTabs = [
  "All Activity",
  "Tasks",
  "Projects",
  "Team",
  "Comments",
];

export const activityData: ActivityGroup[] = [
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

export interface RecentActivityItem {
  id: string;
  dotColor: string;
  actor: string;
  action: string;
  target?: string;
  targetIsCode?: boolean;
  comment?: string;
  time: string;
}

export const recentActivityData: RecentActivityItem[] = [
  {
    id: "1",
    dotColor: "bg-blue-500",
    actor: "Sarah Jenkins",
    action: "pushed 3 commits to",
    target: "feature/auth",
    targetIsCode: true,
    time: "10 minutes ago",
  },
  {
    id: "2",
    dotColor: "bg-emerald-500",
    actor: "Mike Chen",
    action: "completed task",
    target: "Update API Docs",
    time: "1 hour ago",
  },
  {
    id: "3",
    dotColor: "bg-amber-500",
    actor: "Elena Rostova",
    action: "created a new pull request",
    target: "#442 Navigation Fixes",
    time: "3 hours ago",
  },
  {
    id: "4",
    dotColor: "bg-indigo-300",
    actor: "David Kim",
    action: "commented on",
    target: "Mobile App Design Specs",
    comment:
      "Let us make sure the contrast on the secondary buttons passes WCAG guidelines...",
    time: "Yesterday",
  },
];
