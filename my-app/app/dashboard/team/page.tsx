"use client";

import React, { useState, useMemo } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import { UserPlus, SlidersHorizontal, MoreHorizontal, Search } from "lucide-react";
import { teamMembers, teamMetrics, type TeamMember } from "@/data/team";
import RouterNavigation from "@/components/customsUi/RouterNavigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

// ── Constants ──────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 4;

// Valid status filter options
type StatusFilter = "All" | "Online" | "Busy" | "Offline" | "Away";
const STATUS_OPTIONS: StatusFilter[] = ["All", "Online", "Busy", "Offline", "Away"];

export default function TeamsPages() {
  // ── State ──────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  // ── Filtered + Paginated Data ──────────────────────────────────────────
  // Apply search filter, then status filter, then paginate
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      // Search: match against name, email, or role
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query);

      // Status filter: skip filter when "All" is selected
      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Calculate pagination values from filtered results
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // "Showing X to Y of Z members"
  const showStart = filteredMembers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showEnd = Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length);

  // ── Invite Member handler ──────────────────────────────────────────────
  function handleInviteMember() {
    toast.info("Invite Member", {
      description: "Invite functionality coming soon.",
    });
  }

  // ── Page change helpers (reset to page 1 when filters change) ──────────
  // We wrap filter changes to always reset pagination
  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleStatusFilterChange(status: StatusFilter) {
    setStatusFilter(status);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8 font-sans text-foreground">
      <RouterNavigation />
      <PathProvider />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your project team members.
          </p>
        </div>
        {/* Invite Member button toggles modal state */}
        <Button
          className="self-start sm:self-auto"
          onClick={handleInviteMember}
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* ── Metrics Overview Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {teamMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
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
                  <span className="text-xs text-muted-foreground">
                    {metric.note}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Team Directory Table ────────────────────────────────────────── */}
      <Card>
        <CardHeader className="p-5 flex flex-row items-center justify-between border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Team Directory
          </h2>
          <div className="flex items-center gap-2">
            {/* Search input: filters by name, email, or role */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8 h-8 w-48"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* ── Status Filter Buttons ─────────────────────────────────────── */}
        <div className="px-5 pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Status:
          </span>
          {STATUS_OPTIONS.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleStatusFilterChange(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* ── Table Body ────────────────────────────────────────────────── */}
        <CardContent className="p-0 pt-4">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-6">Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Active Projects</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar size="default" className="w-9 h-9 shrink-0">
                          <AvatarFallback className="border border-border text-foreground font-semibold text-xs">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground leading-snug">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground font-normal">
                      {member.role}
                    </TableCell>

                    <TableCell>
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
                    </TableCell>

                    <TableCell className="font-medium">
                      {member.tasksCompleted}{" "}
                      <span className="text-muted-foreground font-normal">
                        / {member.tasksTotal}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={member.completionRate}
                          className={`w-24 ${
                            member.completionRate < 60
                              ? ""
                              : "[&_[data-slot=progress-indicator]]:bg-emerald-500"
                          }`}
                        />
                        <span className="text-xs text-muted-foreground font-medium">
                          {member.completionRate}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Empty state when no members match the current filters
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                    No team members found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* ── Table Footer: Pagination ──────────────────────────────────── */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Dynamic "Showing X to Y of Z members" */}
          <span>
            Showing {showStart} to {showEnd} of {filteredMembers.length} members
          </span>

          <div className="flex items-center gap-1">
            {/* Previous button: disabled on page 1 */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            {/* Dynamic page number buttons based on totalPages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className="h-7 w-7 p-0 text-xs"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            {/* Next button: disabled on last page */}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── StatusBadge Helper Component ─────────────────────────────────────────
function StatusBadge({ status }: { status: TeamMember["status"] }) {
  const variants: Record<
    TeamMember["status"],
    { className: string; dot: string }
  > = {
    Online: {
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
      dot: "bg-emerald-500",
    },
    Busy: {
      className:
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
      dot: "bg-amber-500",
    },
    Away: {
      className:
        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
      dot: "bg-orange-500",
    },
    Offline: {
      className: "bg-muted text-muted-foreground border-border hover:bg-muted",
      dot: "bg-muted-foreground",
    },
  };

  const v = variants[status];

  return (
    <Badge variant="outline" className={`gap-1.5 ${v.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {status}
    </Badge>
  );
}
