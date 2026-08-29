"use client";

import React from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import {
  useTheme,
  type ResolvedTheme,
  type Theme,
} from "@/components/customsUi/ThemeProvider";

// shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const themeOptions: {
  value: Theme;
  label: string;
  description: string;
}[] = [
  {
    value: "light",
    label: "Light",
    description: "Clean bright interface for well-lit spaces.",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Low-glare dark surfaces, easy on the eyes.",
  },
  {
    value: "system",
    label: "System",
    description: "Automatically match your device preference.",
  },
];

// Literal palette hexes are intentional here: each tile depicts how the app
// looks in a given theme, so they must NOT flip with the active theme.
function ThemePreview({ mode }: { mode: "light" | "dark" | "system" }) {
  if (mode === "system") {
    return (
      <div className="flex w-full h-full overflow-hidden rounded-md border border-border">
        <div className="w-1/2 bg-white p-1.5 space-y-1">
          <div className="h-1.5 w-3/4 rounded bg-slate-200" />
          <div className="h-1.5 w-1/2 rounded bg-slate-100" />
          <div className="h-4 w-full rounded-sm bg-slate-100" />
        </div>
        <div className="w-1/2 bg-[#0f0e13] p-1.5 space-y-1">
          <div className="h-1.5 w-3/4 rounded bg-[#373737]" />
          <div className="h-1.5 w-1/2 rounded bg-[#2a2a2a]" />
          <div className="h-4 w-full rounded-sm bg-[#2a2a2a]" />
        </div>
      </div>
    );
  }

  const isDark = mode === "dark";
  return (
    <div
      className={`w-full h-full rounded-md border p-1.5 space-y-1 ${
        isDark ? "bg-[#0f0e13] border-[#373737]" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex gap-1">
        <div
          className={`h-6 w-4 rounded-sm ${isDark ? "bg-[#1d1c1f]" : "bg-slate-100"}`}
        />
        <div className="flex-1 space-y-1">
          <div
            className={`h-1.5 w-3/4 rounded ${isDark ? "bg-[#373737]" : "bg-slate-200"}`}
          />
          <div
            className={`h-1.5 w-1/2 rounded ${isDark ? "bg-[#2a2a2a]" : "bg-slate-100"}`}
          />
        </div>
      </div>
      <div
        className={`h-4 w-full rounded-sm ${isDark ? "bg-[#2563eb]/40" : "bg-[#2563eb]/20"}`}
      />
    </div>
  );
}

export default function AppearanceSettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="mt-2">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Appearance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize how Task Board looks on this device.
          </p>
        </div>

        {/* Theme Selection Card – uses shadcn Card/CardContent */}
        <Card className="shadow-xs">
          <CardContent className="p-6 md:p-8">
            {/* Card header / description */}
            <div className="pb-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">
                Theme
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Select a theme. Changes apply instantly and are saved to your
                browser.
              </p>
            </div>

            {/* Theme tile grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {themeOptions.map((option) => {
                const selected = theme === option.value;
                return (
                  /* Theme tile – uses shadcn Button (variant driven by selected state) */
                  <Button
                    key={option.value}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    size="default"
                    onClick={() => setTheme(option.value)}
                    aria-pressed={selected}
                    className={`relative flex flex-col items-start gap-3 text-left p-4 rounded-xl h-auto ${
                      selected
                        ? "border-blue-500 ring-2 ring-ring/30 bg-primary/10/50 text-foreground"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    {/* Check Indicator */}
                    <span
                      className={`absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full transition-all ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>

                    {/* Preview */}
                    <div className="w-full h-20">
                      <ThemePreview
                        mode={
                          option.value === "system"
                            ? "system"
                            : (option.value as ResolvedTheme)
                        }
                      />
                    </div>

                    {/* Label & Description */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        {option.value === "light" && (
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        {option.value === "dark" && (
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        {option.value === "system" && (
                          <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <h3 className="text-sm font-semibold text-foreground">
                          {option.label}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Current Status */}
            <p className="pt-6 text-xs text-muted-foreground font-mono">
              Current theme: {theme}
              {theme === "system" && ` (resolves to ${resolvedTheme})`}
            </p>
          </CardContent>
        </Card>
      </div>
  );
}
