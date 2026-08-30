"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Slash } from "lucide-react";
import { routeCrumbs } from "@/lib/routeLabels";

/**
 * Breadcrumb trail for the active route, rendered on every dashboard page.
 * Labels come from the shared route map in lib/routeLabels so they stay in
 * sync with the browser-tab title.
 */
export default function PathProvider() {
  const pathname = usePathname();
  const crumbs = routeCrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm min-w-0"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <div key={crumb.path} className="flex items-center gap-2">
            {index > 0 && (
              <Slash className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            )}

            {isLast ? (
              <span className="text-foreground font-semibold truncate max-w-[220px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className="text-muted-foreground font-medium hover:text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
