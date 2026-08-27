import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Columns3,
  MoonStar,
  ChartColumnBig,
  Users,
  Activity,
  Database,
} from "lucide-react";
import Navigation from "@/components/sharedui/Navigation";
import Footer from "@/components/sharedui/Footer";

const features = [
  {
    icon: Columns3,
    title: "Project Board",
    description:
      "A kanban-style board to move work across To Do, In Progress, Review and Done.",
  },
  {
    icon: ClipboardCheck,
    title: "My Tasks",
    description:
      "Every task assigned to you in one place — filter by status, priority and due date.",
  },
  {
    icon: ChartColumnBig,
    title: "Analytics",
    description:
      "Charts for task completion, workload and project progress at a glance.",
  },
  {
    icon: Users,
    title: "Team",
    description:
      "See who is working on what and keep everyone on the same page.",
  },
  {
    icon: Activity,
    title: "Activity Feed",
    description:
      "A live timeline of everything happening across your projects.",
  },
  {
    icon: MoonStar,
    title: "Dark Mode",
    description:
      "Easy on the eyes — light, dark or system theme, your choice.",
  },
];

const heroTasks = [
  { title: "Design landing page", status: "Done", done: true },
  { title: "Set up project board", status: "In Progress", done: false },
  { title: "Write onboarding docs", status: "To Do", done: false },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-20 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Database className="h-3.5 w-3.5 text-primary" />
            100% local — your data never leaves the browser
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Manage projects{" "}
            <span className="text-primary">without the chaos.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            TaskBoard is a fast, minimal dashboard for your team&apos;s tasks,
            projects and analytics. No setup, no backend — just log in and get
            to work.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/registration"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover active:scale-[0.98] sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-card px-6 py-3 font-medium transition-colors hover:bg-muted sm:w-auto"
            >
              Log in
            </Link>
          </div>

          {/* Mini dashboard preview */}
          <div className="mx-auto mt-16 max-w-md">
            <div className="rounded-xl border border-border bg-card p-5 text-left shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold">Today&apos;s tasks</p>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  3 items
                </span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {heroTasks.map((task) => (
                  <li
                    key={task.title}
                    className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5"
                  >
                    <span className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          task.done ? "text-primary" : "text-muted-foreground/40"
                        }`}
                      />
                      {task.title}
                    </span>
                    <span
                      className={`text-xs ${
                        task.done
                          ? "text-muted-foreground"
                          : "text-primary font-medium"
                      }`}
                    >
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border bg-muted/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need, nothing you don&apos;t
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Six focused views that cover the full lifecycle of your team&apos;s
                work.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple pricing
              </h2>
              <p className="mt-3 text-muted-foreground">
                One plan. No hidden fees.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-sm">
              <div className="rounded-2xl border-2 border-primary bg-card p-8 text-center shadow-lg shadow-primary/10">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Free Forever
                </p>
                <p className="mt-4 text-5xl font-bold">
                  $0
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <ul className="mt-6 flex flex-col gap-2.5 text-sm text-muted-foreground">
                  {[
                    "Unlimited projects & tasks",
                    "All six dashboard views",
                    "Team & activity tracking",
                    "Dark mode included",
                  ].map((item) => (
                    <li key={item} className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/registration"
                  className="mt-8 block rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-muted/50 py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to get organized?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Set up your workspace in under a minute.
            </p>
            <Link
              href="/registration"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
