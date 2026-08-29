"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette } from "lucide-react";
import { motion } from "motion/react";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";
import { settingsTabs } from "@/data/notifications";
import { cn } from "@/lib/utils";
import { fadeUpStagger, fadeUp } from "@/lib/motion";

/* ── Tabs that have a dedicated page (linked out instead of inline content) ── */
const linkedTabs: Record<string, string> = {
  appearance: "/dashboard/settings/appearance",
  notifications: "/dashboard/settings/notifications",
  preferences: "/dashboard/settings/preferences",
};

function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/dashboard/settings/appearance")) return "appearance";
  if (pathname.startsWith("/dashboard/settings/notifications")) return "notifications";
  if (pathname.startsWith("/dashboard/settings/preferences")) return "preferences";
  return "general";
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const activeTab = getActiveTab(pathname);

  return (
    <PageContainer>
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUpStagger}
        className="bg-transparent font-sans text-foreground"
      >
        <PageNav />

        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mt-2">
        {/* ── Left Sidebar Navigation ── */}
        <aside className="w-full md:w-56 shrink-0">
          <motion.nav variants={fadeUpStagger} className="flex md:flex-col gap-1 overflow-x-auto">
            {settingsTabs.map((tab) => {
              const href = linkedTabs[tab.id] ?? "/dashboard/settings";
              const isActive = activeTab === tab.id;
              return (
                <motion.div key={tab.id} variants={fadeUp}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {tab.id === "appearance" && (
                      <Palette className="w-4 h-4 shrink-0" />
                    )}
                    {tab.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        </aside>

        {/* ── Main Content Area ── */}
        <motion.main
          key={pathname}
          variants={fadeUp}
          className="flex-1 max-w-3xl"
        >
          {children}
        </motion.main>
      </div>
    </motion.div>
    </PageContainer>
  );
}