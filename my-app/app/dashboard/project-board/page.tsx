"use client";
import PathProvider from "@/components/customsUi/PathProvider";

import React from "react";
import {
  FolderKanban,
  Clock,
  Sparkles,
  AlertTriangle,
  Plus,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { projectBoardData, type BoardProject } from "@/data/projects";

export default function ProjectBoard() {
  const [projects] = React.useState(projectBoardData);

  return (
    <div className="w-full min-h-screen bg-transparent p-6 sm:p-8 font-sans text-foreground">
      {/* Header Section */}
      <PathProvider />
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Workspace Project Board
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor active sprints, overdue milestones, and team assignments.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl text-xs font-semibold shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Running</p>
            <p className="text-xl font-bold text-foreground">
              {projects.running.length}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Upcoming</p>
            <p className="text-xl font-bold text-foreground">
              {projects.upcoming.length}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">New Projects</p>
            <p className="text-xl font-bold text-foreground">
              {projects.newProjects.length}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Overdue</p>
            <p className="text-xl font-bold text-foreground">
              {projects.overdue.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Board Columns Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* Column 1: Overdue Projects */}
        <BoardColumn
          title="Overdue"
          count={projects.overdue.length}
          badgeBg="bg-rose-100 text-rose-700"
          accentBorder="border-t-rose-500"
        >
          {projects.overdue.map((project) => (
            <ProjectCard key={project.id} project={project} isOverdue />
          ))}
        </BoardColumn>

        {/* Column 2: Running Projects */}
        <BoardColumn
          title="Running"
          count={projects.running.length}
          badgeBg="bg-amber-100 text-amber-700"
          accentBorder="border-t-amber-500"
        >
          {projects.running.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </BoardColumn>

        {/* Column 3: Upcoming Projects */}
        <BoardColumn
          title="Upcoming"
          count={projects.upcoming.length}
          badgeBg="bg-primary/15 text-primary"
          accentBorder="border-t-primary"
        >
          {projects.upcoming.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </BoardColumn>

        {/* Column 4: New Projects */}
        <BoardColumn
          title="New Projects"
          count={projects.newProjects.length}
          badgeBg="bg-emerald-100 text-emerald-700"
          accentBorder="border-t-emerald-500"
        >
          {projects.newProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </BoardColumn>
      </div>
    </div>
  );
}

{
  /* Column Wrapper Component */
}
function BoardColumn({
  title,
  count,
  badgeBg,
  accentBorder,
  children,
}: {
  title: string;
  count: number;
  badgeBg: string;
  accentBorder: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-muted/70 border border-border border-t-4 ${accentBorder} rounded-2xl p-4 flex flex-col gap-4 min-h-125`}
    >
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          <span
            className={`px-2 py-0.5 text-xs font-bold rounded-full ${badgeBg}`}
          >
            {count}
          </span>
        </div>
        <button type="button" className="text-muted-foreground hover:text-muted-foreground">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

{
  /* Individual Project Card */
}
function ProjectCard({
  project,
  isOverdue = false,
}: {
  project: BoardProject;
  isOverdue?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-2xs hover:shadow-md transition-all space-y-4">
      {/* Key Tag & Priority */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-muted-foreground font-medium">
          {project.key}
        </span>
        <span
          className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
            project.priority === "Urgent"
              ? "bg-rose-50 text-rose-600 border border-rose-200/80"
              : project.priority === "High"
                ? "bg-amber-50 text-amber-600 border border-amber-200/80"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {project.priority}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-sm font-bold text-foreground leading-snug">
          {project.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full ${
              isOverdue ? "bg-rose-500" : "bg-primary"
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Roles Breakdown */}
      <div className="pt-2 border-t border-border text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-muted-foreground">PM:</span>
          <span className="font-semibold">{project.projectManager.name}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-muted-foreground">Team Lead:</span>
          <span className="font-semibold">{project.teamLead.name}</span>
        </div>
      </div>

      {/* Footer: Due Date & Developers Avatars */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div
          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
            isOverdue ? "text-rose-600 font-semibold" : "text-muted-foreground"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{project.dueDate}</span>
        </div>

        {/* Developers Avatar Stack */}
        <div className="flex items-center -space-x-1.5">
          {project.developers.map((dev, idx) => (
            <div
              key={idx}
              title={`Developer: ${dev.name}`}
              className="w-6 h-6 rounded-full bg-primary/15 border-2 border-white flex items-center justify-center text-[9px] font-bold text-primary shadow-2xs"
            >
              {dev.avatar}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
