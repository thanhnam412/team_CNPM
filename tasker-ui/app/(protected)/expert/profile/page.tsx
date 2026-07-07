"use client";

import { useState, useEffect } from "react";
import {
  useMyExpertProfile,
  useUpsertMyExpertProfile,
} from "@/tanstack/useExperts";
import { UserCircle2, Save, CheckCircle2, Briefcase } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { cn, formatCurrency, parseDecimalInput } from "@/lib/utils";

export default function ExpertProfilePage() {
  const { data: myProfile, isLoading: isLoadingProfile } = useMyExpertProfile();
  const updateProfileMutation = useUpsertMyExpertProfile();

  const [showSuccess, setShowSuccess] = useState(false);

  const [profileFormData, setProfileFormData] = useState({
    title: "",
    hourlyRate: "",
    bio: "",
    skills: [] as string[],
    portfolioUrl: "",
  });

  useEffect(() => {
    if (myProfile) {
      setProfileFormData({
        title: myProfile.title || "",
        hourlyRate: myProfile.hourlyRate?.toString() || "",
        bio: myProfile.bio || "",
        skills: Array.isArray(myProfile.skills)
          ? myProfile.skills
          : myProfile.skills
            ? JSON.parse(myProfile.skills as string)
            : [],
        portfolioUrl: myProfile.portfolioUrl || "",
      });
    }
  }, [myProfile]);

  const handleInputChange = (field: string, value: any) => {
    setProfileFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        title: profileFormData.title,
        hourlyRate: profileFormData.hourlyRate,
        bio: profileFormData.bio,
        skills: JSON.stringify(profileFormData.skills),
        portfolioUrl: profileFormData.portfolioUrl,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
      },
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <h2 className="font-heading font-black text-2xl uppercase animate-pulse">
          Loading Profile...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="bg-card border-b-2 border-border p-6 md:p-8 shrink-0 relative z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
              <UserCircle2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />{" "}
              My Profile
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
              Showcase your expertise and get discovered by clients.
            </p>
          </div>

          <NeoButton
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className={cn(
              "rounded-none border-2 h-12 px-8 uppercase font-black tracking-widest text-sm transition-all shrink-0",
              showSuccess
                ? "bg-green-500 border-green-700 text-white shadow-[4px_4px_0px_0px_#15803d]"
                : "bg-primary border-foreground text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--foreground)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_var(--foreground)]",
            )}
          >
            {updateProfileMutation.isPending ? (
              "Saving..."
            ) : showSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Profile
              </>
            )}
          </NeoButton>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8 space-y-12 pb-24">
        {/* BASIC DETAILS */}
        <section className="space-y-6">
          <h2 className="font-heading font-black text-2xl uppercase tracking-widest border-b-4 border-foreground pb-2 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-primary" /> Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                Professional Title
              </label>
              <NeoInput
                value={profileFormData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Senior Fullstack Developer"
                className="rounded-none border-4 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] focus-visible:border-primary focus-visible:shadow-[4px_4px_0px_0px_var(--primary)] font-heading font-black text-lg h-14"
              />
            </div>

            <div>
              <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                Hourly Rate ($)
              </label>
              <NeoInput
                value={parseDecimalInput(profileFormData.hourlyRate)}
                onChange={(e) =>
                  handleInputChange(
                    "hourlyRate",
                    parseDecimalInput(e.target.value),
                  )
                }
                placeholder="e.g. 45"
                type="number"
                className="rounded-none border-4 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] focus-visible:border-primary focus-visible:shadow-[4px_4px_0px_0px_var(--primary)] font-heading font-black text-2xl h-14"
              />
            </div>
          </div>

          <div>
            <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
              Bio / About Me
            </label>
            <NeoTextarea
              value={profileFormData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell clients about your background, experience, and what makes you unique..."
              className="rounded-none border-4 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] focus-visible:border-primary focus-visible:shadow-[4px_4px_0px_0px_var(--primary)] font-semibold text-base p-4 min-h-[160px]"
            />
          </div>

          <div>
            <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
              Skills (Comma Separated)
            </label>
            <NeoInput
              value={profileFormData.skills.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "skills",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
              placeholder="React, Next.js, Python, AI"
              className="rounded-none border-4 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] focus-visible:border-primary focus-visible:shadow-[4px_4px_0px_0px_var(--primary)] font-bold h-14"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {profileFormData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-primary/10 border-2 border-primary text-primary px-3 py-1 text-xs font-black uppercase tracking-widest"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SHOWCASE / PORTFOLIO */}
        <section className="space-y-6 pt-6 border-t-2 border-border">
          <div className="flex items-center justify-between border-b-2 border-border pb-2 mb-6">
            <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> Portfolio &
              External Links
            </h2>
          </div>

          <div className="p-4 border-2 border-border bg-card">
            <NeoInput
              value={profileFormData.portfolioUrl}
              onChange={(e) =>
                handleInputChange("portfolioUrl", e.target.value)
              }
              placeholder="https://github.com/alexcode, https://dribbble.com/alexdesign..."
              className="w-full"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
