"use client";
import React, { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Globe,
  Shield,
  Eye,
  Database,
  Save,
} from "lucide-react";
import { useTheme } from "@/components/customsUi/ThemeProvider";
import { toast } from "sonner";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

/* ── localStorage key ── */
const LS_KEY = "settings_preferences";

const defaultPreferences = {
  theme: "system",
  language: "en",
  timezone: "UTC+6",
  compactView: false,
  autoSave: true,
  dataUsage: "balanced",
  analyticsConsent: true,
};

export default function Preferences() {
  const { setTheme } = useTheme();
  const [preferences, setPreferences] = useState(defaultPreferences);

  /* ── Load saved preferences from localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPreferences((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  const handleChange = (key: keyof typeof preferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  /* ── Save to localStorage and show toast confirmation ── */
  const handleSave = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(preferences));
    } catch {
      /* ignore */
    }
    toast.success("Preferences saved", {
      description: "Your preferences have been updated.",
    });
  };

  /* ── Theme tile click → update local state + provider ── */
  const handleThemeChange = (id: string) => {
    handleChange("theme", id);
    setTheme(id as any);
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 space-y-8 text-foreground">
      <CardContent>
        {/* Header with save button */}
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              App Preferences
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your experience, appearance, and workspace behavior.
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>

        {/* Appearance: theme selector tiles */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Sun className="w-5 h-5 text-muted-foreground" />
            <h2>Appearance</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 pl-7">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Eye },
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={
                  preferences.theme === id ? "default" : "outline"
                }
                onClick={() => handleThemeChange(id)}
                className="flex flex-col items-center justify-center p-4 h-auto text-sm font-medium"
              >
                <Icon className="w-5 h-5 mb-2 text-muted-foreground" />
                {label}
              </Button>
            ))}
          </div>
        </section>

        <hr className="border-border" />

        {/* Language & Localization */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <h2>Localization</h2>
          </div>
          <div className="space-y-3 pl-7">
            {/* Language select */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-muted-foreground">
                  Select interface language.
                </p>
              </div>
              <Select
                value={preferences.language}
                onValueChange={(v) => v && handleChange("language", v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone select */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-xs text-muted-foreground">
                  Adjust date and timestamps display.
                </p>
              </div>
              <Select
                value={preferences.timezone}
                onValueChange={(v) => v && handleChange("timezone", v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC+6">
                    Asia/Dhaka (GMT+6)
                  </SelectItem>
                  <SelectItem value="UTC+0">London (GMT+0)</SelectItem>
                  <SelectItem value="UTC-5">
                    New York (EST)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Workspace Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Database className="w-5 h-5 text-muted-foreground" />
            <h2>Workspace & Data</h2>
          </div>
          <div className="space-y-3 pl-7">
            {/* Compact view checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Compact Interface</p>
                <p className="text-xs text-muted-foreground">
                  Reduce spacing and padding across UI components.
                </p>
              </div>
              <Checkbox
                checked={preferences.compactView}
                onCheckedChange={(checked) =>
                  handleChange("compactView", checked)
                }
              />
            </div>

            {/* Auto-save checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Auto-Save Drafts</p>
                <p className="text-xs text-muted-foreground">
                  Save changes automatically while working.
                </p>
              </div>
              <Checkbox
                checked={preferences.autoSave}
                onCheckedChange={(checked) =>
                  handleChange("autoSave", checked)
                }
              />
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Privacy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <h2>Privacy & Analytics</h2>
          </div>
          <div className="space-y-3 pl-7">
            {/* Analytics consent checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Usage Telemetry</p>
                <p className="text-xs text-muted-foreground">
                  Share anonymous diagnostic data to improve app
                  performance.
                </p>
              </div>
              <Checkbox
                checked={preferences.analyticsConsent}
                onCheckedChange={(checked) =>
                  handleChange("analyticsConsent", checked)
                }
              />
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
