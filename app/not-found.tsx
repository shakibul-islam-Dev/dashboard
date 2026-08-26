import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 text-8xl font-black tracking-tighter text-muted-foreground/40 dark:text-foreground">
          404
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
          Page not found
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          This page doesn&apos;t exist
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
          The page you&apos;re looking for may have been moved, deleted, or the
          URL might be incorrect.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover dark:bg-card dark:hover:bg-muted"
          >
            Back to dashboard
          </Link>

          <Link
            href="/projects"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            View projects
          </Link>
        </div>
      </div>
    </main>
  );
}
