"use client";

import { useCallback, useMemo } from "react";
import { myTasks as seedMyTasks } from "@/data/tasks";
import { getProjectDetails } from "@/data/projects";
import { useCustomTasks } from "@/lib/customStore";
import {
  useTaskEditOverrides,
  writeTaskEdit,
  type TaskEditOverride,
} from "@/lib/taskEditStore";

/* Legacy mock uses "Completed"/"In Progress"; map to the app's task statuses. */
const LEGACY_STATUS_MAP: Record<string, string> = {
  Completed: "Done",
  "In Progress": "In Progress",
};
const toDetailStatus = (status: string) => LEGACY_STATUS_MAP[status] ?? "Todo";

/* ── The unified task shape every project view (list + Kanban) renders ── */
export interface ProjectTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee?: string;
  dueDate?: string;
  tags: string[];
  /** Free-form reference to a task this one depends on (id or title). */
  dependency: string | null;
  /** True when the task was created by the user (persisted task store). */
  custom: boolean;
}

function applyEdit(
  task: ProjectTask,
  edit: TaskEditOverride | undefined,
): ProjectTask {
  if (!edit) return task;
  return {
    ...task,
    title: edit.title ?? task.title,
    status: edit.status ?? task.status,
    priority: edit.priority ?? task.priority,
    assignee: edit.assignee ?? task.assignee,
    dueDate: edit.dueDate ?? task.dueDate,
    tags: edit.tags ?? task.tags,
    dependency: edit.dependency !== undefined ? edit.dependency : task.dependency,
  };
}

/* ── All tasks for one project: seeded + user-created (+ legacy fallback),
      with persisted edit overrides applied so every view stays in sync. ── */
export function useProjectTasks(
  projectId: string | null | undefined,
  projectTitle: string | null | undefined,
) {
  const { tasks: customTasks, updateTask } = useCustomTasks();
  const edits = useTaskEditOverrides();

  const tasks = useMemo<ProjectTask[]>(() => {
    if (!projectId) return [];

    const seed: ProjectTask[] = projectTitle
      ? seedMyTasks
          .filter((t) => t.project === projectTitle)
          .map((t) =>
            applyEdit(
              {
                id: t.id,
                title: t.title,
                status: t.status,
                priority: t.priority,
                assignee: t.assignee,
                dueDate: t.dueDate,
                tags: t.tags,
                dependency: t.dependency ?? null,
                custom: false,
              },
              edits[t.id],
            ),
          )
      : [];

    const custom: ProjectTask[] = projectTitle
      ? customTasks
          .filter((t) => t.project === projectTitle)
          .map((t) =>
            applyEdit(
              {
                id: t.id,
                title: t.title,
                status: t.status,
                priority: t.priority,
                assignee: t.assignee || undefined,
                dueDate: t.dueDate,
                tags: t.tags ?? [],
                dependency: t.dependency ?? null,
                custom: true,
              },
              edits[t.id],
            ),
          )
      : [];

    if (seed.length > 0 || custom.length > 0) return [...seed, ...custom];

    // Fallback: synthesize a task list from the legacy per-project helper so
    // any project route still shows content.
    return getProjectDetails(projectId).tasks.map((t) => ({
      id: `${projectId}-t${t.id}`,
      title: t.title,
      status: toDetailStatus(t.status),
      priority: "Medium",
      assignee: t.assignee,
      dueDate: undefined,
      tags: [],
      dependency: null,
      custom: false,
    }));
  }, [projectId, projectTitle, customTasks, edits]);

  /* Custom tasks update the persisted task store; seeded tasks get a status
     override in the shared edit store (picked up by My Tasks, board, etc.). */
  const setTaskStatus = useCallback(
    (id: string, status: string) => {
      if (customTasks.some((t) => t.id === id)) {
        updateTask(id, { status });
      } else {
        writeTaskEdit(id, { status, updatedAt: new Date().toISOString() });
      }
    },
    [customTasks, updateTask],
  );

  return { tasks, setTaskStatus };
}
