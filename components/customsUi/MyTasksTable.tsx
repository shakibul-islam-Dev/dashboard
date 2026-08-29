"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  MoreVertical,
  PencilLine,
  Archive,
  Trash2,
  Minus,
} from "lucide-react";
import type { MyTask } from "@/data/tasks";
import { fadeUp, popIn } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

/* === FILTER DROPDOWN === */
export function FilterDropdown({
  label,
  options,
  value,
  open,
  onOpenChange,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Button
        variant="outline"
        className="gap-1.5"
        onClick={() => onOpenChange(!open)}
      >
        {value !== "All" ? `${label}: ${value}` : label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.span>
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              variants={popIn}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute left-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[160px] max-h-64 overflow-y-auto origin-top-left"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    onOpenChange(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer ${
                    value === opt
                      ? "font-semibold text-foreground bg-muted/50"
                      : "text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* === TASK TABLE === */
export function TaskTable({
  tasks,
  showHeader = false,
  selectedTasks,
  toggleSelectAll,
  toggleTaskSelection,
  allSelected,
  onTaskClick,
  onEdit,
  onArchive,
  onDelete,
  rowMenuId,
  setRowMenuId,
}: {
  tasks: MyTask[];
  showHeader?: boolean;
  selectedTasks: Set<string>;
  toggleSelectAll: () => void;
  toggleTaskSelection: (id: string) => void;
  allSelected: boolean;
  onTaskClick: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  rowMenuId: string | null;
  setRowMenuId: (id: string | null) => void;
}) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="shadow-xs overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-175">
            {showHeader && (
              <TableHeader>
                <TableRow className="bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <TableHead className="p-3.5 pl-4 w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="p-3.5">Task</TableHead>
                  <TableHead className="p-3.5">Project</TableHead>
                  <TableHead className="p-3.5">Status</TableHead>
                  <TableHead className="p-3.5">Priority</TableHead>
                  <TableHead className="p-3.5">Due Date</TableHead>
                  <TableHead className="p-3.5 pr-4">Tags</TableHead>
                  <TableHead className="p-3.5 pr-4" aria-label="Actions" />
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="hover:bg-muted/60 transition-colors cursor-pointer"
                  onClick={() => onTaskClick(task.id)}
                >
                  <TableCell
                    className="p-3.5 pl-4 align-top"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      className="mt-0.5 cursor-pointer"
                      checked={selectedTasks.has(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                    />
                  </TableCell>
                  <TableCell className="p-3.5 align-top max-w-xs">
                    <p className="font-medium text-foreground leading-snug">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {task.id}
                    </p>
                  </TableCell>
                  <TableCell className="p-3.5 align-top text-muted-foreground font-normal">
                    {task.project}
                  </TableCell>
                  <TableCell className="p-3.5 align-top">
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="p-3.5 align-top">
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="p-3.5 align-top">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span
                        className={
                          task.section === "OVERDUE"
                            ? "text-rose-600 font-semibold"
                            : "text-foreground"
                        }
                      >
                        {task.dueDate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-3.5 pr-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[11px] font-medium px-2 py-0.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell
                    className="p-3.5 pr-4 align-top w-12"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={`Actions ${task.id}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={() =>
                          setRowMenuId(rowMenuId === task.id ? null : task.id)
                        }
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>

                      {rowMenuId === task.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setRowMenuId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
                            <button
                              onClick={() => {
                                setRowMenuId(null);
                                onEdit(task.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-muted transition-colors cursor-pointer"
                            >
                              <PencilLine className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setRowMenuId(null);
                                onArchive(task.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              Archive
                            </button>
                            <button
                              onClick={() => {
                                setRowMenuId(null);
                                onDelete(task.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-muted transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* === BADGE HELPERS === */
const STATUS_BADGE_STYLES: Record<string, string> = {
  "In Progress":
    "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10",
  Review:
    "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/10 dark:text-amber-400",
  Done: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/10 dark:text-emerald-400",
};

const STATUS_DOT_STYLES: Record<string, string> = {
  "In Progress": "bg-primary",
  Review: "bg-amber-500",
  Done: "bg-emerald-500",
};

export function StatusBadge({ status }: { status: string }) {
  const hasStyle = Boolean(STATUS_BADGE_STYLES[status]);
  return (
    <Badge
      variant={hasStyle ? "default" : "secondary"}
      className={`gap-1.5 ${STATUS_BADGE_STYLES[status] ?? "hover:bg-secondary"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_STYLES[status] ?? "bg-muted-foreground"}`}
      ></span>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
          <ChevronUp className="w-3.5 h-3.5" />
          Critical
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
          <ChevronUp className="w-3.5 h-3.5" />
          High
        </span>
      );
    case "Low":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <ChevronDown className="w-3.5 h-3.5" />
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Minus className="w-3.5 h-3.5" />
          Medium
        </span>
      );
  }
}