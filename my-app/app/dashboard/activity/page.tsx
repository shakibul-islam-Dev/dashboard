"use client";

import React, { useState } from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import { Calendar, ChevronDown } from "lucide-react";
import {
  activityData,
  activityTabs,
} from "@/data/activity";

export default function ActivityPages() {
  const [activeTab, setActiveTab] = useState("All Activity");

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 font-sans text-foreground">
      <PathProvider />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track recent changes across your workspace.
        </p>
      </div>

      {/* Navigation Tabs and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border mb-8 gap-4">
        <nav className="flex space-x-6 overflow-x-auto">
          {activityTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap relative ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="pb-3 self-end sm:self-auto">
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors font-medium shadow-xs">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Date Range</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Activity Timeline */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-xs max-w-5xl">
        <div className="relative">
          {/* Vertical Timeline Bar */}
          <div className="absolute top-3 left-4.75 bottom-6 w-[1.5px] bg-muted" />

          <div className="space-y-8 relative">
            {activityData.map((group) => (
              <div key={group.section} className="space-y-6">
                <div className="pl-12">
                  <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                    {group.section}
                  </span>
                </div>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-4 items-start"
                    >
                      {/* Avatar Circle & Badge */}
                      <div className="relative z-10 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-muted border border-border text-foreground font-semibold text-xs flex items-center justify-center ring-4 ring-white">
                          {item.user.initials}
                        </div>

                        <div
                          className={`absolute -bottom-0.5 -right-0.5 ${item.iconBg} text-white p-0.5 rounded-full ring-2 ring-white flex items-center justify-center`}
                        >
                          <Icon className="w-2.5 h-2.5 stroke-3" />
                        </div>
                      </div>

                      {/* Item Content */}
                      <div className="pt-1 flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug">
                          <span className="font-semibold text-foreground">
                            {item.user.name}
                          </span>{" "}
                          <span className="text-foreground">{item.action}</span>{" "}
                          {item.target && (
                            <span className="font-semibold text-primary">
                              {item.target}
                            </span>
                          )}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{item.time}</span>
                          {item.project && (
                            <>
                              <span>•</span>
                              <span className="bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded text-[11px]">
                                {item.project}
                              </span>
                            </>
                          )}
                        </div>

                        {item.comment && (
                          <div className="mt-3 p-3.5 bg-muted border border-border rounded-lg text-xs text-muted-foreground leading-relaxed max-w-xl">
                            {item.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
