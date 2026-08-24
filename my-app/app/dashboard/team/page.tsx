"use client";

import React, { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  UserPlus,
  SlidersHorizontal,
  MoreHorizontal,
} from "lucide-react";
import {
  teamMembers,
  teamMetrics,
  type TeamMember,
} from "@/data/team";

export default function TeamsPages() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8 font-sans text-foreground">
      <PathProvider />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your project team members.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-xs self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {teamMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-card p-5 rounded-xl border border-border shadow-xs"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-sm font-medium">{metric.label}</span>
              <metric.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {metric.value}
              </span>
              {metric.delta && (
                <span
                  className={`text-xs font-semibold ${
                    metric.delta.positive
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {metric.delta.text}
                </span>
              )}
              {metric.note && (
                <span className="text-xs text-muted-foreground">{metric.note}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Team Directory Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-5 flex items-center justify-between border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Team Directory
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-muted-foreground border border-border transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-muted-foreground border border-border transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-200">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="p-4 pl-6">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Active Projects</th>
                <th className="p-4">Tasks</th>
                <th className="p-4">Completion</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teamMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-muted/60 transition-colors"
                >
                  {/* Member Name + Avatar */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted border border-border text-foreground font-semibold text-xs flex items-center justify-center shrink-0">
                        {member.initials}
                      </div>
                      <div>
                        <p className="font-medium text-foreground leading-snug">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4 text-muted-foreground font-normal">
                    {member.role}
                  </td>

                  {/* Active Projects Badges */}
                  <td className="p-4">
                    <div className="flex items-center -space-x-1">
                      {member.projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-full ${proj.bg} text-white font-medium text-[10px] flex items-center justify-center ring-2 ring-card`}
                        >
                          {proj.label}
                        </div>
                      ))}
                      {member.extraProjects && (
                        <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground font-medium text-[10px] flex items-center justify-center ring-2 ring-card">
                          +{member.extraProjects}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Tasks */}
                  <td className="p-4 text-foreground font-medium">
                    {member.tasksCompleted}{" "}
                    <span className="text-muted-foreground font-normal">
                      / {member.tasksTotal}
                    </span>
                  </td>

                  {/* Completion Bar */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            member.completionRate < 60
                              ? "bg-primary/100"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {member.completionRate}%
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <StatusBadge status={member.status} />
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <button className="text-muted-foreground hover:text-muted-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>Showing 1 to 6 of 24 members</span>

          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-muted-foreground disabled:opacity-50">
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                currentPage === 1
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                currentPage === 2
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                currentPage === 3
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              3
            </button>
            <button className="px-2.5 py-1.5 border border-border rounded-lg text-muted-foreground hover:bg-muted">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* Status Badge Helpers */
}
function StatusBadge({ status }: { status: TeamMember["status"] }) {
  switch (status) {
    case "Online":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Online
        </span>
      );
    case "Busy":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Busy
        </span>
      );
    case "Away":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          Away
        </span>
      );
    case "Offline":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
          Offline
        </span>
      );
  }
}
