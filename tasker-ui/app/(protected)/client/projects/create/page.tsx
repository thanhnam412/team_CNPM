"use client";

import { useForm } from "@tanstack/react-form";
import { Sparkles } from "lucide-react";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      categories: "",
      estimatedDuration: "",
      startDate: "",
      endDate: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Submitted project data:", value);
      alert(
        "Project Space Created successfully!\nCheck browser console for JSON payload.",
      );
    },
  });

  return (
    <div className="flex flex-1 flex-col relative w-full h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-12 no-scrollbar">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold tracking-widest uppercase mb-4 text-foreground">
            Create Project Space
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground uppercase font-semibold tracking-wider">
            Define the architecture and scope of your new workspace.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* Project Name (Required) */}
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Project Name is required" : undefined,
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="uppercase font-bold tracking-widest text-xs"
                  >
                    Project Name <span className="text-destructive">*</span>
                  </Label>
                  <NeoInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter project name..."
                    className={cn(
                      "h-12 focus-visible: focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]",
                      field.state.meta.errors.length > 0 &&
                        "border-destructive focus-visible:",
                    )}
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <em className="text-xs text-destructive font-semibold">
                      {field.state.meta.errors.join(",")}
                    </em>
                  ) : null}
                </div>
              )}
            />

            {/* Description (Optional + AI) */}
            <form.Field
              name="description"
              children={(field) => (
                <div className="space-y-2 relative group">
                  <Label
                    htmlFor={field.name}
                    className="uppercase font-bold tracking-widest text-xs flex justify-between items-center"
                  >
                    Description
                    <button
                      type="button"
                      onClick={() =>
                        field.handleChange(
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                        )
                      }
                      className="flex items-center gap-1 text-[0.625rem] text-primary hover:text-primary/80 transition-colors uppercase font-bold"
                    >
                      <Sparkles className="w-3 h-3" />
                      Auto Generate
                    </button>
                  </Label>
                  <NeoTextarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Describe the project scope and goals..."
                    className="min-h-[120px] focus-visible: focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px] resize-none p-3"
                  />
                </div>
              )}
            />

            {/* Categories (Optional + AI) */}
            <form.Field
              name="categories"
              children={(field) => (
                <div className="space-y-2 relative group">
                  <Label
                    htmlFor={field.name}
                    className="uppercase font-bold tracking-widest text-xs flex justify-between items-center"
                  >
                    Categories
                    <button
                      type="button"
                      onClick={() =>
                        field.handleChange("AI, Web App, SaaS, Enterprise")
                      }
                      className="flex items-center gap-1 text-[0.625rem] text-primary hover:text-primary/80 transition-colors uppercase font-bold"
                    >
                      <Sparkles className="w-3 h-3" />
                      Auto Generate Tags
                    </button>
                  </Label>
                  <NeoInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. AI, Web App, Mobile"
                    className="h-12 focus-visible: focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
                  />
                  <p className="text-[0.625rem] text-muted-foreground uppercase font-semibold">
                    Separate multiple tags with commas
                  </p>
                </div>
              )}
            />

            {/* Timeline: Estimated Duration, Start Date, End Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <form.Field
                name="estimatedDuration"
                children={(field) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="uppercase font-bold tracking-widest text-xs"
                    >
                      Estimated Duration
                    </Label>
                    <NeoInput
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. 3 months"
                      className="h-12 focus-visible: focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
                    />
                  </div>
                )}
              />

              <form.Field
                name="startDate"
                children={(field) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="uppercase font-bold tracking-widest text-xs"
                    >
                      Start Date
                    </Label>
                    <NeoInput
                      type="date"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 focus-visible: focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px] tracking-wider font-semibold text-xs block w-full"
                    />
                  </div>
                )}
              />

              <form.Field
                name="endDate"
                children={(field) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="uppercase font-bold tracking-widest text-xs"
                    >
                      End Date
                    </Label>
                    <NeoInput
                      type="date"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 focus-visible: focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px] tracking-wider font-semibold text-xs block w-full"
                    />
                  </div>
                )}
              />
            </div>

            <button type="submit" className="hidden" />
          </form>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="shrink-0 border-t-2 border-border bg-card p-4 px-6 flex items-center justify-end z-10">
        <div className="w-full max-w-3xl mx-auto flex justify-between items-center">
          <NeoButton
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-xs h-12 px-6"
          >
            Cancel
          </NeoButton>

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            children={({ canSubmit, isSubmitting }) => (
              <NeoButton
                type="submit"
                disabled={!canSubmit || isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                size="lg"
                className=" px-8 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Space"}
              </NeoButton>
            )}
          />
        </div>
      </div>
    </div>
  );
}
