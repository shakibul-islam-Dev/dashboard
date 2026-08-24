"use client";

import React, { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  Users,
  UserCheck,
  ClipboardList,
  CheckCircle2,
  UserPlus,
  SlidersHorizontal,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  projects: { id: string; label: string; bg: string }[];
  extraProjects?: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionRate: number;
  status: "Online" | "Busy" | "Offline" | "Away";
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex.m@acme.dev",
    initials: "AM",
    role: "Lead Developer",
    projects: [
      { id: "p1", label: "A", bg: "bg-blue-600" },
      { id: "p2", label: "B", bg: "bg-blue-500" },
    ],
    tasksCompleted: 42,
    tasksTotal: 50,
    completionRate: 84,
    status: "Online",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.c@acme.dev",
    initials: "SC",
    role: "Senior Designer",
    projects: [
      { id: "p3", label: "D", bg: "bg-amber-600" },
      { id: "p1", label: "A", bg: "bg-blue-600" },
    ],
    extraProjects: 1,
    tasksCompleted: 28,
    tasksTotal: 35,
    completionRate: 80,
    status: "Busy",
  },
  {
    id: "3",
    name: "John Carter",
    email: "john.c@acme.dev",
    initials: "JC",
    role: "Product Manager",
    projects: [
      { id: "p1", label: "A", bg: "bg-blue-600" },
      { id: "p2", label: "B", bg: "bg-blue-500" },
      { id: "p3", label: "D", bg: "bg-amber-600" },
    ],
    tasksCompleted: 15,
    tasksTotal: 18,
    completionRate: 83,
    status: "Online",
  },
  {
    id: "4",
    name: "Maya Patel",
    email: "maya.p@acme.dev",
    initials: "MP",
    role: "Backend Engineer",
    projects: [{ id: "p2", label: "B", bg: "bg-blue-500" }],
    tasksCompleted: 35,
    tasksTotal: 60,
    completionRate: 58,
    status: "Offline",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.k@acme.dev",
    initials: "DK",
    role: "Frontend Developer",
    projects: [
      { id: "p1", label: "A", bg: "bg-blue-600" },
      { id: "p3", label: "D", bg: "bg-amber-600" },
    ],
    tasksCompleted: 12,
    tasksTotal: 15,
    completionRate: 80,
    status: "Online",
  },
  {
    id: "6",
    name: "Emily Wilson",
    email: "emily.w@acme.dev",
    initials: "EW",
    role: "QA Engineer",
    projects: [
      { id: "p2", label: "B", bg: "bg-blue-500" },
      { id: "p3", label: "D", bg: "bg-amber-600" },
    ],
    tasksCompleted: 40,
    tasksTotal: 42,
    completionRate: 95,
    status: "Away",
  },
];

export default function TeamsPages() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans text-slate-800">
      <PathProvider />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your project team members.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-xs self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Total Members</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">24</span>
            <span className="text-xs font-semibold text-emerald-600">
              ↑ 12%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Active Members</span>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">18</span>
            <span className="text-xs text-slate-400">This week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Tasks Assigned</span>
            <ClipboardList className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">142</span>
            <span className="text-xs font-semibold text-emerald-600">↑ 5%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">89</span>
            <span className="text-xs font-semibold text-emerald-600">
              ↑ 18%
            </span>
          </div>
        </div>
      </div>

      {/* Team Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">
            Team Directory
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 border border-slate-200 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 border border-slate-200 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-200">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="p-4 pl-6">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Active Projects</th>
                <th className="p-4">Tasks</th>
                <th className="p-4">Completion</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Member Name + Avatar */}
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                        {member.initials}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 leading-snug">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4 text-slate-600 font-normal">
                    {member.role}
                  </td>

                  {/* Active Projects Badges */}
                  <td className="p-4">
                    <div className="flex items-center -space-x-1">
                      {member.projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-full ${proj.bg} text-white font-medium text-[10px] flex items-center justify-center ring-2 ring-white`}
                        >
                          {proj.label}
                        </div>
                      ))}
                      {member.extraProjects && (
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-medium text-[10px] flex items-center justify-center ring-2 ring-white">
                          +{member.extraProjects}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Tasks */}
                  <td className="p-4 text-slate-700 font-medium">
                    {member.tasksCompleted}{" "}
                    <span className="text-slate-400 font-normal">
                      / {member.tasksTotal}
                    </span>
                  </td>

                  {/* Completion Bar */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            member.completionRate < 60
                              ? "bg-blue-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
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
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Showing 1 to 6 of 24 members</span>

          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-50">
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                currentPage === 2
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                currentPage === 3
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              3
            </button>
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Offline
        </span>
      );
  }
}
