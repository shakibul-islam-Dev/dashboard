/* Pure team-member filter helper (search + status) for the Team page. */

export type TeamStatusFilter = "All" | "Online" | "Busy" | "Offline" | "Away";

export function filterTeamMembers<
  T extends { name: string; email: string; role: string; status: string },
>(members: T[], search: string, status: TeamStatusFilter): T[] {
  const query = search.trim().toLowerCase();
  return members.filter((member) => {
    const matchesSearch =
      !query ||
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query);
    const matchesStatus = status === "All" || member.status === status;
    return matchesSearch && matchesStatus;
  });
}
