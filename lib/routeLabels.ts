/* ── Friendly labels for the app's routes ───────────────────────────────────
   Shared by the breadcrumb (PathProvider) and the dynamic page title so the
   active route reads the same everywhere. */

export const APP_NAME = "TaskBoard";

/* Known top-level routes and their display labels. */
export const DASHBOARD_SECTION_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/projects": "Projects",
  "/dashboard/project-board": "Projects Board",
  "/dashboard/my-tasks": "My Tasks",
  "/dashboard/activity": "Activity",
  "/dashboard/team": "Team",
  "/dashboard/analytics": "Analytics",
  "/dashboard/task-details": "Task Details",
  "/dashboard/notifications": "Notifications",
  "/dashboard/help&support": "Help & Support",
  "/dashboard/settings": "Settings",
  "/dashboard/settings/appearance": "Appearance",
  "/dashboard/settings/notifications": "Notifications",
  "/dashboard/settings/preferences": "Preferences",
};

/* Sub-routes whose label should inherit from a parent section (e.g. "Projects"
   for the dynamic project detail route). */
const SECTION_OF: Record<string, string> = {
  "/dashboard/projects": "Projects",
  "/dashboard/settings": "Settings",
};

/** Normalize a raw URL segment into a readable title. */
function titleCase(segment: string): string {
  return decodeURIComponent(segment)
    .replace(/[&_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Resolve a pathname to its current-page label, falling back to a cleaned
 * version of the raw segment so unknown routes still read sensibly.
 */
export function routeLabel(pathname: string): string {
  const top = DASHBOARD_SECTION_LABELS[pathname];
  if (top) return top;

  const segments = pathname.split("/").filter(Boolean);

  // Dynamic project detail: /dashboard/projects/[id]
  if (
    segments.length >= 3 &&
    segments[0] === "dashboard" &&
    segments[1] === "projects"
  ) {
    return titleCase(segments[segments.length - 1]);
  }

  // Nested route (e.g. settings sub-page): label the raw last segment.
  const last = segments[segments.length - 1];
  if (last) return titleCase(last);

  return APP_NAME;
}

/**
 * Build the full crumb trail for the breadcrumb: each ancestor link plus the
 * current page as the final (non-link) crumb.
 */
export function routeCrumbs(pathname: string): { path: string; label: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const crumbs: { path: string; label: string }[] = [];

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;

    let label = DASHBOARD_SECTION_LABELS[path];
    if (!label) label = titleCase(segment);

    if (
      segments.length >= 3 &&
      segments[0] === "dashboard" &&
      segments[1] === "projects" &&
      index === segments.length - 1
    ) {
      label = titleCase(segment);
    }

    crumbs.push({ path, label });
  });

  return crumbs;
}

/** The page title shown in the browser tab for the active route. */
export function routeDocumentTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1 || pathname === "/dashboard") {
    const direct = DASHBOARD_SECTION_LABELS[pathname];
    return direct ? `${direct} · ${APP_NAME}` : APP_NAME;
  }

  const label = routeLabel(pathname);

  // Settings sub-routes → "Appearance · Settings · TaskBoard"
  if (
    segments.length >= 3 &&
    segments[0] === "dashboard" &&
    segments[1] === "settings"
  ) {
    const parent = SECTION_OF["/dashboard/settings"] ?? "Settings";
    return `${label} · ${parent} · ${APP_NAME}`;
  }

  // Project detail → "P1 · Projects · TaskBoard"
  if (
    segments.length >= 3 &&
    segments[0] === "dashboard" &&
    segments[1] === "projects"
  ) {
    const parent = SECTION_OF["/dashboard/projects"] ?? "Projects";
    return `${label} · ${parent} · ${APP_NAME}`;
  }

  return `${label} · ${APP_NAME}`;
}
