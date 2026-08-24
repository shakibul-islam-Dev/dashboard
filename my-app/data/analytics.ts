import {
  CheckCircle,
  PlusSquare,
  Percent,
  AlertTriangle,
  Folder,
  ListTodo,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export interface AnalyticsMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  delta: string;
}

export const taskCompletionTrendData = [
  { name: "Week 1", value: 25 },
  { name: "Week 2", value: 38 },
  { name: "Week 3", value: 30 },
  { name: "Week 4", value: 44 },
];

export const tasksByStatusData = [
  { name: "To Do", value: 10, color: "#E2E8F0" },
  { name: "In Progress", value: 15, color: "#3B82F6" },
  { name: "In Review", value: 10, color: "#F59E0B" },
  { name: "Done", value: 65, color: "#10B981" },
];

export const priorityDistributionData = [
  { name: "Low", value: 45, fill: "#E2E8F0" },
  { name: "Medium", value: 80, fill: "#3B82F6" },
  { name: "High", value: 25, fill: "#F59E0B" },
  { name: "Critical", value: 12, fill: "#EF4444" },
];

export interface ProjectProgress {
  name: string;
  progress: number;
  color: string;
}

export const projectProgressData: ProjectProgress[] = [
  { name: "Frontend Redesign", progress: 75, color: "bg-blue-600" },
  { name: "API v2 Migration", progress: 40, color: "bg-blue-500" },
  { name: "Security Audit fixes", progress: 90, color: "bg-emerald-500" },
  { name: "Mobile App Beta", progress: 15, color: "bg-amber-500" },
];

export const analyticsMetrics: AnalyticsMetric[] = [
  {
    label: "Tasks Completed",
    value: "124",
    icon: CheckCircle,
    delta: "↑ 12% vs last month",
  },
  {
    label: "Tasks Created",
    value: "142",
    icon: PlusSquare,
    delta: "↑ 5% vs last month",
  },
  {
    label: "Completion Rate",
    value: "87%",
    icon: Percent,
    delta: "↑ 2% vs last month",
  },
  {
    label: "Overdue Rate",
    value: "4.2%",
    icon: AlertTriangle,
    delta: "↓ 1% vs last month",
  },
];

export interface DashboardStat {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  badge?: string;
  note?: string;
  isNegative?: boolean;
}

export const dashboardStats: DashboardStat[] = [
  {
    label: "Active Projects",
    value: 12,
    icon: Folder,
    iconBg: "bg-blue-50 text-blue-600",
    badge: "↑2",
  },
  {
    label: "Total Tasks",
    value: 128,
    icon: ListTodo,
    iconBg: "bg-gray-50 text-gray-600",
  },
  {
    label: "Completed Tasks",
    value: 84,
    icon: CheckCircle2,
    iconBg: "bg-emerald-50 text-emerald-600",
    note: "This week",
  },
  {
    label: "Overdue Tasks",
    value: 7,
    icon: AlertTriangle,
    iconBg: "bg-rose-50 text-rose-600",
    badge: "↑3",
    isNegative: true,
  },
];
