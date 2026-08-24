"use client";

import React from "react";
import PathProvider from "@/components/customsUi/PathProvider";
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

const AnalyticsPages = () => {
  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-8 font-sans text-foreground">
      <PathProvider />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track project and task performance.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground hover:bg-muted shadow-xs font-medium self-start sm:self-auto transition-colors">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>Last 30 Days</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {analyticsMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-card border border-border rounded-xl p-5 shadow-xs"
          >
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
          </div>
        ))}
      </div>

      {/* Grid 2x2 for Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Task Completion Trend */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-semibold text-foreground mb-6">
            Task Completion Trend
          </h2>
          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lineData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
        </div>

        {/* Chart 2: Tasks by Status */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-semibold text-foreground mb-2">
            Tasks by Status
          </h2>
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

              {/* Custom Legend Floating to Right (sm and up) */}
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

            {/* Legend Below Chart (mobile only) */}
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
        </div>

        {/* Chart 3: Priority Distribution */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs">
          <h2 className="text-base font-semibold text-foreground mb-6">
            Priority Distribution
          </h2>
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
        </div>

        {/* Chart 4: Project Progress */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Project Progress
          </h2>
          <div className="space-y-6 my-auto">
            {projectProgressData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">{item.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPages;
