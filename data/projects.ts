import {
  Globe,
  Smartphone,
  ShieldCheck,
  Cpu,
  Layout,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  borderColor: string;
  progressColor: string;
  date: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  icon: LucideIcon;
  iconBg: string;
  avatars: string[];
}

export interface BoardMember {
  name: string;
  avatar: string;
}

export interface BoardProject {
  id: string;
  key: string;
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  projectManager: BoardMember;
  teamLead: BoardMember;
  developers: BoardMember[];
  priority: "High" | "Medium" | "Urgent" | "Normal";
}

export interface DashboardProject {
  id: string;
  title: string;
  description: string;
  tag: string;
  borderColor: string;
  progress: number;
  date: string;
  avatars: string[];
}

export interface ProjectDetailMember {
  name: string;
  role: string;
  avatar: string;
  fallback: string;
}

export interface ProjectDetailTask {
  id: number;
  title: string;
  status: string;
  assignee: string;
}

export const projectsPageData: Project[] = [
  {
    id: "website-redesign",
    title: "Website Redesign",
    description: "Marketing site overhaul with new brand guidelines.",
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    borderColor: "border-l-blue-500",
    progressColor: "bg-blue-600",
    date: "Oct 12",
    progress: 72,
    completedTasks: 18,
    totalTasks: 25,
    icon: Globe,
    iconBg: "bg-blue-50 text-blue-600",
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "mobile-app-mvp",
    title: "Mobile App MVP",
    description: "React Native application for core user flows.",
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    borderColor: "border-l-blue-500",
    progressColor: "bg-blue-600",
    date: "Nov 30",
    progress: 58,
    completedTasks: 12,
    totalTasks: 21,
    icon: Smartphone,
    iconBg: "bg-orange-50 text-orange-600",
    avatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "auth-system",
    title: "Authentication System",
    description: "SSO implementation and RBAC role definitions.",
    status: "Review",
    statusColor: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    borderColor: "border-l-amber-500",
    progressColor: "bg-amber-500",
    date: "Sep 15",
    progress: 84,
    completedTasks: 21,
    totalTasks: 25,
    icon: ShieldCheck,
    iconBg: "bg-amber-50 text-amber-600",
    avatars: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "api-platform",
    title: "API Platform",
    description: "GraphQL migration and rate limiting setup.",
    status: "Planning",
    statusColor: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    borderColor: "border-l-gray-500",
    progressColor: "bg-gray-600",
    date: "Dec 01",
    progress: 41,
    completedTasks: 9,
    totalTasks: 22,
    icon: Cpu,
    iconBg: "bg-purple-50 text-purple-600",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "dashboard-redesign",
    title: "Dashboard Redesign",
    description: "New analytics and reporting interface.",
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    borderColor: "border-l-blue-500",
    progressColor: "bg-blue-600",
    date: "Jan 15",
    progress: 15,
    completedTasks: 3,
    totalTasks: 20,
    icon: Layout,
    iconBg: "bg-emerald-50 text-emerald-600",
    avatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "payment-integration",
    title: "Payment Integration",
    description: "Stripe Connect implementation for marketplace.",
    status: "Blocked",
    statusColor: "bg-rose-50 text-rose-700 hover:bg-rose-100",
    borderColor: "border-l-rose-500",
    progressColor: "bg-rose-500",
    date: "Oct 25",
    progress: 30,
    completedTasks: 6,
    totalTasks: 20,
    icon: CreditCard,
    iconBg: "bg-rose-50 text-rose-600",
    avatars: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    ],
  },
];

export const projectBoardData: {
  overdue: BoardProject[];
  running: BoardProject[];
  upcoming: BoardProject[];
  newProjects: BoardProject[];
} = {
  overdue: [
    {
      id: "p1",
      key: "SUNC-201",
      title: "SunCart Payment Gateway",
      description: "Integrate multi-currency checkout & Stripe webhooks.",
      dueDate: "Aug 15, 2026",
      progress: 85,
      priority: "Urgent",
      projectManager: { name: "Sarah Jenkins", avatar: "SJ" },
      teamLead: { name: "Alex Rivera", avatar: "AR" },
      developers: [
        { name: "Shakibul Islam", avatar: "SI" },
        { name: "David K.", avatar: "DK font-sans" },
      ],
    },
  ],
  running: [
    {
      id: "p2",
      key: "IDEA-104",
      title: "Idea Vault Analytics Engine",
      description:
        "Build real-time trending algorithm & interaction metrics.",
      dueDate: "Sep 10, 2026",
      progress: 60,
      priority: "High",
      projectManager: { name: "Sarah Jenkins", avatar: "SJ" },
      teamLead: { name: "Michael Chen", avatar: "MC" },
      developers: [{ name: "Shakibul Islam", avatar: "SI" }],
    },
    {
      id: "p3",
      key: "TOB-302",
      title: "Tobarok Points System",
      description: "Implement Ad-to-Earn rewards calculation service.",
      dueDate: "Sep 28, 2026",
      progress: 40,
      priority: "Medium",
      projectManager: { name: "Elena Rostova", avatar: "ER" },
      teamLead: { name: "Alex Rivera", avatar: "AR" },
      developers: [
        { name: "Shakibul Islam", avatar: "SI" },
        { name: "Liam Vance", avatar: "LV" },
      ],
    },
  ],
  upcoming: [
    {
      id: "p4",
      key: "CHAT-401",
      title: "Socket.io Chat Admin Ban",
      description:
        "User account management panel & real-time moderation.",
      dueDate: "Oct 15, 2026",
      progress: 0,
      priority: "Normal",
      projectManager: { name: "Elena Rostova", avatar: "ER" },
      teamLead: { name: "Michael Chen", avatar: "MC" },
      developers: [{ name: "Shakibul Islam", avatar: "SI" }],
    },
  ],
  newProjects: [
    {
      id: "p5",
      key: "AUTH-502",
      title: "OAuth2 Provider Setup",
      description: "Centralized authentication client with RBAC scope.",
      dueDate: "Nov 01, 2026",
      progress: 0,
      priority: "High",
      projectManager: { name: "Sarah Jenkins", avatar: "SJ" },
      teamLead: { name: "Alex Rivera", avatar: "AR" },
      developers: [
        { name: "Shakibul Islam", avatar: "SI" },
        { name: "Jessica T.", avatar: "JT" },
      ],
    },
  ],
};

export const dashboardProjects: DashboardProject[] = [
  {
    id: "website-redesign",
    title: "Website Redesign",
    description: "Marketing site overhaul with new brand guidelines.",
    tag: "Design",
    borderColor: "border-l-blue-500",
    progress: 72,
    date: "Oct 12",
    avatars: ["AM", "SC", "JC"],
  },
  {
    id: "mobile-app-mvp",
    title: "Mobile App MVP",
    description: "React Native application for core user flows.",
    tag: "Mobile",
    borderColor: "border-l-emerald-500",
    progress: 58,
    date: "Nov 30",
    avatars: ["MP", "DK"],
  },
  {
    id: "auth-system",
    title: "Authentication System",
    description: "SSO implementation and RBAC role definitions.",
    tag: "Backend",
    borderColor: "border-l-amber-500",
    progress: 84,
    date: "Sep 15",
    avatars: ["EW", "SC"],
  },
  {
    id: "api-platform",
    title: "API Platform",
    description: "GraphQL migration and rate limiting setup.",
    tag: "API",
    borderColor: "border-l-purple-500",
    progress: 41,
    date: "Dec 01",
    avatars: ["JC", "MP", "DK"],
  },
];

export const getProjectDetails = (
  id: string,
): {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  progress: number;
  members: ProjectDetailMember[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    hoursLogged: number;
  };
  tasks: ProjectDetailTask[];
} => ({
  id,
  title:
    id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Project Details",
  description:
    "Comprehensive platform overhaul focusing on scalability, user performance, design systems, and security compliance.",
  status: "In Progress",
  dueDate: "Oct 28, 2026",
  progress: 68,
  members: [
    {
      name: "Sarah Jenkins",
      role: "Lead Designer",
      avatar: "/avatars/01.png",
      fallback: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Frontend Dev",
      avatar: "/avatars/02.png",
      fallback: "MC",
    },
    {
      name: "Elena Rostova",
      role: "Backend Dev",
      avatar: "/avatars/03.png",
      fallback: "ER",
    },
  ],
  stats: {
    totalTasks: 34,
    completedTasks: 23,
    pendingTasks: 11,
    hoursLogged: 142,
  },
  tasks: [
    {
      id: 1,
      title: "Finalize high-fidelity wireframes",
      status: "Completed",
      assignee: "Sarah Jenkins",
    },
    {
      id: 2,
      title: "Setup authentication API routes & RBAC",
      status: "In Progress",
      assignee: "Elena Rostova",
    },
    {
      id: 3,
      title: "Optimize bundle size & Next.js page load times",
      status: "Pending",
      assignee: "Mike Chen",
    },
  ],
});
