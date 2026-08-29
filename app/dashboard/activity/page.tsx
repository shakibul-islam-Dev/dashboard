"use client";

import React, { useState, useMemo } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { activityData, activityTabs } from "@/data/activity";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { fadeUpStagger, fadeUp, dropDown, popIn } from "@/lib/motion";
import { filterActivityGroups } from "@/lib/activityFilters";

type DateRange = "7d" | "30d" | "90d";

const dateRangeLabels: Record<DateRange, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
};

export default function ActivityPages() {
  const [activeTab, setActiveTab] = useState("All Activity");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // ── Tab filtering ──
  const filteredActivity = useMemo(
    () => filterActivityGroups(activityData, activeTab),
    [activeTab],
  );

  return (
    <PageContainer>
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUpStagger}
        className="bg-transparent font-sans text-foreground"
      >
        <PageNav />

        {/* Header */}
      <motion.div variants={dropDown} className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track recent changes across your workspace.
        </p>
      </motion.div>

      {/* Navigation Tabs and Filter */}
      <motion.div
        variants={dropDown}
        className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border mb-8 gap-4"
      >
        {/* shadcn Tabs component replacing raw <button> tab navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line" className="overflow-x-auto">
            {activityTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="whitespace-nowrap">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Date range dropdown */}
        <div className="pb-3 self-end sm:self-auto relative">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
          >
            <Calendar className="w-4 h-4" />
            <span>{dateRangeLabels[dateRange]}</span>
            <motion.span
              animate={{ rotate: showDateDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
          </Button>
          <AnimatePresence>
            {showDateDropdown && (
              <motion.div
                variants={popIn}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-md py-1 min-w-[160px] origin-top-right"
              >
                {(["7d", "30d", "90d"] as DateRange[]).map((option) => (
                  <button
                    key={option}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                      dateRange === option ? "text-primary font-medium" : "text-foreground"
                    }`}
                    onClick={() => {
                      setDateRange(option);
                      setShowDateDropdown(false);
                    }}
                  >
                    {dateRangeLabels[option]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Activity Timeline - shadcn Card replacing raw <div> */}
      <motion.div variants={fadeUp}>
        <Card className="max-w-5xl shadow-xs">
          <CardContent className="p-6 md:p-8">
            <div className="relative">
              {/* Vertical Timeline Bar */}
              <div className="absolute top-3 left-4.75 bottom-6 w-[1.5px] bg-muted" />

              <motion.div variants={fadeUpStagger} className="space-y-8 relative">
                {filteredActivity.map((group) => (
                  <motion.div key={group.section} variants={fadeUp} className="space-y-6">
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
                          {/* shadcn Avatar replacing raw initials <div> */}
                          <div className="relative z-10 shrink-0">
                            <Avatar size="lg" className="ring-4 ring-white">
                              <AvatarFallback>{item.user.initials}</AvatarFallback>
                            </Avatar>

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
                                  <Badge variant="outline" className="text-[11px]">
                                    {item.project}
                                  </Badge>
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
                  </motion.div>
                ))}
                {filteredActivity.length === 0 && (
                  <motion.div variants={fadeUp} className="pl-12 text-sm text-muted-foreground">
                    No activity found for this filter.
                  </motion.div>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
    </PageContainer>
  );
}
