"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Palette } from "lucide-react";
import PathProvider from "@/components/customsUi/PathProvider";
import { settingsTabs as sidebarTabs, workspaceInfo } from "@/data/notifications";

export default function SettingsPages() {
  const [activeTab, setActiveTab] = useState(sidebarTabs[0].id);
  const [workspaceName, setWorkspaceName] = useState(workspaceInfo.name);
  const [workspaceDesc, setWorkspaceDesc] = useState(
    workspaceInfo.description,
  );

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 font-sans text-foreground">
      <PathProvider />

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mt-2">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {sidebarTabs.map((tab) =>
              tab.id === "appearance" ? (
                <Link
                  key={tab.id}
                  href="/dashboard/settings/appearance"
                  className="text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Palette className="w-4 h-4 shrink-0" />
                  {tab.label}
                </Link>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ),
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-3xl">
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
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-xs">
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
                    <button className="px-3 py-1.5 bg-muted hover:bg-muted text-foreground text-xs font-medium rounded-lg transition-colors cursor-pointer">
                      Upload Image
                    </button>
                    <button className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors cursor-pointer">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Workspace Name Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
                />
              </div>

              {/* Workspace Description Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">
                  Workspace Description
                </label>
                <textarea
                  rows={3}
                  value={workspaceDesc}
                  onChange={(e) => setWorkspaceDesc(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all resize-none"
                />
                <p className="text-[11px] text-muted-foreground font-mono">
                  Brief description for your team members.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex justify-end">
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-xs">
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
