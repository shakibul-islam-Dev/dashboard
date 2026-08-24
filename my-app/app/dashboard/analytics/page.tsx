"use client";

import React from "react";
import PathProvider from "@/components/customsUi/PathProvider";
import {
  Calendar,
  ChevronDown,
  CheckCircle,
  PlusSquare,
  Percent,
  AlertTriangle,
} from "lucide-react";
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

// Mock Data for Charts
const lineData = [
  { name: "Week 1", value: 25 },
  { name: "Week 2", value: 38 },
  { name: "Week 3", value: 30 },
  { name: "Week 4", value: 44 },
];

const pieData = [
  { name: "To Do", value: 10, color: "#E2E8F0" },
  { name: "In Progress", value: 15, color: "#3B82F6" },
  { name: "In Review", value: 10, color: "#F59E0B" },
  { name: "Done", value: 65, color: "#10B981" },
];

const barData = [
  { name: "Low", value: 45, fill: "#E2E8F0" },
  { name: "Medium", value: 80, fill: "#3B82F6" },
  { name: "High", value: 25, fill: "#F59E0B" },
  { name: "Critical", value: 12, fill: "#EF4444" },
];

const projectProgressData = [
  { name: "Frontend Redesign", progress: 75, color: "bg-blue-600" },
  { name: "API v2 Migration", progress: 40, color: "bg-blue-500" },
  { name: "Security Audit fixes", progress: 90, color: "bg-emerald-500" },
  { name: "Mobile App Beta", progress: 15, color: "bg-amber-500" },
];

const AnalyticsPages = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans text-slate-800">
      <PathProvider />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track project and task performance.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 shadow-xs font-medium self-start sm:self-auto transition-colors">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Last 30 Days</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-sm font-medium mb-3">
            <span>Tasks Completed</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">124</span>
            <span className="text-xs font-medium text-emerald-600 font-mono">
              ↑ 12% vs last month
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-sm font-medium mb-3">
            <span>Tasks Created</span>
            <PlusSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">142</span>
            <span className="text-xs font-medium text-emerald-600 font-mono">
              ↑ 5% vs last month
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-sm font-medium mb-3">
            <span>Completion Rate</span>
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">87%</span>
            <span className="text-xs font-medium text-emerald-600 font-mono">
              ↑ 2% vs last month
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-sm font-medium mb-3">
            <span>Overdue Rate</span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">4.2%</span>
            <span className="text-xs font-medium text-emerald-600 font-mono">
              ↓ 1% vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2x2 for Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Task Completion Trend */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-semibold text-slate-900 mb-6">
            Task Completion Trend
          </h2>
          <div className="h-64 w-full">
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
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-semibold text-slate-900 mb-2">
            Tasks by Status
          </h2>
          <div className="h-64 w-full flex items-center justify-center relative">
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

            {/* Custom Legend Floating to Right */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
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
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 mb-6">
            Priority Distribution
          </h2>
          <div className="h-64 w-full">
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
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Project Progress
          </h2>
          <div className="space-y-6 my-auto">
            {projectProgressData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800">{item.name}</span>
                  <span className="text-slate-500">{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
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
