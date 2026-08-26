export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-xl border border-border bg-card lg:col-span-2" />

        <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-muted" />

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
