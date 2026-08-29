/* Pure activity-feed filter for the Activity page tabs.
   Tabs map to an item type instead of fragile substring matching. */

export type ActivityItemType = "task" | "project" | "team" | "comment";

export type ActivityTab =
  | "All Activity"
  | "Tasks"
  | "Projects"
  | "Team"
  | "Comments";

const TAB_TYPE: Record<Exclude<ActivityTab, "All Activity">, ActivityItemType> =
  {
    Tasks: "task",
    Projects: "project",
    Team: "team",
    Comments: "comment",
  };

export function activityTabType(tab: string): ActivityItemType | null {
  return (TAB_TYPE as Record<string, ActivityItemType | undefined>)[tab] ?? null;
}

/* Filters groups to the tab's item type and drops the now-empty groups.
   "All Activity" (or an unknown tab) returns the groups untouched. */
export function filterActivityGroups<
  T extends { section: string; items: Array<{ type: ActivityItemType }> },
>(groups: T[], tab: string): T[] {
  const wanted = activityTabType(tab);
  if (!wanted) return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.type === wanted),
    }))
    .filter((group) => group.items.length > 0);
}
