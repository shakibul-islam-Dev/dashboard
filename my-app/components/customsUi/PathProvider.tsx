"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function PathProvider() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm">
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        const formattedName = decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase());

        return (
          <div key={path} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            )}

            <Link
              href={path}
              className={`${
                isLast
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 font-medium"
              } hover:text-blue-600 transition-colors`}
            >
              {formattedName}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
