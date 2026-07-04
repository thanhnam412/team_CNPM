"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import {
  Settings2,
  User,
  Shield,
  Bell,
  Briefcase,
  Save,
  CheckCircle2,
  Smartphone,
  Key,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "profiles", label: "Role Profiles", icon: Briefcase },
  { id: "security", label: "Security & Login", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const [activeTab, setActiveTab] = useState("personal");
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    rate: "",
    bio: "",
    location: "",
  });

  // Fetch real profile data
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => userService.getUser(userId as string),
    enabled: !!userId,
  });

  // Sync fetched data to local state
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || session?.user?.name || "",
        title: userProfile.title || "",
        rate: userProfile.rate || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
      });
    }
  }, [userProfile, session]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => userService.updateProfile(userId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="bg-card border-b-2 border-border p-6 md:p-8 shrink-0 relative z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
              <Settings2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />{" "}
              Settings
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
              Manage your global account preferences and role profiles.
            </p>
          </div>

          <NeoButton
            onClick={handleSave}
            disabled={updateMutation.isPending || isLoading}
            className={cn(
              "rounded-none border-2 h-12 px-8 uppercase font-black tracking-widest text-sm transition-all",
              showSuccess
                ? "bg-green-500 border-green-700 text-white shadow-[4px_4px_0px_0px_#15803d]"
                : "bg-primary border-foreground text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--foreground)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_var(--foreground)]",
            )}
          >
            {updateMutation.isPending ? (
              "Saving..."
            ) : showSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </NeoButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full overflow-hidden">
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-64 shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-border bg-card overflow-y-auto">
          <div className="p-4 space-y-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-left transition-colors border-2",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary/20 hover:text-foreground",
                  )}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-background">
          <div className="max-w-2xl space-y-8 pb-20">
            {/* PERSONAL INFO TAB */}
            {activeTab === "personal" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section>
                  <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
                    Avatar
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 border-4 border-foreground bg-primary flex items-center justify-center font-heading font-black text-4xl text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] overflow-hidden">
                      {session?.user?.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        formData.name.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <NeoButton
                        variant="outline"
                        className="rounded-none border-2 border-foreground h-10 font-bold uppercase tracking-widest text-xs"
                      >
                        Upload New
                      </NeoButton>
                      <NeoButton
                        variant="ghost"
                        className="rounded-none h-10 font-bold uppercase tracking-widest text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        Remove
                      </NeoButton>
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
                    Basic Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                        Display Name
                      </label>
                      <NeoInput
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g. Alex Code"
                        className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Email Address
                    </label>
                    <NeoInput
                      value={session?.user?.email || ""}
                      readOnly
                      disabled
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-secondary/30 font-bold h-12"
                    />
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Timezone
                    </label>
                    <NeoInput
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g. Remote, UTC+07:00"
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
                    />
                  </div>
                </section>
              </div>
            )}

            {/* ROLE PROFILES TAB */}
            {activeTab === "profiles" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-secondary/10 border-2 border-border p-4 mb-8">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                    Your account operates in dual-role mode. Configure how you
                    appear to others when acting as a Client versus an Expert.
                  </p>
                </div>

                <section className="space-y-5">
                  <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6 text-primary">
                    Expert Profile
                  </h2>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Professional Title
                    </label>
                    <NeoInput
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g. Senior AI / Python Engineer"
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
                    />
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Hourly Rate ($)
                    </label>
                    <NeoInput
                      value={formData.rate}
                      onChange={(e) => handleInputChange("rate", e.target.value)}
                      placeholder="45"
                      type="number"
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-heading font-black text-xl h-12 w-32"
                    />
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Bio / About Me
                    </label>
                    <NeoTextarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="I am a Senior AI Engineer specializing in..."
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-semibold text-sm min-h-[120px]"
                    />
                  </div>
                </section>

                <section className="space-y-5 mt-12 pt-8 border-t-4 border-foreground border-dashed">
                  <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
                    Client Profile
                  </h2>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Company Name (Optional)
                    </label>
                    <NeoInput
                      placeholder="e.g. Acme Corp"
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
                    />
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Billing Address
                    </label>
                    <NeoTextarea
                      placeholder="Enter your business address for invoices"
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-semibold text-sm min-h-[80px]"
                    />
                  </div>
                </section>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-5">
                  <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
                    Password
                  </h2>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Current Password
                    </label>
                    <NeoInput
                      type="password"
                      placeholder="••••••••"
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
                    />
                  </div>
                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      New Password
                    </label>
                    <NeoInput
                      type="password"
                      placeholder="••••••••"
                      className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
                    />
                  </div>
                  <NeoButton
                    variant="outline"
                    className="rounded-none border-2 border-foreground h-10 font-bold uppercase tracking-widest text-xs"
                  >
                    Update Password
                  </NeoButton>
                </section>

                <section className="space-y-5 mt-12">
                  <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Two-Factor
                    Authentication
                  </h2>
                  <div className="bg-card border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_var(--foreground)] flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm uppercase">
                        Authenticator App
                      </h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1">
                        Protect your account with an extra layer of security.
                      </p>
                    </div>
                    <NeoButton className="rounded-none border-2 border-foreground bg-primary text-primary-foreground h-10 font-black uppercase tracking-widest text-xs shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-0.5">
                      Enable 2FA
                    </NeoButton>
                  </div>
                </section>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section className="space-y-6">
                  <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
                    Email Preferences
                  </h2>

                  {[
                    {
                      title: "New Messages",
                      desc: "Get notified when someone sends you a direct message.",
                    },
                    {
                      title: "Task Updates",
                      desc: "Status changes on projects or quick tasks.",
                    },
                    {
                      title: "Financial Alerts",
                      desc: "Payouts cleared, deposits, and escrow updates.",
                    },
                    {
                      title: "Marketing & Promos",
                      desc: "Occasional updates on new platform features.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4 p-4 border-2 border-border hover:border-foreground transition-colors cursor-pointer group"
                    >
                      <div>
                        <h3 className="font-bold text-sm uppercase group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-muted-foreground mt-1">
                          {item.desc}
                        </p>
                      </div>
                      {/* Brutalist Toggle Button */}
                      <div className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-none border-2 border-foreground bg-secondary transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                        {/* Fake active state for mockup */}
                        {i !== 3 && (
                          <div className="absolute inset-0 bg-primary/20" />
                        )}
                        <span
                          className={cn(
                            "pointer-events-none block h-6 w-6 rounded-none border-2 border-foreground bg-primary shadow-[2px_2px_0px_0px_var(--foreground)] transition-transform",
                            i !== 3
                              ? "translate-x-3"
                              : "-translate-x-3 bg-card",
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
