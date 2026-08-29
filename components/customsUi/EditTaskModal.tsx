"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MoreVertical,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  ChevronDown,
  Calendar,
  Plus,
  Ban,
  Loader2,
} from "lucide-react";
import { editTaskDefaults, type Subtask } from "@/data/tasks";
import { toast } from "sonner";
import DependencyIncompleteModal from "@/components/customsUi/DependencyIncompleteModal";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";

/* ─── shadcn UI imports ─── */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

/* ── localStorage key + cross-component sync event ── */
export const LS_EDITS_KEY = "dashboard_edited_tasks";
export const EDITS_EVENT = "dashboard:task-edited";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    assignee?: string;
    assigneeInitials?: string;
    dueDate: string;
    tags: string[];
    subtasks?: Subtask[];
    blockedBy?: { code: string; title: string } | null;
  } | null;
}

interface EditTaskFormValues {
  taskTitle: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

// ── Modal motion presets ─────────────────────────────────────────────────────
const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const cardMotion = {
  initial: { opacity: 0, scale: 0.92, y: 24 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
}: EditTaskModalProps) {
  // ── React Hook Form ─────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditTaskFormValues>({
    defaultValues: {
      taskTitle: task?.title ?? editTaskDefaults.title,
      description: task?.description ?? editTaskDefaults.description,
      status: task?.status ?? editTaskDefaults.status,
      priority: task?.priority ?? editTaskDefaults.priority,
      dueDate: task?.dueDate ?? editTaskDefaults.dueDate,
    },
  });

  // ── Non-form UI state ───────────────────────────────────────────────────────
  const [assignee] = useState(task?.assignee ?? editTaskDefaults.assignee);
  const [tags, setTags] = useState<string[]>(
    task?.tags ? [...task.tags] : [...editTaskDefaults.tags],
  );
  const [tagInput, setTagInput] = useState("");

  const [subtasks, setSubtasks] = useState<Subtask[]>(
    task?.subtasks && task.subtasks.length
      ? [...task.subtasks]
      : [...editTaskDefaults.subtasks],
  );

  // ── Subtask Inline Editing ─────────────────────────────────────────────────
  const [editSubtaskId, setEditSubtaskId] = useState<string | null>(null);
  const [editSubtaskValue, setEditSubtaskValue] = useState("");

  // ── Dependency Visibility ──────────────────────────────────────────────────
  const [hasDependency, setHasDependency] = useState(
    !!(task?.blockedBy ?? editTaskDefaults.blockedBy),
  );

  // ── Dependency Warning Modal (status → Done with an incomplete dependency) ─
  const [showDependencyModal, setShowDependencyModal] = useState(false);

  // ── Submission State ────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<EditTaskFormValues | null>(null);

  // ── Escape Key Handler ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // ── Subtask Helpers ────────────────────────────────────────────────────────
  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st,
      ),
    );
  };

  const handleAddSubtask = () => {
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: "New Subtask",
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const startEditSubtask = (subtask: Subtask) => {
    setEditSubtaskId(subtask.id);
    setEditSubtaskValue(subtask.title);
  };

  const commitEditSubtask = () => {
    if (editSubtaskId === null) return;
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === editSubtaskId
          ? { ...st, title: editSubtaskValue.trim() || st.title }
          : st,
      ),
    );
    setEditSubtaskId(null);
    setEditSubtaskValue("");
  };

  // ── Tag Helpers ────────────────────────────────────────────────────────────
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // ── Save Handler: validates, persists edits to localStorage, shows toast ─────
  const doSave: SubmitHandler<EditTaskFormValues> = async (data) => {
    setShowDependencyModal(false);
    setIsSubmitting(true);

    // Simulate a brief save delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const id = task?.id ?? editTaskDefaults.code;
    const editedTask = {
      id,
      title: data.taskTitle.trim(),
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee,
      dueDate: data.dueDate,
      tags,
      subtasks,
      updatedAt: new Date().toISOString(),
    };

    // Persist edits to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(LS_EDITS_KEY) || "{}");
      existing[id] = editedTask;
      localStorage.setItem(LS_EDITS_KEY, JSON.stringify(existing));
    } catch {
      /* localStorage unavailable – ignore */
    }

    // Notify all mounted UI (My Tasks, ...) that a task was edited
    window.dispatchEvent(new CustomEvent(EDITS_EVENT, { detail: editedTask }));

    setIsSubmitting(false);
    toast.success("Changes saved", {
      description: `"${editedTask.title}" has been updated.`,
    });
    onClose();
  };

  // Gate: moving a task with an incomplete dependency to Done requires confirm
  const onFormSubmit: SubmitHandler<EditTaskFormValues> = (data) => {
    if (isSubmitting) return;
    if (data.status === "Done" && hasDependency) {
      setPendingData(data);
      setShowDependencyModal(true);
      return;
    }
    void doSave(data);
  };

  const confirmSave = () => {
    if (pendingData) {
      void doSave(pendingData);
    }
  };

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-xs"
            onClick={onClose}
            {...backdropMotion}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-3xl bg-card rounded-xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto border border-border"
            {...cardMotion}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-muted-foreground">
                  {task?.id ?? editTaskDefaults.code}
                </span>
                <h2 className="text-base font-bold text-foreground">Edit Task</h2>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4.5 h-4.5" />
                </Button>
              </div>
            </div>

            {/* Modal Body - 2 Column Layout */}
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 max-h-[80vh] overflow-y-auto">
                {/* Left Main Content Column */}
                <div className="md:col-span-7 space-y-5">
                  {/* Task Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Task Title
                    </label>
                    <Input
                      type="text"
                      aria-invalid={!!errors.taskTitle}
                      {...register("taskTitle", {
                        required: "Task title is required",
                      })}
                      className={errors.taskTitle ? "border-destructive" : ""}
                    />
                    {errors.taskTitle && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-rose-500 font-medium"
                      >
                        {errors.taskTitle.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Description
                    </label>
                    <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
                      {/* Editor Toolbar */}
                      <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted text-muted-foreground">
                        <Button variant="ghost" size="icon" type="button">
                          <Bold className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" type="button">
                          <Italic className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" type="button">
                          <List className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" type="button">
                          <ListOrdered className="w-3.5 h-3.5" />
                        </Button>
                        <div className="w-px h-3.5 bg-muted" />
                        <Button variant="ghost" size="icon" type="button">
                          <Link2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Textarea
                        rows={5}
                        {...register("description")}
                        className="border-0 rounded-none focus-visible:ring-0"
                      />
                    </div>
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-foreground">
                        Subtasks
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAddSubtask}
                        className="text-xs font-medium text-primary gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Subtask
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {subtasks.map((subtask) => (
                          <motion.div
                            key={subtask.id}
                            layout
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 12 }}
                            transition={{ type: "spring", stiffness: 320, damping: 28 }}
                            className="flex items-center gap-3 border border-border rounded-lg px-3 py-2 bg-card"
                          >
                            <Checkbox
                              checked={subtask.completed}
                              onCheckedChange={() => toggleSubtask(subtask.id)}
                            />
                            {/* Subtitle: click to edit inline */}
                            {editSubtaskId === subtask.id ? (
                              <Input
                                type="text"
                                value={editSubtaskValue}
                                onChange={(e) => setEditSubtaskValue(e.target.value)}
                                onBlur={commitEditSubtask}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitEditSubtask();
                                  if (e.key === "Escape") {
                                    setEditSubtaskId(null);
                                    setEditSubtaskValue("");
                                  }
                                }}
                                autoFocus
                                className="text-xs h-auto py-0 border-0 shadow-none focus-visible:ring-0 flex-1"
                              />
                            ) : (
                              <span
                                onClick={() => startEditSubtask(subtask)}
                                className={`text-xs font-medium cursor-pointer flex-1 ${
                                  subtask.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {subtask.title}
                              </span>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Right Properties Sidebar Column */}
                <div className="md:col-span-5 space-y-4">
                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Status
                    </label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => v && field.onChange(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todo">Todo</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Priority
                    </label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => v && field.onChange(v)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Assignee */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Assignee
                    </label>
                    <div className="relative">
                      <div className="w-full bg-card border border-border rounded-lg px-3 py-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-muted text-foreground font-semibold text-[9px] flex items-center justify-center">
                            {task?.assigneeInitials ?? editTaskDefaults.assigneeInitials}
                          </div>
                          <span className="text-xs text-foreground font-medium">
                            {assignee}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Due Date
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="text"
                        {...register("dueDate")}
                        className="pl-9 text-xs"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Tags
                    </label>
                    <div className="border border-border rounded-lg p-2 bg-card space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <AnimatePresence mode="popLayout" initial={false}>
                          {tags.map((tag) => (
                            <motion.div
                              key={tag}
                              layout
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={{ type: "spring", stiffness: 400, damping: 28 }}
                            >
                              <Badge variant="outline" className="gap-1">
                                <span>{tag}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => removeTag(tag)}
                                  className="text-muted-foreground hover:text-muted-foreground -mr-1"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <Input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Add tag..."
                        className="border-0 shadow-none focus-visible:ring-0 text-xs px-0 pt-1 h-auto"
                      />
                    </div>
                  </div>

                  {/* Blocks / Blocked By */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Blocks / Blocked By
                    </label>
                    <div className="border border-border rounded-lg p-2 bg-card space-y-2">
                      <AnimatePresence initial={false}>
                        {hasDependency && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 text-foreground rounded p-1.5 text-xs w-full justify-between overflow-hidden"
                          >
                            <div className="flex items-center gap-1.5">
                              <Ban className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {task?.blockedBy?.code ?? editTaskDefaults.blockedBy.code}
                              </span>
                              <span className="text-xs font-medium text-foreground truncate max-w-27.5">
                                {task?.blockedBy?.title ?? editTaskDefaults.blockedBy.title}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground hover:text-muted-foreground"
                              onClick={() => setHasDependency(false)}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-foreground gap-1 pt-1"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Add Dependency</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
                <Button variant="ghost" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Dependency Warning – shown when saving a dependent task as Done */}
      <DependencyIncompleteModal
        isOpen={showDependencyModal}
        onClose={() => setShowDependencyModal(false)}
        onConfirm={confirmSave}
      />
    </>
  );
}