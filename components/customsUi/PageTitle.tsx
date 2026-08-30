"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { APP_NAME, routeDocumentTitle } from "@/lib/routeLabels";

/**
 * Keeps the browser-tab title in sync with the active route. Mount once in a
 * layout (e.g. DashboardLayout) — every navigation updates the document title
 * to match the current page name.
 */
export default function PageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const title =
      pathname === "/" ? APP_NAME : routeDocumentTitle(pathname);
    document.title = title;
  }, [pathname]);

  return null;
}
