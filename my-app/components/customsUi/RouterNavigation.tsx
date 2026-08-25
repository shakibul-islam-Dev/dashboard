"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";

export default function RouterNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // --- Track forward availability via ref ---
  // On initial load there is no forward history, so forward is always disabled.
  // A real implementation would listen to popstate; this is the safe default.
  const canGoForward = useRef(false);

  // Detect "first page" (root) to disable back
  const isRoot = pathname === "/" || pathname === "/dashboard";

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.back()}
        disabled={isRoot}
        title="Go back"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.forward()}
        disabled={!canGoForward.current}
        title="Go forward"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
