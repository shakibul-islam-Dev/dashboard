"use client";

import React, { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";

const sidebarTabs = [
  { id: "general", label: "General" },
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "preferences", label: "Preferences" },
];

export default function SettingsPages() {
  const [activeTab, setActiveTab] = useState("general");
  const [workspaceName, setWorkspaceName] = useState("Acme Development");
  const [workspaceDesc, setWorkspaceDesc] = useState(
    "Enterprise project management and collaborative development workspace.",
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-800">
      <PathProvider />

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mt-2">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-50/80 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              General Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your workspace details and basic configuration.
            </p>
          </div>

          {/* Workspace Details Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 md:p-8 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 pb-4 border-b border-slate-100">
              Workspace Details
            </h2>

            <div className="space-y-6 pt-6">
              {/* Workspace Logo Upload */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 text-blue-600 font-bold text-2xl flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Workspace Logo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload a square image. Recommended size 256×256px.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors">
                      Upload Image
                    </button>
                    <button className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Workspace Name Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Workspace Description Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  Workspace Description
                </label>
                <textarea
                  rows={3}
                  value={workspaceDesc}
                  onChange={(e) => setWorkspaceDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  Brief description for your team members.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-xs">
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
