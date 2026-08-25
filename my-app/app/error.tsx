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

        <h2 className="mt-2 text-2xl font-bold text-foreground">
          Unable to load this page
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
          Something unexpected happened while loading this section of your
          dashboard.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover dark:bg-card dark:hover:bg-muted"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
