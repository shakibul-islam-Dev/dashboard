# TaskBoard Dashboard - Full Codebase Documentation

## 1. Project Overview

**TaskBoard** is a **team project management dashboard** built with **Next.js 16 (App Router)** + **React 19** + **TypeScript**. It is a client-side only application with **no backend/database** — all data is static mock data. User-created tasks and projects persist only in `localStorage`.

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.2 (App Router, React Compiler enabled) |
| UI Library | shadcn/ui v4 (Base UI variant via `@base-ui/react`) |
| Styling | Tailwind CSS v4 (CSS-first config, `tw-animate-css`) |
| Charts | Recharts (AreaChart, PieChart, BarChart) |
| Icons | Lucide React |
| Animations | Motion (Framer Motion successor) |
| Toasts | Sonner |
| Font | Roboto Mono (Google Fonts, applied as CSS variable) |
| State | React `useState`/`useEffect` + `localStorage` persistence |

### Scripts
- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Production server
- `npm run lint` — ESLint

---

## 2. Project Structure

```
my-app/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (ThemeProvider, Toaster, font)
│   ├── page.tsx                  # Root "/" — empty placeholder
│   ├── globals.css               # Tailwind + CSS variables (light/dark themes)
│   ├── loading.tsx               # Root loading skeleton
│   ├── error.tsx                 # Root error boundary
│   ├── not-found.tsx             # 404 page
│   ├── global-error.tsx          # Global error component
│   └── dashboard/                # Dashboard layout group
│       ├── layout.tsx            # Dashboard shell (Sidebar + Navbar)
│       ├── page.tsx              # Dashboard home (stats, projects, activity)
│       ├── projects/
│       │   ├── page.tsx          # Projects list (grid/list, search, filter, sort)
│       │   └── [id]/page.tsx     # Project detail (tasks, team, files tabs)
│       ├── project-board/page.tsx# Kanban board (overdue/running/upcoming/new)
│       ├── my-tasks/page.tsx     # My Tasks table (filter, sort, sections)
│       ├── task-details/page.tsx # Task detail placeholder page
│       ├── team/page.tsx         # Team directory (search, filter, pagination)
│       ├── analytics/page.tsx    # Analytics (4 charts, metrics)
│       ├── activity/page.tsx     # Activity timeline (tab filter, date range)
│       ├── settings/
│       │   ├── page.tsx          # Settings (General, Notifications, Preferences)
│       │   ├── appearance/page.tsx  # Theme selector (light/dark/system)
│       │   ├── notifications/page.tsx # Email/Push/Desktop notification settings
│       │   └── preferences/page.tsx   # Localization, workspace, privacy settings
│       └── help&support/page.tsx # FAQ + help resources
├── components/
│   ├── ui/                       # shadcn/ui primitives (Button, Card, Badge, etc.)
│   ├── customsUi/                # Custom business components
│   │   ├── ThemeProvider.tsx      # Theme context (light/dark/system + localStorage)
│   │   ├── PathProvider.tsx       # Breadcrumb navigation from URL path
│   │   ├── RouterNavigation.tsx   # Back/Forward browser navigation buttons
│   │   ├── Notifications.tsx      # Gmail-style mail inbox (full page)
│   │   ├── NotificationsModal.tsx # Dropdown notification panel (header bell)
│   │   ├── CreateTaskModal.tsx    # Task creation modal (with localStorage save)
│   │   ├── CreateTask.tsx         # Standalone create task page with backdrop
│   │   ├── CreateProjectModal.tsx # Project creation modal (with localStorage save)
│   │   ├── EditTaskModal.tsx      # Task editor (subtasks, tags, dependencies)
│   │   ├── TaskDetailModal.tsx    # Task detail view (metadata, activity, comments)
│   │   ├── DependencyIncompleteModal.tsx # Warning when moving blocked task
│   │   ├── LoadingSkeletonDashboard.tsx  # Dashboard loading skeleton
│   │   ├── DashboardErrorCard.tsx        # Dashboard error state
│   │   ├── EmptyStatesSection.tsx        # Empty state patterns (no projects/tasks/search)
│   │   └── TaskLoadingFails.tsx          # Task loading failure state
│   └── dashboard/
│       ├── DashboardSideBar.tsx   # Collapsible sidebar with nav links
│       └── DashboardNavigation.tsx# Top navbar (search, notifications, user menu)
├── data/                         # Static mock data
│   ├── index.ts                  # Barrel export
│   ├── tasks.ts                  # Tasks, task detail, edit defaults, create defaults
│   ├── projects.ts               # Projects (page, board, dashboard, detail)
│   ├── team.ts                   # Team members + metrics
│   ├── analytics.ts              # Chart data + dashboard stats
│   ├── activity.ts               # Activity timeline + recent activity
│   ├── navigation.ts             # Sidebar links + current user
│   └── notifications.ts          # Mail notifications + dropdown notifications
├── lib/
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── public/                       # Static assets
├── next.config.ts                # Next.js config (Unsplash images, React Compiler)
├── tsconfig.json                 # TypeScript config (path alias @/*)
├── postcss.config.mjs            # PostCSS (Tailwind plugin)
├── eslint.config.mjs             # ESLint (Next.js core-web-vitals + TypeScript)
└── components.json               # shadcn/ui config (base-nova style, lucide icons)
```

---

## 3. Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── Roboto Mono font
├── ThemeProvider (client-side theme management)
├── Toaster (sonner, top-right)
└── NoFlashThemeScript (inline script to prevent dark mode flash)

  └── / → app/page.tsx (empty)

  └── /dashboard → DashboardLayout (app/dashboard/layout.tsx) [CLIENT]
      ├── DashboardSideBar (collapsible, mobile-aware, localStorage-persisted)
      ├── DashboardNavigation (search, bell, help, user dropdown)
      └── <children> (individual dashboard pages)
```

---

## 4. Routing & Pages

### Root Level (`/`)
| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Empty placeholder page |

### Dashboard Pages (`/dashboard/*`)
| Route | File | Description |
|---|---|---|
| `/dashboard` | `dashboard/page.tsx` | Home: stats cards, project progress grid, recent activity timeline |
| `/dashboard/projects` | `dashboard/projects/page.tsx` | Projects list: grid/list toggle, search, filter (All/Active/Completed/Paused), sort (modified/name/progress), context menu |
| `/dashboard/projects/[id]` | `dashboard/projects/[id]/page.tsx` | Project detail: metrics cards, tabbed content (Tasks, Team, Files) — **Server Component** |
| `/dashboard/project-board` | `dashboard/project-board/page.tsx` | Kanban board: 4 columns (Overdue, Running, Upcoming, New), per-column sort/collapse, drag cursor hint |
| `/dashboard/my-tasks` | `dashboard/my-tasks/page.tsx` | Task table: sections (All/Overdue/Today), search, sort (due date asc/desc), checkboxes, create/detail modals |
| `/dashboard/task-details` | `dashboard/task-details/page.tsx` | Placeholder page for task details (links back to My Tasks) |
| `/dashboard/team` | `dashboard/team/page.tsx` | Team directory: search, status filter (All/Online/Busy/Offline/Away), paginated table |
| `/dashboard/analytics` | `dashboard/analytics/page.tsx` | Analytics: 4 metric cards + AreaChart (completion trend), PieChart (status distribution), BarChart (priority), Progress bars (project progress) |
| `/dashboard/activity` | `dashboard/activity/page.tsx` | Activity timeline: tabbed filter (All/Tasks/Projects/Team/Comments), date range filter |
| `/dashboard/settings` | `dashboard/settings/page.tsx` | Settings hub: General (workspace name/desc + localStorage), Notifications (link), Preferences (link), Appearance (link) |
| `/dashboard/settings/appearance` | `dashboard/settings/appearance/page.tsx` | Theme picker: Light/Dark/System with live preview tiles |
| `/dashboard/settings/notifications` | `dashboard/settings/notifications/page.tsx` | Notification settings: Email/Push/Desktop toggles + localStorage persistence |
| `/dashboard/settings/preferences` | `dashboard/settings/preferences/page.tsx` | Preferences: theme, language, timezone, compact view, auto-save, analytics consent + localStorage |
| `/dashboard/help&support` | `dashboard/help&support/page.tsx` | Help center: search, documentation/FAQ/support cards, collapsible FAQ list |

---

## 5. Data Layer (`data/`)

All data is **static mock data** — no API calls exist. The `data/` directory is the single source of truth.

### `data/tasks.ts`
- **`MyTask`** — Task list item (id, title, project, status, priority, dueDate, tags, section)
- **`TaskDetailData`** — Full task detail (code, description, assignee, dependency, activity timeline)
- **`EditTaskDefaults`** — Pre-filled edit form data (title, subtasks, tags, blockedBy)
- **`Subtask`** — { id, title, completed }
- **`createTaskDefaults`** — Available statuses, priorities, default assignee/tags
- **`projectStatusOptions`** — ["Planning", "In Progress", "On Hold", "Completed"]
- **`dependencyIncompleteInfo`** — Warning data when moving blocked tasks

### `data/projects.ts`
- **`projectsPageData`** — 6 projects with icon, status colors, progress, avatars
- **`projectBoardData`** — Kanban columns: overdue(1), running(2), upcoming(1), newProjects(1)
- **`dashboardProjects`** — 4 simplified project cards for the home page
- **`getProjectDetails(id)`** — Returns mock detail data for any project ID

### `data/team.ts`
- **`teamMembers`** — 6 members with name, email, role, projects, tasks, completion rate, status
- **`teamMetrics`** — 4 summary cards (total, active, assigned, completed)
- **`defaultProjectMembers`** — 3 default avatars for project creation

### `data/analytics.ts`
- **`taskCompletionTrendData`** — Weekly completion line chart data
- **`tasksByStatusData`** — Status distribution pie chart data
- **`priorityDistributionData`** — Priority bar chart data
- **`projectProgressData`** — 4 project progress bars
- **`analyticsMetrics`** — 4 top metric cards
- **`dashboardStats`** — 4 home page stat cards

### `data/activity.ts`
- **`activityData`** — Timeline grouped by Today/Yesterday/Earlier This Week
- **`activityTabs`** — Filter tabs
- **`recentActivityData`** — 4 recent activity items for dashboard home

### `data/navigation.ts`
- **`dashboardSidebarLinks`** — 7 nav items (Dashboard, Projects, Board, Tasks, Activity, Team, Analytics)
- **`currentUser`** — Alex Morgan, Product Manager, with avatar URL

### `data/notifications.ts`
- **`mailNotifications`** — 4 email-style notifications (GitHub, Vercel, Sarah Chen, LinkedIn)
- **`dropdownNotifications`** — 5 bell dropdown notifications
- **`workspaceInfo`** — Workspace name/plan/description
- **`settingsTabs`** — 4 settings sidebar tabs

---

## 6. Components

### UI Primitives (`components/ui/`)
These are **shadcn/ui v4** components (Base UI variant):
`avatar`, `badge`, `button`, `calendar`, `card`, `checkbox`, `input`, `progress`, `select`, `table`, `tabs`, `textarea`

### Custom Components (`components/customsUi/`)

| Component | Purpose | Key Features |
|---|---|---|
| `ThemeProvider` | Theme context provider | Supports light/dark/system, persists to `localStorage`, listens to OS preference changes, provides `useTheme()` hook |
| `PathProvider` | Breadcrumb navigation | Reads `usePathname()`, splits into segments, capitalizes names, links each segment |
| `RouterNavigation` | Back/Forward buttons | Uses `router.back()`/`router.forward()`, disabled on root |
| `Notifications` | Full mail inbox | Gmail-style: category tabs (Primary/Updates/Social), search, select all/individual, bulk mark read/unread/delete, pagination, expand to read |
| `NotificationsModal` | Bell dropdown | TODAY/EARLIER sections, mark all as read, click-outside close, click to navigate |
| `CreateTaskModal` | Task creation form | Title, description (rich text toolbar), status, priority, assignee, due date, tags (add/remove), dependency search. Validates, saves to `localStorage`, shows toast |
| `CreateTask` | Standalone task creation | Same as CreateTaskModal but with a blurred background app mockup |
| `CreateProjectModal` | Project creation form | Name, description, status, timeline, team members (add/remove from pool). Validates, saves to `localStorage`, shows toast |
| `EditTaskModal` | Task editing form | 2-column layout: title, description, subtasks (toggle, add, inline edit); status, priority, assignee, due date, tags, dependencies. Saves to `localStorage` |
| `TaskDetailModal` | Task detail view | Shows code, status badge, title, description, metadata (assignee, due date, priority, project, tags), dependency card, activity timeline, comment input |
| `DependencyIncompleteModal` | Warning dialog | Shown when trying to move a blocked task to Done |
| `LoadingSkeletonDashboard` | Dashboard skeleton | Full-page pulse animation skeleton with cards, charts, and table placeholders |
| `DashboardErrorCard` | Dashboard error state | Retry button with loading state |
| `EmptyStatesSection` | Empty state showcase | 3 cards: No Projects, No Tasks, No Search Results |
| `TaskLoadingFails` | Task loading failure | Split layout with skeleton sidebar + dashed error card |

### Dashboard Components (`components/dashboard/`)

| Component | Purpose | Key Features |
|---|---|---|
| `DashboardSideBar` | Collapsible sidebar | 7 nav links, Settings/Help at bottom, user profile, collapse persisted to `localStorage`, mobile-aware (backdrop, slide-in/out) |
| `DashboardNavigation` | Top navbar | Mobile menu button, search input (shows toast on Enter), notifications bell with unread count, help link, user avatar dropdown (Profile, Settings, Sign Out) |

---

## 7. State Management

There is **no global state management library** (no Redux, Zustand, Jotai, etc.). State is managed through:

1. **Component-level `useState`** — Each page/component manages its own state (filters, modals, form inputs)
2. **`ThemeProvider` Context** — The only React Context in the app; manages theme state
3. **`localStorage` Persistence** — Used extensively for:
   - `dashboard-theme` — Theme preference
   - `sidebar-collapsed` — Sidebar collapse state
   - `settings_workspaceName` / `settings_workspaceDesc` — General settings
   - `settings_notifications` — Notification preferences
   - `settings_preferences` — User preferences
   - `dashboard_custom_tasks` — User-created tasks
   - `dashboard_custom_projects` — User-created projects
   - `dashboard_edited_tasks` — Task edits

---

## 8. Theming & Styling

### Theme System
- **Custom `ThemeProvider`** (not `next-themes`, which is a dependency but unused)
- Supports **light**, **dark**, and **system** modes
- Dark mode class: `.dark` applied to `<html>` via `classList.toggle`
- Anti-flash script in `layout.tsx` reads localStorage before paint
- CSS variables defined in `globals.css` under `:root` and `.dark`

### Design Tokens (from `globals.css`)
- Primary: `#2563eb` (blue)
- Background: `#f7f7f8` (light) / `#0f0e13` (dark)
- Card: `#ffffff` (light) / `#1d1c1f` (dark)
- Font: Roboto Mono (applied as `--font-sans`)

---

## 9. Key Functionality Flows

### Task Creation Flow
1. User clicks "Create Task" button
2. `CreateTaskModal` opens with form fields
3. User fills in title (required), description, status, priority, assignee, due date, tags
4. On submit: validates title -> simulates 600ms delay -> creates task object -> saves to `localStorage` -> shows toast -> resets form -> closes modal

### Project Creation Flow
1. User clicks "New Project" or "Create New Project"
2. `CreateProjectModal` opens
3. User fills in name (required), description, status, timeline, team members
4. On submit: validates name -> simulates delay -> saves to `localStorage` -> shows toast -> closes

### Task Editing Flow
1. User opens `EditTaskModal` from My Tasks page
2. Pre-filled with `editTaskDefaults` data
3. User edits title, description, subtasks (toggle/add/inline edit), status, priority, due date, tags, dependencies
4. On save: validates -> saves to `localStorage` (keyed by task code) -> shows toast

### Theme Switching Flow
1. User navigates to Settings -> Appearance (or Preferences)
2. Clicks Light/Dark/System tile
3. `useTheme().setTheme()` is called
4. ThemeProvider updates state, applies `.dark` class to `<html>`, saves to `localStorage`
5. OS media query listener updates live when in "system" mode

### Search & Filter Flow (Examples)
- **Projects page**: Text search filters by title/description, segmented control filters by status (All/Active/Completed/Paused), sort dropdown (modified/name/progress), view toggle (grid/list)
- **My Tasks page**: Text search filters by title/project, section tabs (All/Overdue/Today), sort by due date
- **Team page**: Text search filters by name/email/role, status buttons filter by online status, paginated with Previous/Next

---

## 10. Known Issues / Notes

1. **Duplicate `.dark` block in `globals.css`** (lines 89-122 and 124-156) — identical dark theme values are defined twice
2. **Duplicate font variable** in `app/layout.tsx` line 23 — `${robotoMono.variable} ${robotoMono.variable}` is applied twice
3. **`next-themes` dependency** is installed but unused — a custom ThemeProvider is used instead
4. **`CreateTask.tsx` vs `CreateTaskModal.tsx`** — Two different create task components exist. `CreateTask.tsx` is a standalone full-page component with a blurred background mockup, while `CreateTaskModal.tsx` is the actual modal used in the app
5. **No actual data persistence** — Created/edited tasks and projects exist only in localStorage and are not reflected in the static mock data displayed on pages
6. **`motion` library** is imported in `dashboard/page.tsx` for the Quick Add button animation but is otherwise unused
7. **The `/` route** is empty — users must manually navigate to `/dashboard`
8. **Project Board** has drag cursor styling (`cursor-grab`) but no actual drag-and-drop implementation
9. **Search in Navbar** only shows a toast — no actual search functionality
10. **`EmptyStatesSection`** and **`TaskLoadingFails`** components are defined but not rendered anywhere in the app

---

## 11. File Count Summary

| Category | Count |
|---|---|
| Pages (route files) | 16 |
| Custom Components | 15 |
| UI Primitives | 12 |
| Data Modules | 8 |
| Config Files | 6 |
| **Total Source Files** | **~57** |
