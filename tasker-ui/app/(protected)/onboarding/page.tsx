"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { Briefcase, User, X, Rocket, CheckCircle2 } from "lucide-react";
import { cn, parseDecimalInput } from "@/lib/utils";

type Role = "expert" | "client" | null;

export default function OnboardingPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("expert"); // Defaulting to expert for now since role selection is removed

  const [title, setTitle] = useState("");
  const [rate, setRate] = useState("");
  const [location, setLocation] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setIsSubmitting(true);

    // TODO: Connect this to actual API endpoint PATCH /api/users/profile
    const payload = {
      role: role.toUpperCase(),
      ...(role === "expert" && {
        title,
        rate: parseFloat(rate),
        skills,
        location,
      }),
    };

    console.log("Submitting payload:", payload);

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect based on role
    if (role === "expert") {
      router.push("/expert/workspace");
    } else {
      router.push("/client/projects");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-heading font-black text-4xl uppercase tracking-wider mb-2">
            Welcome to Tasker!
          </h1>
          <p className="text-muted-foreground font-semibold">
            Let's get your profile set up so you can get started.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Profile Details */}
          <NeoCard className="p-8 mb-8 border-4 shadow-[8px_8px_0px_0px_var(--foreground)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-heading font-black text-xl uppercase mb-6 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-primary" />
              Profile Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">
                  Professional Title *
                </label>
                <NeoInput
                  placeholder="e.g. Senior Data Scientist"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">
                    Hourly Rate ($) *
                  </label>
                  <NeoInput
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={parseDecimalInput(rate)}
                    onChange={(e) => setRate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2">
                    Location
                  </label>
                  <NeoInput
                    placeholder="e.g. Vietnam (UTC+7)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2">
                  Skills * (Press Enter to add)
                </label>
                <div className="border-4 border-foreground p-3 bg-background flex flex-col gap-3 min-h-[100px] focus-within:ring-2 ring-primary transition-shadow">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <NeoBadge
                        key={skill}
                        variant="secondary"
                        className="pl-3 pr-1 py-1 flex items-center gap-1 group"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:bg-foreground/20 p-0.5 rounded-none transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </NeoBadge>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-sm font-semibold placeholder:text-muted-foreground/50 min-w-[200px]"
                    placeholder={
                      skills.length === 0
                        ? "Type a skill and press Enter..."
                        : "Add more skills..."
                    }
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    onKeyPress={(e) => {
                      // Prevent form submission on enter
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </NeoCard>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <NeoButton
              type="submit"
              className="h-14 px-8 text-lg w-full md:w-auto"
              disabled={!title || !rate || skills.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Saving Profile..." : "Complete Setup"}
            </NeoButton>
          </div>
        </form>
      </div>
    </div>
  );
}
