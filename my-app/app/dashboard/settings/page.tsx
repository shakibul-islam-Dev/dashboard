"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Palette } from "lucide-react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  settingsTabs as sidebarTabs,
  workspaceInfo,
} from "@/data/notifications";
import { toast } from "sonner";

/* shadcn UI components */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

/* ── localStorage keys ── */
const LS_WORKSPACE_NAME = "settings_workspaceName";
const LS_WORKSPACE_DESC = "settings_workspaceDesc";

/* ── Placeholder for tabs without a dedicated page ── */
function ComingSoon({ tab }: { tab: string }) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <p className="text-muted-foreground text-sm">
        {tab} settings coming soon.
      </p>
    </div>
  );
}

export default function SettingsPages() {
  const [activeTab, setActiveTab] = useState(sidebarTabs[0].id);
  const [workspaceName, setWorkspaceName] = useState(workspaceInfo.name);
  const [workspaceDesc, setWorkspaceDesc] = useState(workspaceInfo.description);

  /* ── Load saved values from localStorage on mount ── */
  useEffect(() => {
    try {
      const savedName = localStorage.getItem(LS_WORKSPACE_NAME);
      const savedDesc = localStorage.getItem(LS_WORKSPACE_DESC);
      if (savedName !== null) setWorkspaceName(savedName);
      if (savedDesc !== null) setWorkspaceDesc(savedDesc);
    } catch {
      /* localStorage unavailable – ignore */
    }
  }, []);

  /* ── Save to localStorage and show toast confirmation ── */
  const handleSave = () => {
    try {
      localStorage.setItem(LS_WORKSPACE_NAME, workspaceName);
      localStorage.setItem(LS_WORKSPACE_DESC, workspaceDesc);
    } catch {
      /* localStorage unavailable – ignore */
    }
    toast.success("Settings saved", {
      description: "Your workspace details have been updated.",
    });
  };

  /* ── Render tab-specific content ── */
  function renderTabContent() {
    switch (activeTab) {
      case "general":
        return (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                General Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your workspace details and basic configuration.
              </p>
            </div>

            {/* Workspace Details Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-base font-semibold text-foreground pb-4 border-b border-border">
                  Workspace Details
                </h2>

                <div className="space-y-6 pt-6">
                  {/* Workspace Logo Upload */}
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-lg bg-muted border border-border text-primary font-bold text-2xl flex items-center justify-center shrink-0">
                      A
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        Workspace Logo
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Upload a square image. Recommended size 256×256px.
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <Button variant="secondary" size="sm">
                          Upload Image
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-500 hover:text-rose-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Workspace Name Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-foreground">
                      Workspace Name
                    </label>
                    <Input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                    />
                  </div>

                  {/* Workspace Description */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-foreground">
                      Workspace Description
                    </label>
                    <Textarea
                      rows={3}
                      value={workspaceDesc}
                      onChange={(e) => setWorkspaceDesc(e.target.value)}
                      className="resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Brief description for your team members.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Footer */}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="px-5 py-2.5">
                Save Changes
              </Button>
            </div>
          </>
        );

      case "notifications":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                Notifications
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure how you receive alerts and updates.
              </p>
            </div>
            <ComingSoon tab="Notifications" />
          </>
        );

      case "preferences":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                Preferences
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Customize your experience and workspace behavior.
              </p>
            </div>
            <ComingSoon tab="Preferences" />
          </>
        );

      default:
        return <ComingSoon tab={activeTab} />;
    }
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 font-sans text-foreground">
      <PathProvider />

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mt-2">
        {/* ── Left Sidebar Navigation ── */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {sidebarTabs.map((tab) =>
              tab.id === "appearance" ? (
                /* Appearance tab uses a Next.js Link instead of a button */
                <Link
                  key={tab.id}
                  href="/dashboard/settings/appearance"
                  className="text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Palette className="w-4 h-4 shrink-0" />
                  {tab.label}
                </Link>
              ) : (
                /* Sidebar nav tab */
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`justify-start text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </Button>
              ),
            )}
          </nav>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 max-w-3xl">{renderTabContent()}</main>
      </div>
    </div>
  );
}
