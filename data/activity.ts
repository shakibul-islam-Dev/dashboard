import {
  Check,
  ArrowRight,
  Plus,
  UserPlus,
  Pencil,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export type ActivityItemType = "task" | "project" | "team" | "comment";

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
  type: ActivityItemType;
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
        type: "task",
      },
      {
        id: "2",
        user: { name: "John Carter", initials: "JC" },
        action: 'moved "Authentication UI" to Review',
        time: "4 hours ago",
        project: "Authentication System",
        icon: ArrowRight,
        iconBg: "bg-amber-500",
        type: "task",
      },
      {
        id: "7",
        user: { name: "Shakibul Islam", initials: "SI" },
        action: "created project",
        target: '"OAuth2 Provider Setup"',
        time: "5 hours ago",
        project: "OAuth2 Provider Setup",
        icon: Plus,
        iconBg: "bg-indigo-500",
        type: "project",
      },
      {
        id: "8",
        user: { name: "Elena Rostova", initials: "ER" },
        action: 'commented on "Trending Score Model"',
        time: "6 hours ago",
        project: "Idea Vault Analytics Engine",
        comment:
          '"The decay factor looks good at 0.96 — can we backfill the last 30 days before we ship digests?"',
        icon: MessageSquare,
        iconBg: "bg-emerald-600",
        type: "comment",
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
        type: "task",
      },
      {
        id: "4",
        user: { name: "Maya Patel", initials: "MP" },
        action: 'assigned "Mobile Navigation" to Alex Morgan',
        time: "Yesterday",
        project: "Mobile App",
        icon: UserPlus,
        iconBg: "bg-slate-700",
        type: "team",
      },
      {
        id: "9",
        user: { name: "Michael Chen", initials: "MC" },
        action: "pushed 4 commits to",
        target: "feature/stripe-reconciliation",
        time: "Yesterday",
        project: "Payment Integration",
        icon: ArrowRight,
        iconBg: "bg-rose-500",
        type: "task",
      },
      {
        id: "10",
        user: { name: "Jessica T.", initials: "JT" },
        action: 'updated description for "Dashboard Redesign"',
        time: "Yesterday",
        project: "Dashboard Redesign",
        icon: Pencil,
        iconBg: "bg-emerald-500",
        type: "project",
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
        type: "project",
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
        type: "comment",
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
