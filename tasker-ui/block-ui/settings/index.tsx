"use client";

import {
  Settings2,
  User,
  Shield,
  Bell,
  Briefcase,
  Save,
  CheckCircle2,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";
import { PersonalTab } from "./components/personal-tab";
import { ProfilesTab } from "./components/profiles-tab";
import { SecurityTab } from "./components/security-tab";
import { NotificationsTab } from "./components/notifications-tab";

const TABS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "profiles", label: "Role Profiles", icon: Briefcase },
  { id: "security", label: "Security & Login", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export interface SettingsBlockProps {
  me: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  showSuccess: boolean;
}

export function SettingsBlock({
  me,
  activeTab,
  onTabChange,
  formData,
  onInputChange,
  onSave,
  isSaving,
  showSuccess,
}: SettingsBlockProps) {
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
            onClick={onSave}
            disabled={isSaving}
            className={cn(
              "rounded-none border-2 h-12 px-8 uppercase font-black tracking-widest text-sm transition-all",
              showSuccess
                ? "bg-green-500 border-green-700 text-white shadow-[4px_4px_0px_0px_#15803d]"
                : "bg-primary border-foreground text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--foreground)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_var(--foreground)]",
            )}
          >
            {isSaving ? (
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
                  onClick={() => onTabChange(tab.id)}
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
            {activeTab === "personal" && (
              <PersonalTab
                me={me}
                formData={formData}
                onInputChange={onInputChange}
              />
            )}
            {activeTab === "profiles" && (
              <ProfilesTab
                formData={formData}
                onInputChange={onInputChange}
              />
            )}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
