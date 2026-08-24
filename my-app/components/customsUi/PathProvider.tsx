"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function PathProvider() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm min-w-0">
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        const formattedName = decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase());

        return (
          <div key={path} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}

            <Link
              href={path}
              className={`${
                isLast
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground font-medium"
              } hover:text-primary transition-colors`}
            >
              {formattedName}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
