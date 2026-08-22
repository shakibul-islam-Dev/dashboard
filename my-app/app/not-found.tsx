import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 text-8xl font-black tracking-tighter text-slate-200 dark:text-slate-800">
          404
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
          Page not found
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          This page doesn&apos;t exist
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          The page you&apos;re looking for may have been moved, deleted, or the
          URL might be incorrect.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Back to dashboard
          </Link>

          <Link
            href="/projects"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            View projects
          </Link>
        </div>
      </div>
    </main>
  );
}
