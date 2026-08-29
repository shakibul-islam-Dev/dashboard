"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  taskCompletionTrendData as lineData,
  tasksByStatusData as pieData,
  priorityDistributionData as barData,
  projectProgressData,
  analyticsMetrics,
} from "@/data/analytics";
import PageContainer from "@/components/customsUi/PageContainer";
import PageNav from "@/components/customsUi/PageNav";
import { motion, AnimatePresence } from "motion/react";
import { fadeUpStagger, fadeUp, dropDown, popIn, cardHover } from "@/lib/motion";

/* ── shadcn UI components ─────────────────────────────────────── */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type DateRangeOption = "Last 7 Days" | "Last 30 Days" | "Last 90 Days";

const AnalyticsPages = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>("Last 30 Days");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  return (
    <PageContainer>
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUpStagger}
        className="bg-transparent font-sans text-foreground"
      >
        <PageNav />

        {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        variants={dropDown}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track project and task performance.
          </p>
        </div>

        {/* Date range filter — shadcn Button with dropdown */}
        <div className="self-start sm:self-auto relative">
          <Button
            variant="outline"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
          >
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{dateRange}</span>
            <motion.span
              animate={{ rotate: showDateDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
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
                {(["Last 7 Days", "Last 30 Days", "Last 90 Days"] as DateRangeOption[]).map(
                  (option) => (
                    <button
                      key={option}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                        dateRange === option
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                      onClick={() => {
                        setDateRange(option);
                        setShowDateDropdown(false);
                      }}
                    >
                      {option}
                    </button>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Metric Cards ──────────────────────────────────────── */}
      <motion.div
        variants={fadeUpStagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {analyticsMetrics.map((metric) => (
          /* shadcn Card for each metric */
          <motion.div key={metric.label} variants={fadeUp} {...cardHover}>
            <Card className="h-full">
              <CardContent>
                <div className="flex items-center justify-between text-muted-foreground text-sm font-medium mb-3">
                  <span>{metric.label}</span>
                  <metric.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 font-mono">
                    {metric.delta}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Grid 2×2 for Visual Analytics ─────────────────────── */}
      <motion.div variants={fadeUpStagger} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Chart 1: Task Completion Trend (shadcn Card) ──── */}
        <motion.div variants={fadeUp} {...cardHover}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
            </CardHeader>
          <CardContent className="flex flex-col justify-between">
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={lineData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3B82F6"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    domain={[0, 45]}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#blueGradient)"
                    dot={{
                      r: 4,
                      fill: "#3B82F6",
                      strokeWidth: 2,
                      stroke: "#ffffff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* ── Chart 2: Tasks by Status (shadcn Card) ────────── */}
        <motion.div variants={fadeUp} {...cardHover}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Tasks by Status</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="w-full">
              {/* Chart Area */}
              <div className="h-56 sm:h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend — floating right (sm+) */}
                <div className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-2.5 text-xs text-muted-foreground font-medium">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend — below chart (mobile only) */}
              <div className="mt-3 flex sm:hidden flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-medium">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* ── Chart 3: Priority Distribution (shadcn Card) ──── */}
        <motion.div variants={fadeUp} {...cardHover}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#94A3B8" }}
                    domain={[0, 80]}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={55}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* ── Chart 4: Project Progress (shadcn Card + Progress) ── */}
        <motion.div variants={fadeUp} {...cardHover}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
          <CardContent className="flex flex-col justify-between my-auto">
            <div className="space-y-6">
              {projectProgressData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">
                      {item.progress}%
                    </span>
                  </div>
                  {/* shadcn Progress bar replacing raw div */}
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
    </PageContainer>
  );
};

export default AnalyticsPages;
