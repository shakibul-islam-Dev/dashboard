"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 9v3.75m0 3.75h.008M10.29 3.86l-8.1 14a2 2 0 001.73 3h16.16a2 2 0 001.73-3l-8.1-14a2 2 0 00-3.46 0z"
                />
              </svg>
            </div>

            <p className="mb-2 text-sm font-medium text-red-400">
              SYSTEM ERROR
            </p>

            <h1 className="text-3xl font-bold tracking-tight">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              An unexpected system error occurred. Please try again or return to
              your dashboard.
            </p>

            <button
              onClick={() => reset()}
              className="mt-8 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
