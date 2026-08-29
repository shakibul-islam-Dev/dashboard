"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function RouterNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Detect "first page" (root) to disable back
  const isRoot = pathname === "/" || pathname === "/dashboard";

  // Forward is always disabled by default: there is no reliable way to know
  // if a forward history entry exists without listening to popstate.
  const canGoForward = false;

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
        disabled={!canGoForward}
        title="Go forward"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
