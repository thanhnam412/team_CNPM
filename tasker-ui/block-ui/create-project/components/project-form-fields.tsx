import { Sparkles } from "lucide-react";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReactFormExtendedApi } from "@tanstack/react-form";
import { CreateProjectFormValues } from "../index";

export interface ProjectFormFieldsProps {
  form: ReactFormExtendedApi<CreateProjectFormValues, any, any, any, any, any, any, any, any, any, any, any>;
}

export function ProjectFormFields({ form }: ProjectFormFieldsProps) {
  return (
    <>
      {/* Project Name (Required) */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }: { value: string }) =>
            !value ? "Project Name is required" : undefined,
        }}
        children={(field: any) => (
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
        children={(field: any) => (
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
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
        children={(field: any) => (
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
          children={(field: any) => (
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
          children={(field: any) => (
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
          children={(field: any) => (
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
    </>
  );
}
