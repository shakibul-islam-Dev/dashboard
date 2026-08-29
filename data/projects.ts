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
    description:
      "Marketing site rebuild on the new design system — SSG pages, CMS-driven hero variants, and a 90+ Lighthouse target.",
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
    description:
      "First public mobile release: streamlined onboarding, interactive dashboard cards, push notifications, and offline-first caching.",
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
    description:
      "Unified identity service with SSO (OAuth2/OIDC), role-based access control, MFA rollout, and full audit logging.",
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
    description:
      "GraphQL gateway for internal services with rate limiting, schema stitching, request tracing, and a public playground.",
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
    description:
      "New analytics & reporting interface with embeddable chart components, advanced filters, and scheduled exports.",
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
    description:
      "Stripe Connect payout flows with a multi-currency ledger, webhook reconciliation, and automated refund handling.",
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

type ProjectDetail = {
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
};

/* Unique details per project so every detail page feels real.
   Keys cover the static projects (projectsPageData) and the board projects (p1-p5). */
const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "website-redesign": {
    title: "Website Redesign",
    description:
      "Prime brand faces: rebuilt marketing site with a motion-first hero, CMS-managed case studies, and a strict 90+ Lighthouse target.",
    status: "In Progress",
    dueDate: "Oct 28, 2026",
    progress: 72,
    members: [
      { name: "Sarah Jenkins", role: "Lead Designer", avatar: "/avatars/01.png", fallback: "SJ" },
      { name: "Alex Rivera", role: "Frontend Engineer", avatar: "/avatars/04.png", fallback: "AR" },
      { name: "Jessica T.", role: "Content Strategist", avatar: "/avatars/05.png", fallback: "JT" },
      { name: "David K.", role: "QA Engineer", avatar: "/avatars/06.png", fallback: "DK" },
    ],
    stats: { totalTasks: 25, completedTasks: 18, pendingTasks: 7, hoursLogged: 212 },
    tasks: [
      { id: 1, title: "Ship motion-first hero with reduced-motion fallback", status: "Completed", assignee: "Alex Rivera" },
      { id: 2, title: "Stand up CMS-driven case study templates", status: "Completed", assignee: "Jessica T." },
      { id: 3, title: "Audit all pages against WCAG AA contrast", status: "In Progress", assignee: "Sarah Jenkins" },
      { id: 4, title: "Migrate blog to SSG with incremental rebuilds", status: "In Progress", assignee: "Alex Rivera" },
      { id: 5, title: "Set up A/B variants for the pricing hero", status: "Pending", assignee: "Jessica T." },
    ],
  },
  "mobile-app-mvp": {
    title: "Mobile App MVP",
    description:
      "React Native client for the core dashboard: guided onboarding, interactive widgets, push delivery, and offline cache-first reads.",
    status: "In Progress",
    dueDate: "Nov 30, 2026",
    progress: 58,
    members: [
      { name: "Michael Chen", role: "Mobile Lead", avatar: "/avatars/02.png", fallback: "MC" },
      { name: "Sarah Jenkins", role: "Product Designer", avatar: "/avatars/01.png", fallback: "SJ" },
      { name: "Shakibul Islam", role: "React Native Developer", avatar: "/avatars/07.png", fallback: "SI" },
    ],
    stats: { totalTasks: 21, completedTasks: 12, pendingTasks: 9, hoursLogged: 186 },
    tasks: [
      { id: 1, title: "Implement 3-step onboarding with deep links", status: "Completed", assignee: "Sarah Jenkins" },
      { id: 2, title: "Cache dashboard summary offline (SQLite)", status: "Completed", assignee: "Shakibul Islam" },
      { id: 3, title: "Wire push notification preferences screen", status: "In Progress", assignee: "Michael Chen" },
      { id: 4, title: "Profile crash traces in release candidate", status: "In Progress", assignee: "Shakibul Islam" },
      { id: 5, title: "Polish empty states and skeleton loaders", status: "Pending", assignee: "Sarah Jenkins" },
    ],
  },
  "auth-system": {
    title: "Authentication System",
    description:
      "Unified identity service: OAuth2/OIDC single sign-on, role-based access control, MFA, and tamper-proof audit log exports.",
    status: "Review",
    dueDate: "Sep 15, 2026",
    progress: 84,
    members: [
      { name: "Elena Rostova", role: "Backend Lead", avatar: "/avatars/03.png", fallback: "ER" },
      { name: "Alex Rivera", role: "Security Engineer", avatar: "/avatars/04.png", fallback: "AR" },
      { name: "Shakibul Islam", role: "Backend Developer", avatar: "/avatars/07.png", fallback: "SI" },
    ],
    stats: { totalTasks: 25, completedTasks: 21, pendingTasks: 4, hoursLogged: 158 },
    tasks: [
      { id: 1, title: "Ship OAuth2 authorization-code flow", status: "Completed", assignee: "Elena Rostova" },
      { id: 2, title: "Add RBAC permission matrix to the admin panel", status: "Completed", assignee: "Shakibul Islam" },
      { id: 3, title: "Roll out TOTP MFA enrollment", status: "Completed", assignee: "Alex Rivera" },
      { id: 4, title: "Run session revocation + brute-force tests", status: "In Progress", assignee: "Alex Rivera" },
      { id: 5, title: "Finalize compliance audit log export", status: "Pending", assignee: "Elena Rostova" },
    ],
  },
  "api-platform": {
    title: "API Platform",
    description:
      "GraphQL gateway for internal services with sliding-window rate limiting, schema stitching, traces, and a public API playground.",
    status: "Planning",
    dueDate: "Dec 01, 2026",
    progress: 41,
    members: [
      { name: "Michael Chen", role: "Platform Lead", avatar: "/avatars/02.png", fallback: "MC" },
      { name: "Elena Rostova", role: "GraphQL Engineer", avatar: "/avatars/03.png", fallback: "ER" },
      { name: "David K.", role: "QA Engineer", avatar: "/avatars/06.png", fallback: "DK" },
    ],
    stats: { totalTasks: 22, completedTasks: 9, pendingTasks: 13, hoursLogged: 96 },
    tasks: [
      { id: 1, title: "Define schema-first contract with shared fragments", status: "Completed", assignee: "Elena Rostova" },
      { id: 2, title: "Instrument gateway with OpenTelemetry traces", status: "Completed", assignee: "Michael Chen" },
      { id: 3, title: "Stitch billing service into the unified schema", status: "In Progress", assignee: "Elena Rostova" },
      { id: 4, title: "Implement per-client rate limit buckets", status: "In Progress", assignee: "Michael Chen" },
      { id: 5, title: "Build interactive playground with auth presets", status: "Pending", assignee: "David K." },
    ],
  },
  "dashboard-redesign": {
    title: "Dashboard Redesign",
    description:
      "Data studio revamp: embeddable chart components, saved filter presets, scheduled PDF exports, and theme-aware palettes.",
    status: "In Progress",
    dueDate: "Jan 15, 2027",
    progress: 15,
    members: [
      { name: "Liam Vance", role: "Frontend Developer", avatar: "/avatars/08.png", fallback: "LV" },
      { name: "Jessica T.", role: "Product Designer", avatar: "/avatars/05.png", fallback: "JT" },
      { name: "David K.", role: "QA Engineer", avatar: "/avatars/06.png", fallback: "DK" },
    ],
    stats: { totalTasks: 20, completedTasks: 3, pendingTasks: 17, hoursLogged: 64 },
    tasks: [
      { id: 1, title: "Prototype embeddable chart component API", status: "Completed", assignee: "Liam Vance" },
      { id: 2, title: "Define theme-aware color ramp tokens", status: "Completed", assignee: "Jessica T." },
      { id: 3, title: "Implement saved filter presets store", status: "In Progress", assignee: "Liam Vance" },
      { id: 4, title: "Design export PDF layout for reports", status: "Pending", assignee: "Jessica T." },
      { id: 5, title: "Regression-test with 10k-row datasets", status: "Pending", assignee: "David K." },
    ],
  },
  "payment-integration": {
    title: "Payment Integration",
    description:
      "Stripe Connect onboarding and payouts, a multi-currency ledger with reconciliation, and automated refund flows.",
    status: "Blocked",
    dueDate: "Oct 25, 2026",
    progress: 30,
    members: [
      { name: "Elena Rostova", role: "Payments Lead", avatar: "/avatars/03.png", fallback: "ER" },
      { name: "Michael Chen", role: "Backend Engineer", avatar: "/avatars/02.png", fallback: "MC" },
      { name: "Shakibul Islam", role: "Backend Developer", avatar: "/avatars/07.png", fallback: "SI" },
    ],
    stats: { totalTasks: 20, completedTasks: 6, pendingTasks: 14, hoursLogged: 78 },
    tasks: [
      { id: 1, title: "Model multi-currency ledger with FX rates", status: "Completed", assignee: "Elena Rostova" },
      { id: 2, title: "Wire Stripe Connect account onboarding", status: "Completed", assignee: "Michael Chen" },
      { id: 3, title: "Build webhook event reconciliation job", status: "In Progress", assignee: "Shakibul Islam" },
      { id: 4, title: "Add refund window + reason tracking", status: "Pending", assignee: "Elena Rostova" },
      { id: 5, title: "Vendor approval review (blocking external)", status: "Pending", assignee: "Michael Chen" },
    ],
  },
  p1: {
    title: "SunCart Payment Gateway",
    description:
      "Multi-currency checkout with instant Stripe webhook reconciliation and regional processor fallbacks.",
    status: "In Progress",
    dueDate: "Aug 15, 2026",
    progress: 85,
    members: [
      { name: "Sarah Jenkins", role: "Product Manager", avatar: "/avatars/01.png", fallback: "SJ" },
      { name: "Alex Rivera", role: "Engineering Lead", avatar: "/avatars/04.png", fallback: "AR" },
      { name: "Shakibul Islam", role: "Fullstack Developer", avatar: "/avatars/07.png", fallback: "SI" },
      { name: "David K.", role: "Backend Developer", avatar: "/avatars/06.png", fallback: "DK" },
    ],
    stats: { totalTasks: 20, completedTasks: 17, pendingTasks: 3, hoursLogged: 134 },
    tasks: [
      { id: 1, title: "Land 18-currency pricing matrix", status: "Completed", assignee: "Sarah Jenkins" },
      { id: 2, title: "Idempotent Stripe webhook consumer", status: "Completed", assignee: "Shakibul Islam" },
      { id: 3, title: "Regional processor failover queue", status: "Completed", assignee: "David K." },
      { id: 4, title: "Chargeback dispute case dashboard", status: "In Progress", assignee: "Alex Rivera" },
      { id: 5, title: "Penny-test settlement reconciliation", status: "Pending", assignee: "David K." },
    ],
  },
  p2: {
    title: "Idea Vault Analytics Engine",
    description:
      "Real-time trending algorithm and interaction metrics for the Idea Vault feed and its weekly digests.",
    status: "In Progress",
    dueDate: "Sep 10, 2026",
    progress: 60,
    members: [
      { name: "Sarah Jenkins", role: "Product Manager", avatar: "/avatars/01.png", fallback: "SJ" },
      { name: "Michael Chen", role: "Engineering Lead", avatar: "/avatars/02.png", fallback: "MC" },
      { name: "Shakibul Islam", role: "Backend Developer", avatar: "/avatars/07.png", fallback: "SI" },
    ],
    stats: { totalTasks: 15, completedTasks: 9, pendingTasks: 6, hoursLogged: 88 },
    tasks: [
      { id: 1, title: "Define trending score decay model", status: "Completed", assignee: "Sarah Jenkins" },
      { id: 2, title: "Stream interactions into the metric pipeline", status: "Completed", assignee: "Shakibul Islam" },
      { id: 3, title: "Backfill 90 days of engagement history", status: "In Progress", assignee: "Michael Chen" },
      { id: 4, title: "Weekly digest generation job", status: "Pending", assignee: "Shakibul Islam" },
      { id: 5, title: "Trend spikes alert thresholds", status: "Pending", assignee: "Michael Chen" },
    ],
  },
  p3: {
    title: "Tobarok Points System",
    description:
      "Ad-to-Earn reward service: point accrual per view, fraud heuristics, and a redeem + ledger API.",
    status: "In Progress",
    dueDate: "Sep 28, 2026",
    progress: 40,
    members: [
      { name: "Elena Rostova", role: "Product Manager", avatar: "/avatars/03.png", fallback: "ER" },
      { name: "Alex Rivera", role: "Engineering Lead", avatar: "/avatars/04.png", fallback: "AR" },
      { name: "Shakibul Islam", role: "Backend Developer", avatar: "/avatars/07.png", fallback: "SI" },
      { name: "Liam Vance", role: "Frontend Developer", avatar: "/avatars/08.png", fallback: "LV" },
    ],
    stats: { totalTasks: 18, completedTasks: 7, pendingTasks: 11, hoursLogged: 74 },
    tasks: [
      { id: 1, title: "Point accrual rules engine", status: "Completed", assignee: "Alex Rivera" },
      { id: 2, title: "Ledger API with idempotent credits", status: "Completed", assignee: "Shakibul Islam" },
      { id: 3, title: "View-fraud heuristic scoring", status: "In Progress", assignee: "Elena Rostova" },
      { id: 4, title: "Redeem flow + balance banner UI", status: "In Progress", assignee: "Liam Vance" },
      { id: 5, title: "Points expiry sweep job", status: "Pending", assignee: "Shakibul Islam" },
    ],
  },
  p4: {
    title: "Socket.io Chat Admin Ban",
    description:
      "Real-time moderation panel: ban/unban, message recall, and room lockdown from the Socket.io admin console.",
    status: "Planning",
    dueDate: "Oct 15, 2026",
    progress: 0,
    members: [
      { name: "Elena Rostova", role: "Product Manager", avatar: "/avatars/03.png", fallback: "ER" },
      { name: "Michael Chen", role: "Engineering Lead", avatar: "/avatars/02.png", fallback: "MC" },
      { name: "Shakibul Islam", role: "Realtime Developer", avatar: "/avatars/07.png", fallback: "SI" },
    ],
    stats: { totalTasks: 10, completedTasks: 0, pendingTasks: 10, hoursLogged: 12 },
    tasks: [
      { id: 1, title: "Event-driven ban propagation to clients", status: "Pending", assignee: "Shakibul Islam" },
      { id: 2, title: "Room lockdown emergency switch", status: "Pending", assignee: "Michael Chen" },
      { id: 3, title: "Moderation audit trail", status: "Pending", assignee: "Elena Rostova" },
      { id: 4, title: "Moderator action approval flow", status: "Pending", assignee: "Michael Chen" },
      { id: 5, title: "Stealth mode for banned users", status: "Pending", assignee: "Shakibul Islam" },
    ],
  },
  p5: {
    title: "OAuth2 Provider Setup",
    description:
      "Centralized authorization server with RBAC scopes, JWT rotation, and a developer app dashboard.",
    status: "Planning",
    dueDate: "Nov 01, 2026",
    progress: 0,
    members: [
      { name: "Sarah Jenkins", role: "Product Manager", avatar: "/avatars/01.png", fallback: "SJ" },
      { name: "Alex Rivera", role: "Engineering Lead", avatar: "/avatars/04.png", fallback: "AR" },
      { name: "Shakibul Islam", role: "Backend Developer", avatar: "/avatars/07.png", fallback: "SI" },
      { name: "Jessica T.", role: "Frontend Developer", avatar: "/avatars/05.png", fallback: "JT" },
    ],
    stats: { totalTasks: 12, completedTasks: 0, pendingTasks: 12, hoursLogged: 8 },
    tasks: [
      { id: 1, title: "Authorization server skeleton + scopes", status: "Pending", assignee: "Alex Rivera" },
      { id: 2, title: "Client registration console", status: "Pending", assignee: "Jessica T." },
      { id: 3, title: "PKCE + refresh-token rotation", status: "Pending", assignee: "Shakibul Islam" },
      { id: 4, title: "Consent screen with granular scopes", status: "Pending", assignee: "Sarah Jenkins" },
      { id: 5, title: "Token introspection endpoint", status: "Pending", assignee: "Shakibul Islam" },
    ],
  },
};

const FALLBACK_DETAIL: ProjectDetail = {
  title: "Project Details",
  description:
    "Comprehensive platform initiative covering discovery, implementation, and rollout. Team roadmaps are tracked per sprint with clear owners.",
  status: "In Progress",
  dueDate: "Oct 28, 2026",
  progress: 68,
  members: [
    { name: "Sarah Jenkins", role: "Lead Designer", avatar: "/avatars/01.png", fallback: "SJ" },
    { name: "Mike Chen", role: "Frontend Dev", avatar: "/avatars/02.png", fallback: "MC" },
    { name: "Elena Rostova", role: "Backend Dev", avatar: "/avatars/03.png", fallback: "ER" },
  ],
  stats: { totalTasks: 34, completedTasks: 23, pendingTasks: 11, hoursLogged: 142 },
  tasks: [
    { id: 1, title: "Finalize high-fidelity wireframes", status: "Completed", assignee: "Sarah Jenkins" },
    { id: 2, title: "Setup authentication API routes & RBAC", status: "In Progress", assignee: "Elena Rostova" },
    { id: 3, title: "Optimize bundle size & Next.js page load times", status: "Pending", assignee: "Mike Chen" },
  ],
};

export const getProjectDetails = (id: string) => {
  const title =
    id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Project Details";
  const detail = PROJECT_DETAILS[id] ?? { ...FALLBACK_DETAIL, title };
  return { id, ...detail };
};

/* ── Mock files & documents per project ── */
export type ProjectFileType = "PDF" | "DOCX" | "FIG" | "XLSX" | "SLIDE" | "TXT";

export type ProjectFile = {
  id: string;
  name: string;
  type: ProjectFileType;
  size: string;
  author: string;
  updatedAt: string;
};

const PROJECT_FILES: Record<string, ProjectFile[]> = {
  "website-redesign": [
    { id: "f1", name: "design-tokens-v2.fig", type: "FIG", size: "8.2 MB", author: "Sarah Jenkins", updatedAt: "Aug 28" },
    { id: "f2", name: "pricing-hero-ab-specs.pdf", type: "PDF", size: "1.4 MB", author: "Jessica T.", updatedAt: "Aug 26" },
    { id: "f3", name: "homepage-wireframes.docx", type: "DOCX", size: "640 KB", author: "Sarah Jenkins", updatedAt: "Aug 22" },
    { id: "f4", name: "brand-guidelines-v3.pdf", type: "PDF", size: "12.1 MB", author: "Jessica T.", updatedAt: "Aug 18" },
  ],
  "mobile-app-mvp": [
    { id: "f1", name: "app-onboarding-flows.fig", type: "FIG", size: "6.4 MB", author: "Sarah Jenkins", updatedAt: "Aug 27" },
    { id: "f2", name: "push-notification-architecture.pdf", type: "PDF", size: "980 KB", author: "Michael Chen", updatedAt: "Aug 25" },
    { id: "f3", name: "offline-cache-poc-results.xlsx", type: "XLSX", size: "240 KB", author: "Shakibul Islam", updatedAt: "Aug 21" },
    { id: "f4", name: "mvp-release-checklist.docx", type: "DOCX", size: "118 KB", author: "Michael Chen", updatedAt: "Aug 19" },
  ],
  "auth-system": [
    { id: "f1", name: "oauth2-oidc-spec-mapping.pdf", type: "PDF", size: "3.6 MB", author: "Elena Rostova", updatedAt: "Aug 26" },
    { id: "f2", name: "rbac-permission-matrix.xlsx", type: "XLSX", size: "412 KB", author: "Shakibul Islam", updatedAt: "Aug 23" },
    { id: "f3", name: "sprint-12-security-notes.docx", type: "DOCX", size: "190 KB", author: "Alex Rivera", updatedAt: "Aug 20" },
    { id: "f4", name: "mfa-enrollment-flow.fig", type: "FIG", size: "2.1 MB", author: "Sarah Jenkins", updatedAt: "Aug 17" },
  ],
  "api-platform": [
    { id: "f1", name: "graphql-schema-contract.txt", type: "TXT", size: "88 KB", author: "Elena Rostova", updatedAt: "Aug 27" },
    { id: "f2", name: "rate-limit-bucketing-design.pdf", type: "PDF", size: "1.1 MB", author: "Michael Chen", updatedAt: "Aug 24" },
    { id: "f3", name: "gateway-tracing-setup.docx", type: "DOCX", size: "260 KB", author: "Michael Chen", updatedAt: "Aug 21" },
    { id: "f4", name: "api-playground-requirements.fig", type: "FIG", size: "3.4 MB", author: "David K.", updatedAt: "Aug 18" },
  ],
  "dashboard-redesign": [
    { id: "f1", name: "embeddable-charts-api.fig", type: "FIG", size: "9.7 MB", author: "Jessica T.", updatedAt: "Aug 26" },
    { id: "f2", name: "report-export-layouts.pdf", type: "PDF", size: "2.3 MB", author: "Jessica T.", updatedAt: "Aug 22" },
    { id: "f3", name: "saved-filters-data-model.docx", type: "DOCX", size: "150 KB", author: "Liam Vance", updatedAt: "Aug 19" },
    { id: "f4", name: "perf-baseline-10k-rows.xlsx", type: "XLSX", size: "1.9 MB", author: "David K.", updatedAt: "Aug 15" },
  ],
  "payment-integration": [
    { id: "f1", name: "stripe-connect-flow-diagram.pdf", type: "PDF", size: "1.8 MB", author: "Elena Rostova", updatedAt: "Aug 27" },
    { id: "f2", name: "multi-currency-ledger-schema.docx", type: "DOCX", size: "320 KB", author: "Shakibul Islam", updatedAt: "Aug 24" },
    { id: "f3", name: "webhook-reconciliation-adr.docx", type: "DOCX", size: "95 KB", author: "Michael Chen", updatedAt: "Aug 20" },
    { id: "f4", name: "vendor-terms-redlined.pdf", type: "PDF", size: "4.5 MB", author: "Michael Chen", updatedAt: "Aug 16" },
  ],
  p1: [
    { id: "f1", name: "checkout-ux-audit.pdf", type: "PDF", size: "2.7 MB", author: "Sarah Jenkins", updatedAt: "Aug 27" },
    { id: "f2", name: "stripe-webhook-consumer-notes.docx", type: "DOCX", size: "210 KB", author: "Shakibul Islam", updatedAt: "Aug 25" },
    { id: "f3", name: "fx-pricing-matrix.xlsx", type: "XLSX", size: "380 KB", author: "Sarah Jenkins", updatedAt: "Aug 23" },
    { id: "f4", name: "failover-region-map.fig", type: "FIG", size: "5.2 MB", author: "Alex Rivera", updatedAt: "Aug 21" },
  ],
  p2: [
    { id: "f1", name: "trending-score-walkthrough.pdf", type: "PDF", size: "1.3 MB", author: "Sarah Jenkins", updatedAt: "Aug 26" },
    { id: "f2", name: "interaction-events-schema.docx", type: "DOCX", size: "175 KB", author: "Shakibul Islam", updatedAt: "Aug 24" },
    { id: "f3", name: "digest-design-mockups.fig", type: "FIG", size: "6.8 MB", author: "Sarah Jenkins", updatedAt: "Aug 22" },
  ],
  p3: [
    { id: "f1", name: "point-accrual-rules.pdf", type: "PDF", size: "1.0 MB", author: "Elena Rostova", updatedAt: "Aug 26" },
    { id: "f2", name: "ledger-api-spec.docx", type: "DOCX", size: "245 KB", author: "Shakibul Islam", updatedAt: "Aug 23" },
    { id: "f3", name: "fraud-heuristics-notes.xlsx", type: "XLSX", size: "130 KB", author: "Alex Rivera", updatedAt: "Aug 20" },
    { id: "f4", name: "rewards-banner-ui.fig", type: "FIG", size: "3.9 MB", author: "Liam Vance", updatedAt: "Aug 18" },
  ],
  p4: [
    { id: "f1", name: "moderation-event-flow.pdf", type: "PDF", size: "800 KB", author: "Michael Chen", updatedAt: "Aug 25" },
    { id: "f2", name: "room-lockdown-runbook.docx", type: "DOCX", size: "95 KB", author: "Michael Chen", updatedAt: "Aug 22" },
    { id: "f3", name: "audit-trail-requirements.xlsx", type: "XLSX", size: "110 KB", author: "Elena Rostova", updatedAt: "Aug 19" },
  ],
  p5: [
    { id: "f1", name: "auth-server-architecture.pdf", type: "PDF", size: "2.9 MB", author: "Alex Rivera", updatedAt: "Aug 26" },
    { id: "f2", name: "client-console-mockups.fig", type: "FIG", size: "4.6 MB", author: "Jessica T.", updatedAt: "Aug 24" },
    { id: "f3", name: "pkce-implementation-check.docx", type: "DOCX", size: "140 KB", author: "Shakibul Islam", updatedAt: "Aug 21" },
  ],
};

const FALLBACK_FILES: ProjectFile[] = [
  { id: "f1", name: "project-plan.docx", type: "DOCX", size: "320 KB", author: "Sarah Jenkins", updatedAt: "Aug 25" },
  { id: "f2", name: "requirements-overview.pdf", type: "PDF", size: "1.2 MB", author: "Alex Rivera", updatedAt: "Aug 20" },
  { id: "f3", name: "architecture-sketch.fig", type: "FIG", size: "5.5 MB", author: "Mike Chen", updatedAt: "Aug 15" },
];

export const getProjectFiles = (id: string): ProjectFile[] =>
  PROJECT_FILES[id] ?? FALLBACK_FILES;

/* ── Mock milestones / roadmap per project ── */
export type ProjectMilestoneStatus = "Completed" | "In Progress" | "Upcoming";

export type ProjectMilestone = {
  id: string;
  title: string;
  date: string;
  status: ProjectMilestoneStatus;
};

const PROJECT_MILESTONES: Record<string, ProjectMilestone[]> = {
  "website-redesign": [
    { id: "m1", title: "Design tokens & brand kit", date: "Aug 10", status: "Completed" },
    { id: "m2", title: "Homepage + case studies build", date: "Sep 05", status: "In Progress" },
    { id: "m3", title: "Performance & accessibility pass", date: "Sep 24", status: "Upcoming" },
    { id: "m4", title: "Launch & stakeholder handoff", date: "Sep 30", status: "Upcoming" },
  ],
  "mobile-app-mvp": [
    { id: "m1", title: "Onboarding flow", date: "Aug 15", status: "Completed" },
    { id: "m2", title: "Offline caching", date: "Sep 08", status: "In Progress" },
    { id: "m3", title: "Push notifications", date: "Sep 18", status: "In Progress" },
    { id: "m4", title: "Beta release", date: "Oct 02", status: "Upcoming" },
    { id: "m5", title: "Production launch", date: "Oct 16", status: "Upcoming" },
  ],
  "auth-system": [
    { id: "m1", title: "OAuth2 / OIDC flows", date: "Aug 12", status: "Completed" },
    { id: "m2", title: "RBAC roles + admin console", date: "Aug 25", status: "Completed" },
    { id: "m3", title: "MFA rollout", date: "Aug 30", status: "Completed" },
    { id: "m4", title: "Compliance audit export", date: "Sep 08", status: "In Progress" },
  ],
  "api-platform": [
    { id: "m1", title: "Schema contract freeze", date: "Aug 20", status: "Completed" },
    { id: "m2", title: "Rate limiting", date: "Sep 12", status: "In Progress" },
    { id: "m3", title: "Schema stitching", date: "Sep 26", status: "Upcoming" },
    { id: "m4", title: "Playground public beta", date: "Oct 10", status: "Upcoming" },
  ],
  "dashboard-redesign": [
    { id: "m1", title: "Design tokens & color ramps", date: "Aug 24", status: "Completed" },
    { id: "m2", title: "Embeddable chart API", date: "Sep 28", status: "In Progress" },
    { id: "m3", title: "Saved filter presets", date: "Oct 20", status: "Upcoming" },
    { id: "m4", title: "Scheduled report exports", date: "Nov 12", status: "Upcoming" },
  ],
  "payment-integration": [
    { id: "m1", title: "Ledger + FX model", date: "Aug 18", status: "Completed" },
    { id: "m2", title: "Connect onboarding", date: "Aug 28", status: "Completed" },
    { id: "m3", title: "Webhook reconciliation", date: "Sep 14", status: "In Progress" },
    { id: "m4", title: "Refund flows", date: "Sep 30", status: "Upcoming" },
    { id: "m5", title: "Production rollout", date: "Oct 12", status: "Upcoming" },
  ],
  p1: [
    { id: "m1", title: "FX pricing matrix", date: "Aug 08", status: "Completed" },
    { id: "m2", title: "Webhook reconciliation", date: "Aug 30", status: "In Progress" },
    { id: "m3", title: "Regional failover", date: "Sep 15", status: "Upcoming" },
  ],
  p2: [
    { id: "m1", title: "Trending score model", date: "Aug 18", status: "Completed" },
    { id: "m2", title: "Metric pipeline", date: "Sep 05", status: "In Progress" },
    { id: "m3", title: "Weekly digests", date: "Sep 22", status: "Upcoming" },
  ],
  p3: [
    { id: "m1", title: "Point accrual rules", date: "Aug 20", status: "Completed" },
    { id: "m2", title: "Ledger API", date: "Aug 30", status: "Completed" },
    { id: "m3", title: "Fraud heuristics", date: "Sep 12", status: "In Progress" },
    { id: "m4", title: "Redeem UI", date: "Sep 25", status: "Upcoming" },
  ],
  p4: [
    { id: "m1", title: "Event model", date: "Sep 10", status: "In Progress" },
    { id: "m2", title: "Ban propagation", date: "Sep 26", status: "Upcoming" },
    { id: "m3", title: "Room lockdown", date: "Oct 08", status: "Upcoming" },
  ],
  p5: [
    { id: "m1", title: "Authorization server skeleton", date: "Sep 12", status: "In Progress" },
    { id: "m2", title: "Client console", date: "Sep 30", status: "Upcoming" },
    { id: "m3", title: "PKCE + token rotation", date: "Oct 16", status: "Upcoming" },
  ],
};

const FALLBACK_MILESTONES: ProjectMilestone[] = [
  { id: "m1", title: "Discovery & scoping", date: "Aug 10", status: "Completed" },
  { id: "m2", title: "Core implementation", date: "Sep 15", status: "In Progress" },
  { id: "m3", title: "QA & hardening", date: "Sep 30", status: "Upcoming" },
  { id: "m4", title: "Release", date: "Oct 10", status: "Upcoming" },
];

export const getProjectMilestones = (id: string): ProjectMilestone[] =>
  PROJECT_MILESTONES[id] ?? FALLBACK_MILESTONES;
