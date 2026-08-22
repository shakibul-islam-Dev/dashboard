"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
          <span className="text-xl font-bold">!</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
          Error
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          Unable to load this page
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Something unexpected happened while loading this section of your
          dashboard.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
