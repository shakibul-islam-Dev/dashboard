"use client";
import { useEffect, useState } from "react";
import { Mail, Smartphone, Monitor, Save, Volume2 } from "lucide-react";
import { toast } from "sonner";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── localStorage key ── */
const LS_KEY = "settings_notifications";

const defaultSettings = {
  email: {
    accountActivity: true,
    newFeatures: false,
    marketing: false,
    digest: "weekly",
  },
  push: {
    mentions: true,
    directMessages: true,
    comments: true,
    soundEnabled: true,
  },
  desktop: {
    enabled: true,
    showPreview: true,
  },
};

export default function Notifications() {
  const [settings, setSettings] = useState(defaultSettings);

  /* ── Load saved notification settings from localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setSettings((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  /* ── Request browser notification permission when enabled ── */
  useEffect(() => {
    if (settings.desktop.enabled && typeof window !== "undefined" && "Notification" in window) {
      try {
        if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      } catch {
        /* browser doesn't support notifications – ignore */
      }
    }
  }, [settings.desktop.enabled]);

  const handleEmailToggle = (key: keyof typeof settings.email) => {
    setSettings((prev) => ({
      ...prev,
      email: { ...prev.email, [key]: !prev.email[key] },
    }));
  };

  const handlePushToggle = (key: keyof typeof settings.push) => {
    setSettings((prev) => ({
      ...prev,
      push: { ...prev.push, [key]: !prev.push[key] },
    }));
  };

  const handleDesktopToggle = (key: keyof typeof settings.desktop) => {
    setSettings((prev) => ({
      ...prev,
      desktop: { ...prev.desktop, [key]: !prev.desktop[key] },
    }));
  };

  /* ── Save to localStorage and show toast confirmation ── */
  const handleSave = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
    toast.success("Notification settings saved", {
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 space-y-8 text-foreground">
      <CardContent className="p-0">
        {/* Header row with title and save button */}
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Notification Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage how and when you receive updates.
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>

        {/* Email Notifications section */}
        <section className="space-y-4 mt-8">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <h2>Email Notifications</h2>
          </div>
          <div className="space-y-3 pl-7">
            {/* Account activity checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Account & Security</p>
                <p className="text-xs text-muted-foreground">
                  Critical updates regarding your account security and activity.
                </p>
              </div>
              <Checkbox
                checked={settings.email.accountActivity}
                onCheckedChange={() => handleEmailToggle("accountActivity")}
              />
            </div>

            {/* Product updates checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Product Updates</p>
                <p className="text-xs text-muted-foreground">
                  News about new features, improvements, and releases.
                </p>
              </div>
              <Checkbox
                checked={settings.email.newFeatures}
                onCheckedChange={() => handleEmailToggle("newFeatures")}
              />
            </div>

            {/* Email digest frequency select */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Email Digest Frequency</p>
                <p className="text-xs text-muted-foreground">
                  How often you receive activity summaries.
                </p>
              </div>
              <Select
                value={settings.email.digest}
                onValueChange={(v) =>
                  v && setSettings((prev) => ({
                    ...prev,
                    email: { ...prev.email, digest: v },
                  }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <hr className="border-border mt-8" />

        {/* Push Notifications section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <h2>Push Notifications</h2>
          </div>
          <div className="space-y-3 pl-7">
            {/* Mentions checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Mentions & Tags</p>
                <p className="text-xs text-muted-foreground">
                  Notify when someone mentions you in a comment or post.
                </p>
              </div>
              <Checkbox
                checked={settings.push.mentions}
                onCheckedChange={() => handlePushToggle("mentions")}
              />
            </div>

            {/* Direct messages checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Direct Messages</p>
                <p className="text-xs text-muted-foreground">
                  Notify when you receive a direct message.
                </p>
              </div>
              <Checkbox
                checked={settings.push.directMessages}
                onCheckedChange={() => handlePushToggle("directMessages")}
              />
            </div>

            {/* Notification sounds checkbox */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Notification Sounds</p>
                  <p className="text-xs text-muted-foreground">
                    Play audio alerts for incoming push notifications.
                  </p>
                </div>
              </div>
              <Checkbox
                checked={settings.push.soundEnabled}
                onCheckedChange={() => handlePushToggle("soundEnabled")}
              />
            </div>
          </div>
        </section>

        <hr className="border-border mt-8" />

        {/* Desktop Notifications section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Monitor className="w-5 h-5 text-muted-foreground" />
            <h2>Desktop Notifications</h2>
          </div>
          <div className="space-y-3 pl-7">
            {/* Desktop enabled checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">
                  Enable Browser Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Show pop-up alerts on your desktop while using the web app.
                </p>
              </div>
              <Checkbox
                checked={settings.desktop.enabled}
                onCheckedChange={() => handleDesktopToggle("enabled")}
              />
            </div>

            {/* Show preview checkbox */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Show Message Previews</p>
                <p className="text-xs text-muted-foreground">
                  Display snippet previews inside desktop alerts.
                </p>
              </div>
              <Checkbox
                disabled={!settings.desktop.enabled}
                checked={settings.desktop.showPreview}
                onCheckedChange={() => handleDesktopToggle("showPreview")}
              />
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
