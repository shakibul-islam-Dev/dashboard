"use client";

import { useEffect, useRef, useState } from "react";
import { workspaceInfo } from "@/data/notifications";
import { toast } from "sonner";
import { Camera, ImagePlus, Trash2 } from "lucide-react";

/* shadcn UI components */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* Profile store (localStorage-backed, synced app-wide) */
import {
  useProfile,
  saveProfile,
  validateImageFile,
  initialsFromName,
  fileToSquareDataUrl,
} from "@/lib/profileStore";

/* ── localStorage keys ── */
const LS_WORKSPACE_NAME = "settings_workspaceName";
const LS_WORKSPACE_DESC = "settings_workspaceDesc";
const LS_WORKSPACE_LOGO = "settings_workspaceLogo";

export default function SettingsPages() {
  const [workspaceName, setWorkspaceName] = useState(workspaceInfo.name);
  const [workspaceDesc, setWorkspaceDesc] = useState(workspaceInfo.description);
  const [workspaceLogo, setWorkspaceLogo] = useState("");

  /* ── Profile (avatar/name/title/bio from the shared store) ── */
  const profile = useProfile();
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");

  /* ── Load saved values from localStorage on mount ── */
  useEffect(() => {
    try {
      const savedName = localStorage.getItem(LS_WORKSPACE_NAME);
      const savedDesc = localStorage.getItem(LS_WORKSPACE_DESC);
      const savedLogo = localStorage.getItem(LS_WORKSPACE_LOGO);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- must sync after mount to avoid SSR/hydration mismatch
      if (savedName !== null) setWorkspaceName(savedName);
      if (savedDesc !== null) setWorkspaceDesc(savedDesc);
      if (savedLogo !== null) setWorkspaceLogo(savedLogo);
    } catch {
      /* localStorage unavailable – ignore */
    }
  }, []);

  /* ── Seed the profile form once the store hydrates ── */
  const profileSeeded = useRef(false);
  useEffect(() => {
    if (profileSeeded.current) return;
    profileSeeded.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time seed after mount
    setFullName(profile.fullName);
    setJobTitle(profile.jobTitle);
    setBio(profile.bio);
  }, [profile.fullName, profile.jobTitle, profile.bio]);

  /* ── Hidden file inputs ── */
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  /* ── Avatar upload / remove (applied immediately) ── */
  const handleAvatarFile = async (file: File | undefined) => {
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      toast.error("Upload failed", { description: error });
      return;
    }
    try {
      await fileToSquareDataUrl(file, 256).then((dataUrl) =>
        saveProfile({ avatar: dataUrl }),
      );
      toast.success("Profile photo updated", {
        description: "Your new picture is visible across the app.",
      });
    } catch {
      toast.error("Upload failed", {
        description: "Could not read that image — try a different file.",
      });
    }
  };

  const handleAvatarRemove = () => {
    saveProfile({ avatar: "" });
    toast.success("Profile photo removed");
  };

  /* ── Workspace logo upload / remove (applied immediately) ── */
  const handleLogoFile = async (file: File | undefined) => {
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      toast.error("Upload failed", { description: error });
      return;
    }
    try {
      const dataUrl = await fileToSquareDataUrl(file, 256);
      setWorkspaceLogo(dataUrl);
      try {
        localStorage.setItem(LS_WORKSPACE_LOGO, dataUrl);
      } catch {
        /* ignore quota errors */
      }
      toast.success("Workspace logo updated");
    } catch {
      toast.error("Upload failed", {
        description: "Could not read that image — try a different file.",
      });
    }
  };

  const handleLogoRemove = () => {
    setWorkspaceLogo("");
    try {
      localStorage.removeItem(LS_WORKSPACE_LOGO);
    } catch {
      /* ignore */
    }
    toast.success("Workspace logo removed");
  };

  /* ── Save handlers ── */
  const handleProfileSave = () => {
    saveProfile({ fullName: fullName.trim(), jobTitle: jobTitle.trim(), bio: bio.trim() });
    toast.success("Profile saved", {
      description: "Your details have been updated.",
    });
  };

  const handleWorkspaceSave = () => {
    try {
      localStorage.setItem(LS_WORKSPACE_NAME, workspaceName);
      localStorage.setItem(LS_WORKSPACE_DESC, workspaceDesc);
    } catch {
      /* localStorage unavailable – ignore */
    }
    toast.success("Settings saved", {
      description: "Your workspace details have been updated.",
    });
  };

  const displayName = fullName.trim() || "Your Name";

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          General Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile and workspace details.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-base font-semibold text-foreground pb-4 border-b border-border">
            Profile
          </h2>

          <div className="space-y-6 pt-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                <Avatar className="size-20">
                  {profile.avatar ? (
                    <AvatarImage src={profile.avatar} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="text-xl font-semibold">
                    {initialsFromName(displayName)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  title="Upload profile photo"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Profile Photo
                </h3>
                <p className="text-xs text-muted-foreground">
                  PNG or JPG, square works best. Your picture is cropped and
                  downscaled to 256×256.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleAvatarFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <ImagePlus className="w-3.5 h-3.5" /> Upload Photo
                  </Button>
                  {profile.avatar && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-rose-500 hover:text-rose-600"
                      onClick={handleAvatarRemove}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="profile-name"
                className="block text-xs font-semibold text-foreground"
              >
                Full Name
              </label>
              <Input
                id="profile-name"
                type="text"
                placeholder="e.g. Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label
                htmlFor="profile-title"
                className="block text-xs font-semibold text-foreground"
              >
                Job Title
              </label>
              <Input
                id="profile-title"
                type="text"
                placeholder="e.g. Product Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label
                htmlFor="profile-bio"
                className="block text-xs font-semibold text-foreground"
              >
                Bio
              </label>
              <Textarea
                id="profile-bio"
                rows={3}
                placeholder="A short introduction visible to your team."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleProfileSave} className="px-5 py-2.5">
                Save Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Details Card */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-base font-semibold text-foreground pb-4 border-b border-border">
            Workspace Details
          </h2>

          <div className="space-y-6 pt-6">
            {/* Workspace Logo Upload */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-lg bg-muted border border-border text-primary font-bold text-2xl flex items-center justify-center shrink-0 overflow-hidden">
                {workspaceLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data URL preview, no loader needed
                  <img
                    src={workspaceLogo}
                    alt="Workspace logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (workspaceName.trim()[0] ?? "A").toUpperCase()
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Workspace Logo
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload a square image. Recommended size 256×256px.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleLogoFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <ImagePlus className="w-3.5 h-3.5" /> Upload Image
                  </Button>
                  {workspaceLogo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-rose-500 hover:text-rose-600"
                      onClick={handleLogoRemove}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Workspace Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="workspace-name"
                className="block text-xs font-semibold text-foreground"
              >
                Workspace Name
              </label>
              <Input
                id="workspace-name"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>

            {/* Workspace Description */}
            <div className="space-y-2">
              <label
                htmlFor="workspace-desc"
                className="block text-xs font-semibold text-foreground"
              >
                Workspace Description
              </label>
              <Textarea
                id="workspace-desc"
                rows={3}
                value={workspaceDesc}
                onChange={(e) => setWorkspaceDesc(e.target.value)}
                className="resize-none"
              />
              <p className="text-[11px] text-muted-foreground font-mono">
                Brief description for your team members.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleWorkspaceSave} className="px-5 py-2.5">
          Save Changes
        </Button>
      </div>
    </>
  );
}
