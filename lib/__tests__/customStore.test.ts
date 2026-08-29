import { describe, it, expect, vi, afterEach } from "vitest";
import {
  customTaskToMyTask,
  customProjectToProject,
  type CustomTask,
  type CustomProject,
} from "../customStore";

const task: CustomTask = {
  id: "t1",
  title: "Build API",
  description: "",
  project: "Auth System",
  status: "In Progress",
  priority: "High",
  assignee: "Alex Morgan",
  dueDate: "2099-01-05",
  tags: ["backend"],
  dependency: null,
  createdAt: new Date().toISOString(),
};

const project: CustomProject = {
  id: "cp1",
  name: "Mobile App",
  description: "",
  status: "Completed",
  startDate: "2026-01-10",
  endDate: "2026-06-20",
  teamMembers: [{ initials: "JD", bg: "bg-blue-500" }],
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("customTaskToMyTask", () => {
  it("maps fields and normalizes an empty project name", () => {
    const mapped = customTaskToMyTask({ ...task, project: "" });
    expect(mapped.title).toBe("Build API");
    expect(mapped.project).toBe("General");
    expect(mapped.priority).toBe("High");
    expect(mapped.tags).toEqual(["backend"]);
  });

  it("treats future due dates as today and dates the formatted label", () => {
    const mapped = customTaskToMyTask(task);
    expect(mapped.section).toBe("TODAY");
    expect(mapped.dueDate).toBe("Jan 5");
  });

  it("marks past due dates as overdue", () => {
    const mapped = customTaskToMyTask({ ...task, dueDate: "2000-01-05" });
    expect(mapped.section).toBe("OVERDUE");
  });

  it("labels a task due today as 'Today' so the Today filter catches it", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 29, 12, 0, 0));
    try {
      const mapped = customTaskToMyTask({ ...task, dueDate: "2026-08-29" });
      expect(mapped.section).toBe("TODAY");
      expect(mapped.dueDate).toBe("Today");
    } finally {
      vi.useRealTimers();
    }
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("customProjectToProject", () => {
  it("maps a custom project to the Project shape", () => {
    const mapped = customProjectToProject(project);
    expect(mapped.title).toBe("Mobile App");
    expect(mapped.description).toBe("No description provided.");
    expect(mapped.status).toBe("Completed");
    expect(mapped.progress).toBe(0);
    expect(mapped.avatars).toEqual(["JD"]);
    expect(mapped.date).toBe("Jun 20");
    expect(mapped.statusColor).toBeTruthy();
    expect(mapped.borderColor).toBeTruthy();
    expect(mapped.progressColor).toBeTruthy();
  });
});