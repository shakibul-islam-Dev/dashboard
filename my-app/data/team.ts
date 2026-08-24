import {
  Users,
  UserCheck,
  ClipboardList,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export type TeamMemberStatus = "Online" | "Busy" | "Offline" | "Away";

export interface TeamMemberProject {
  id: string;
  label: string;
  bg: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  projects: TeamMemberProject[];
  extraProjects?: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionRate: number;
  status: TeamMemberStatus;
}

export interface TeamMetric {
  label: string;
  value: number;
  icon: LucideIcon;
  delta?: { text: string; positive: boolean } | null;
  note?: string | null;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex.m@acme.dev",
    initials: "AM",
    role: "Lead Developer",
    projects: [
      { id: "p1", label: "A", bg: "bg-blue-600" },
      { id: "p2", label: "B", bg: "bg-blue-500" },
    ],
    tasksCompleted: 42,
    tasksTotal: 50,
    completionRate: 84,
    status: "Online",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.c@acme.dev",
    initials: "SC",
    role: "Senior Designer",
    projects: [
      { id: "p3", label: "D", bg: "bg-amber-600" },
      { id: "p1", label: "A", bg: "bg-blue-600" },
    ],
    extraProjects: 1,
    tasksCompleted: 28,
    tasksTotal: 35,
    completionRate: 80,
    status: "Busy",
  },
  {
    id: "3",
    name: "John Carter",
    email: "john.c@acme.dev",
    initials: "JC",
    role: "Product Manager",
    projects: [
      { id: "p1", label: "A", bg: "bg-blue-600" },
      { id: "p2", label: "B", bg: "bg-blue-500" },
      { id: "p3", label: "D", bg: "bg-amber-600" },
    ],
    tasksCompleted: 15,
    tasksTotal: 18,
    completionRate: 83,
    status: "Online",
  },
  {
    id: "4",
    name: "Maya Patel",
    email: "maya.p@acme.dev",
    initials: "MP",
    role: "Backend Engineer",
    projects: [{ id: "p2", label: "B", bg: "bg-blue-500" }],
    tasksCompleted: 35,
    tasksTotal: 60,
    completionRate: 58,
    status: "Offline",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.k@acme.dev",
    initials: "DK",
    role: "Frontend Developer",
    projects: [
      { id: "p1", label: "A", bg: "bg-blue-600" },
      { id: "p3", label: "D", bg: "bg-amber-600" },
    ],
    tasksCompleted: 12,
    tasksTotal: 15,
    completionRate: 80,
    status: "Online",
  },
  {
    id: "6",
    name: "Emily Wilson",
    email: "emily.w@acme.dev",
    initials: "EW",
    role: "QA Engineer",
    projects: [
      { id: "p2", label: "B", bg: "bg-blue-500" },
      { id: "p3", label: "D", bg: "bg-amber-600" },
    ],
    tasksCompleted: 40,
    tasksTotal: 42,
    completionRate: 95,
    status: "Away",
  },
];

export const teamMetrics: TeamMetric[] = [
  {
    label: "Total Members",
    value: 24,
    icon: Users,
    delta: { text: "↑ 12%", positive: true },
  },
  {
    label: "Active Members",
    value: 18,
    icon: UserCheck,
    delta: null,
    note: "This week",
  },
  {
    label: "Tasks Assigned",
    value: 142,
    icon: ClipboardList,
    delta: { text: "↑ 5%", positive: true },
  },
  {
    label: "Completed Tasks",
    value: 89,
    icon: CheckCircle2,
    delta: { text: "↑ 18%", positive: true },
  },
];

export interface MemberAvatar {
  initials: string;
  bg: string;
}

export const defaultProjectMembers: MemberAvatar[] = [
  { initials: "AM", bg: "bg-slate-200 text-slate-700" },
  { initials: "JC", bg: "bg-slate-300 text-slate-700" },
  { initials: "SC", bg: "bg-slate-400 text-white" },
];
