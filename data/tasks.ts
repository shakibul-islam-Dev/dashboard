export interface MyTask {
  id: string;
  title: string;
  project: string;
  status: string;
  priority: string;
  dueDate: string;
  tags: string[];
  section: "OVERDUE" | "TODAY";
}

export interface TaskActivityItem {
  id: string;
  actor: string;
  actorInitials: string;
  avatarBg: string;
  dotColor: string;
  action: string;
  highlight?: string;
  highlightBlue?: boolean;
  time: string;
}

export interface TaskDetailData {
  code: string;
  status: string;
  title: string;
  description: string;
  assignee: { name: string; initials: string };
  dueDate: string;
  priority: string;
  project: string;
  tags: string[];
  dependency: { code: string; title: string; status: string };
  activity: TaskActivityItem[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface EditTaskDefaults {
  code: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  blockedBy: { code: string; title: string };
}

export const myTasks: MyTask[] = [
  {
    id: "TASK-95",
    title: "Finalize homepage mockups",
    project: "Website Redesign",
    status: "In Progress",
    priority: "Critical",
    dueDate: "Oct 28",
    tags: ["Design"],
    section: "OVERDUE",
  },
  {
    id: "TASK-102",
    title: "Configure authentication",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    dueDate: "Today",
    tags: ["Backend", "Security"],
    section: "TODAY",
  },
  {
    id: "TASK-115",
    title: "Implement task filtering",
    project: "Dashboard Redesign",
    status: "Todo",
    priority: "Medium",
    dueDate: "Today",
    tags: ["Frontend"],
    section: "TODAY",
  },
  {
    id: "TASK-118",
    title: "Onboarding flow prototype",
    project: "Mobile App MVP",
    status: "Review",
    priority: "High",
    dueDate: "Today",
    tags: ["Design", "Mobile"],
    section: "TODAY",
  },
  {
    id: "TASK-121",
    title: "Refresh token rotation edge cases",
    project: "Authentication System",
    status: "In Progress",
    priority: "Critical",
    dueDate: "Today",
    tags: ["Backend", "Security"],
    section: "TODAY",
  },
  {
    id: "TASK-126",
    title: "Rate limit burst test on /graphql",
    project: "API Platform",
    status: "Todo",
    priority: "Medium",
    dueDate: "Today",
    tags: ["Backend", "Testing"],
    section: "TODAY",
  },
  {
    id: "TASK-98",
    title: "Hero section motion polish",
    project: "Website Redesign",
    status: "Done",
    priority: "Medium",
    dueDate: "Aug 12",
    tags: ["Frontend", "Motion"],
    section: "OVERDUE",
  },
  {
    id: "TASK-108",
    title: "Cache summary widgets offline",
    project: "Mobile App MVP",
    status: "Review",
    priority: "High",
    dueDate: "Aug 20",
    tags: ["Mobile", "Offline"],
    section: "OVERDUE",
  },
  {
    id: "TASK-110",
    title: "MFA enrollment screen",
    project: "Authentication System",
    status: "Done",
    priority: "Medium",
    dueDate: "Aug 21",
    tags: ["Frontend", "Security"],
    section: "OVERDUE",
  },
  {
    id: "TASK-130",
    title: "Scheduled report export",
    project: "Dashboard Redesign",
    status: "Todo",
    priority: "Low",
    dueDate: "Today",
    tags: ["Frontend", "Reports"],
    section: "TODAY",
  },
  {
    id: "TASK-133",
    title: "Refund reason tracking form",
    project: "Payment Integration",
    status: "In Progress",
    priority: "High",
    dueDate: "Today",
    tags: ["Backend", "Payments"],
    section: "TODAY",
  },
  {
    id: "TASK-136",
    title: "Weekly digest email template",
    project: "API Platform",
    status: "Todo",
    priority: "Low",
    dueDate: "Today",
    tags: ["Backend", "Email"],
    section: "TODAY",
  },
];

export const taskDetail: TaskDetailData = {
  code: "TASK-124",
  status: "In Progress",
  title: "Implement authentication flow",
  description:
    "Implement the complete authentication flow including login, registration and session handling.",
  assignee: { name: "Alex Morgan", initials: "AM" },
  dueDate: "Aug 28",
  priority: "High",
  project: "Website Redesign",
  tags: ["Frontend", "Authentication"],
  dependency: {
    code: "TASK-102",
    title: "Configure authentication",
    status: "In Progress",
  },
  activity: [
    {
      id: "1",
      actor: "Alex Morgan",
      actorInitials: "AM",
      avatarBg: "bg-slate-200 text-slate-700",
      dotColor: "bg-blue-500",
      action: "changed status to",
      highlight: "In Progress",
      highlightBlue: true,
      time: "2 hours ago",
    },
    {
      id: "2",
      actor: "John Carter",
      actorInitials: "JC",
      avatarBg: "bg-slate-100 text-slate-600",
      dotColor: "bg-slate-300",
      action: "assigned task to",
      highlight: "Alex Morgan",
      time: "Yesterday",
    },
    {
      id: "3",
      actor: "Sarah Chen",
      actorInitials: "SC",
      avatarBg: "bg-slate-100 text-slate-600",
      dotColor: "bg-slate-300",
      action: "created the task",
      time: "2 days ago",
    },
  ],
};

export const editTaskDefaults: EditTaskDefaults = {
  code: "TASK-124",
  title: "Implement authentication flow",
  description:
    "Implement the complete authentication flow including login, registration and session handling.",
  status: "In Progress",
  priority: "High",
  assignee: "Alex Morgan",
  assigneeInitials: "AM",
  dueDate: "Aug 28, 2024",
  tags: ["Frontend", "Authentication"],
  subtasks: [
    { id: "1", title: "Design login UI", completed: true },
    { id: "2", title: "Implement JWT handling", completed: false },
  ],
  blockedBy: { code: "TASK-102", title: "Configure a..." },
};

export const createTaskDefaults = {
  statuses: ["Todo", "In Progress", "Review", "Done"],
  priorities: ["Low", "Medium", "High", "Critical"],
  defaultAssignee: "Sarah Chen",
  defaultAssigneeInitials: "SC",
  defaultTags: ["Frontend", "Design System"],
};

export const projectStatusOptions = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
];

export const dependencyIncompleteInfo = {
  prerequisiteTask: {
    code: "TASK-102",
    title: "Configure authentication",
    status: "In Progress",
  },
  targetStatus: "Done",
};
