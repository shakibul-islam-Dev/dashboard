"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  MoreHorizontal,
  X,
  Calendar,
  AlertCircle,
  Folder,
  Plus,
  Link2,
  Send,
} from "lucide-react";
import { taskDetail } from "@/data/tasks";
import { toast } from "sonner";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    id?: string;
    title?: string;
    status?: string;
    project?: string;
    assignee?: string;
    dueDate?: string;
    priority?: string;
    tags?: string[];
  };
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
}: TaskDetailModalProps) {
  const [comment, setComment] = useState("");

  const code = task?.id ?? taskDetail.code;
  const title = task?.title ?? taskDetail.title;
  const status = task?.status ?? taskDetail.status;
  const project = task?.project ?? taskDetail.project;
  const dueDate = task?.dueDate ?? taskDetail.dueDate;
  const priority = task?.priority ?? taskDetail.priority;
  const tags = task?.tags && task.tags.length > 0 ? task.tags : taskDetail.tags;
  const assigneeName = task?.assignee ?? taskDetail.assignee.name;
  const assigneeInitials = task?.assignee
    ? task.assignee
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : taskDetail.assignee.initials;

  // Close modal on Escape key press
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

  if (!isOpen) return null;

  // ── Comment submission handler ───────────────────────────────────────────
  const handleSendComment = () => {
    if (!comment.trim()) return;
    toast.success("Comment posted", {
      description: `"${comment.trim()}"`,
    });
    setComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop / Overlay */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card Wrapper */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden font-sans text-foreground z-10 my-auto animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="p-4 px-6 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-semibold bg-muted text-muted-foreground px-2 py-1 rounded">
              {code}
            </span>
            {/* Replaced: raw <span> badge → <Badge variant="outline"> */}
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/100" />
              {status}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            {/* Replaced: raw <button> edit → <Button variant="ghost" size="icon"> */}
            <Button variant="ghost" size="icon" className="p-1">
              <Pencil className="w-4 h-4" />
            </Button>
            {/* Replaced: raw <button> more options → <Button variant="ghost" size="icon"> */}
            <Button variant="ghost" size="icon" className="p-1">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-muted" />
            {/* Replaced: raw <button> close → <Button variant="ghost" size="icon"> */}
            <Button variant="ghost" size="icon" onClick={onClose} className="p-1">
              <X className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Title & Description */}
          <div>
            <h1 className="text-xl font-bold text-foreground leading-snug">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {taskDetail.description}
            </p>
          </div>

          {/* Metadata Details Box */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
            {/* Assignee */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-muted-foreground uppercase mb-2">
                Assignee
              </span>
              <div className="flex items-center gap-2">
                {/* Replaced: raw avatar <div> → <Avatar> / <AvatarFallback> */}
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-[10px] font-semibold bg-muted text-foreground">
                    {assigneeInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {assigneeName}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-muted-foreground uppercase mb-2">
                Due Date
              </span>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {dueDate}
                </span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-muted-foreground uppercase mb-2">
                Priority
              </span>
              {/* Replaced: raw priority <span> badge → <Badge variant="destructive"> */}
              <Badge variant="destructive" className="gap-1.5 px-2.5 py-0.5 text-xs font-semibold">
                <AlertCircle className="w-3 h-3" />
                {priority}
              </Badge>
            </div>

            {/* Project */}
            <div>
              <span className="block text-[11px] font-mono font-bold tracking-wider text-muted-foreground uppercase mb-2">
                Project
              </span>
              <div className="flex items-center gap-2 text-foreground">
                <Folder className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {project}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="col-span-2">
              <span className="block text-[11px] font-mono font-bold tracking-wider text-muted-foreground uppercase mb-2">
                Tags
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {/* Replaced: raw tag <span> pills → <Badge variant="outline"> */}
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs font-mono font-medium px-2.5 py-1 bg-muted text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
                {/* Replaced: raw <button> add tag → <Button variant="ghost" size="sm"> */}
                <Button variant="ghost" size="sm" className="gap-1 border border-dashed border-border text-xs font-mono px-2.5 py-1">
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Dependency Section */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Dependency
            </h2>
            <div className="bg-card border border-border rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono font-semibold text-muted-foreground">
                    {taskDetail.dependency.code}
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {taskDetail.dependency.title}
                  </p>
                </div>
              </div>
              {/* Replaced: raw dependency status <span> → <Badge variant="outline"> */}
              <Badge variant="outline" className="text-[10px] font-bold font-mono tracking-wider uppercase bg-primary/10 text-primary border-primary/20">
                {taskDetail.dependency.status}
              </Badge>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="pt-2">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Activity
            </h2>

            <div className="relative pl-6 space-y-6">
              {/* Timeline Line */}
              <div className="absolute left-1.75 top-2 bottom-2 w-[1.5px] bg-muted" />

              {taskDetail.activity.map((item) => (
                <div
                  key={item.id}
                  className="relative flex items-start gap-3"
                >
                  <div
                    className={`absolute -left-5.75 top-1.5 w-2 h-2 rounded-full ${item.dotColor} ring-4 ring-white`}
                  />
                  {/* Replaced: raw activity avatar <div> → <Avatar> / <AvatarFallback> */}
                  <Avatar className={`w-7 h-7 shrink-0 mt-0.5 ${item.avatarBg}`}>
                    <AvatarFallback className="font-semibold text-[10px]">
                      {item.actorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-foreground">
                      <span className="font-semibold text-foreground">
                        {item.actor}
                      </span>{" "}
                      {item.action}{" "}
                      {item.highlight && (
                        <span
                          className={
                            item.highlightBlue
                              ? "font-medium text-primary"
                              : "font-semibold text-foreground"
                          }
                        >
                          {item.highlight}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Comment Input */}
        <div className="p-4 px-6 border-t border-border bg-muted/50">
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-3 py-2 shadow-2xs">
            {/* Replaced: raw comment avatar <div> → <Avatar> / <AvatarFallback> */}
            <Avatar className="w-6 h-6 shrink-0">
              <AvatarFallback className="text-[10px] font-semibold bg-muted text-foreground">
                {assigneeInitials}
              </AvatarFallback>
            </Avatar>
            {/* Replaced: raw <input type="text"> → <Input> */}
            <Input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-0 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {/* Replaced: raw <button> send → <Button variant="ghost" size="icon"> */}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary p-1"
              onClick={handleSendComment}
              disabled={!comment.trim()}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
