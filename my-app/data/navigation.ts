import {
  LayoutDashboard,
  FolderOpenDot,
  FolderRoot,
  ClipboardCheck,
  ClockFading,
  UserRound,
  ChartColumnBig,
  type LucideIcon,
} from "lucide-react";

export interface SidebarLink {
  id: number;
  icon: LucideIcon;
  name: string;
  link: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

export const dashboardSidebarLinks: SidebarLink[] = [
  {
    id: 1,
    icon: LayoutDashboard,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    id: 2,
    icon: FolderOpenDot,
    name: "Projects",
    link: "/dashboard/projects",
  },
  {
    id: 3,
    icon: FolderRoot,
    name: "Projects Board",
    link: "/dashboard/project-board",
  },
  {
    id: 4,
    icon: ClipboardCheck,
    name: "My Tasks",
    link: "/dashboard/my-task",
  },
  {
    id: 5,
    icon: ClockFading,
    name: "Activity",
    link: "/dashboard/activity",
  },
  {
    id: 6,
    icon: UserRound,
    name: "Team",
    link: "/dashboard/team",
  },
  {
    id: 7,
    icon: ChartColumnBig,
    name: "Analytics",
    link: "/dashboard/analytics",
  },
];

export const currentUser: UserProfile = {
  name: "Alex Morgan",
  role: "Product Manager",
  avatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
};
