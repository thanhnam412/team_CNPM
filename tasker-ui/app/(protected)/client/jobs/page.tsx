"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Network, Cpu, Info, ArrowUp } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoButton } from "@/components/ui-custom/neo-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function JobsContextPage() {
  const router = useRouter();
  const [context, setContext] = useState("project");
  const [selectedProject, setSelectedProject] = useState("new_project");

  // Mock data for projects
  const mockProjects = [
    { id: "ats", name: "Hệ thống AI Đánh giá Hồ sơ (LLM-based ATS)" },
    { id: "erp", name: "Hệ thống Quản lý Doanh nghiệp (ERP)" },
    { id: "ecommerce", name: "Nền tảng Thương mại điện tử B2B" },
  ];

  // Logic to determine if there are projects
  const hasProjects = mockProjects.length > 0;

  const selectedProjectText =
    mockProjects.find((p) => p.id === selectedProject)?.name ||
    (selectedProject === "new_project" ? "+ Create New Project" : "");

  const isCreatingNew = !hasProjects || selectedProject === "new_project";

  return (
    <div className="flex flex-1 flex-col relative w-full h-full">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-12 no-scrollbar">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold tracking-widest uppercase mb-4 text-foreground">
            Create Job
          </h1>
          <h2 className="text-lg md:text-xl font-heading font-bold tracking-widest uppercase mb-4 text-muted-foreground">
            Select Context
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground uppercase font-semibold tracking-wider">
            Does this job belong to an existing project architecture, or is it a
            standalone requirement?
          </p>
        </div>

        <RadioGroup
          value={context}
          onValueChange={setContext}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch"
        >
          {/* Option 1: Existing / Create Project */}
          <div className="relative group flex">
            <RadioGroupItem
              value="project"
              id="context_project"
              className="peer sr-only"
            />
            <Label
              htmlFor="context_project"
              className={cn(
                "flex flex-col flex-1 bg-card border-2 p-6 cursor-pointer transition-transform relative overflow-hidden group rounded-none h-full",
                context === "project"
                  ? "border-primary shadow-[2px_2px_0px_0px_var(--primary)] -translate-x-[2px] -translate-y-[2px]"
                  : "border-border shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-[1px] active:translate-y-[1px]",
              )}
            >
              {/* Active Indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 transition-opacity",
                  context === "project"
                    ? "text-primary opacity-100"
                    : "opacity-0",
                )}
              >
                <CheckCircle2 className="w-6 h-6 fill-primary text-primary-foreground" />
              </div>

              {/* Top aligned content */}
              <div className="flex flex-col items-start mb-6">
                <div className="w-12 h-12 border-2 border-primary bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold tracking-widest uppercase mb-2">
                  {isCreatingNew ? "Create Project" : "Existing Project"}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground transition-all duration-300">
                  {isCreatingNew
                    ? "Initialize a brand new project workspace. This job will serve as the founding requirement for your new architecture."
                    : "Attach this role to an active project to inherit team access, billing codes, and technical documentation."}
                </p>
              </div>

              {/* Bottom aligned content pushed by mt-auto */}
              <div
                className={cn(
                  "mt-auto pt-4 border-t-2 w-full",
                  context === "project"
                    ? "border-primary/20"
                    : "border-border/50",
                )}
              >
                {!hasProjects ? (
                  <div className="flex items-center gap-2 text-[0.625rem] tracking-widest font-semibold uppercase text-primary h-10">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Workspace setup required in next steps</span>
                  </div>
                ) : (
                  <>
                    <div className="block text-[0.625rem] font-semibold text-muted-foreground tracking-widest uppercase mb-2">
                      Select Project
                    </div>
                    <div
                      className="relative w-full"
                      onClick={(e) => {
                        if (context !== "project") {
                          e.preventDefault();
                        }
                      }}
                    >
                      <NeoSelect
                        disabled={context !== "project"}
                        value={selectedProject}
                        onValueChange={setSelectedProject}
                      >
                        <TooltipProvider delay={200}>
                          <Tooltip>
                            <TooltipTrigger render={<div className="w-full" />}>
                              <NeoSelectTrigger className="w-full overflow-hidden">
                                <div
                                  className={cn(
                                    "truncate w-full text-left uppercase tracking-wider text-xs",
                                    selectedProject === "new_project"
                                      ? "font-bold text-primary"
                                      : "font-semibold",
                                  )}
                                >
                                  <NeoSelectValue placeholder="Select a project">
                                    {selectedProjectText}
                                  </NeoSelectValue>
                                </div>
                              </NeoSelectTrigger>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="start"
                              className="max-w-[280px]"
                            >
                              <p className="text-xs font-semibold leading-relaxed">
                                {selectedProjectText}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <NeoSelectContent>
                          {mockProjects.map((project) => (
                            <NeoSelectItem
                              key={project.id}
                              value={project.id}
                              className="font-semibold tracking-wider text-xs"
                            >
                              <span
                                className="truncate block w-full text-left"
                                title={project.name}
                              >
                                {project.name}
                              </span>
                            </NeoSelectItem>
                          ))}
                          <div className="h-px bg-border my-1" />
                          <NeoSelectItem
                            value="new_project"
                            className="tracking-wider text-xs focus:text-primary focus:bg-primary/10"
                          >
                            Create New Project
                          </NeoSelectItem>
                        </NeoSelectContent>
                      </NeoSelect>
                    </div>
                  </>
                )}
              </div>
            </Label>
          </div>

          {/* Option 2: Standalone */}
          <div className="relative group flex">
            <RadioGroupItem
              value="standalone"
              id="context_standalone"
              className="peer sr-only"
            />
            <Label
              htmlFor="context_standalone"
              className={cn(
                "flex flex-col flex-1 bg-card border-2 p-6 cursor-pointer transition-transform relative overflow-hidden group rounded-none h-full",
                context === "standalone"
                  ? "border-primary shadow-[2px_2px_0px_0px_var(--primary)] -translate-x-[2px] -translate-y-[2px]"
                  : "border-border shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--border)] active:translate-x-[1px] active:translate-y-[1px]",
              )}
            >
              {/* Active Indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 transition-opacity",
                  context === "standalone"
                    ? "text-primary opacity-100"
                    : "opacity-0",
                )}
              >
                <CheckCircle2 className="w-6 h-6 fill-primary text-primary-foreground" />
              </div>

              {/* Top aligned content */}
              <div className="flex flex-col items-start mb-6">
                <div className="w-12 h-12 border-2 border-foreground bg-secondary flex items-center justify-center text-secondary-foreground mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold tracking-widest uppercase mb-2">
                  Standalone Task
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Create an independent job posting not tied to a specific
                  broader project initiative.
                </p>
              </div>

              {/* Bottom aligned content pushed by mt-auto */}
              <div className="mt-auto pt-4 border-t-2 border-transparent w-full">
                <div className="flex items-center gap-2 text-[0.625rem] tracking-widest font-semibold uppercase text-muted-foreground h-10">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Requires manual budget allocation</span>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sticky Action Bar */}
      <div className="shrink-0 border-t-2 border-border bg-card p-4 px-6 flex items-center justify-end z-10">
        <div className="w-full max-w-3xl mx-auto flex justify-end">
          <NeoButton
            size="lg"
            onClick={() => {
              if (context === "standalone") {
                router.push("/client/quick-tasks/create");
              } else {
                if (selectedProject === "new_project") {
                  router.push("/client/projects/create");
                } else {
                  router.push(`/client/projects/${selectedProject}`);
                }
              }
            }}
            className=" px-8 h-12"
          >
            Tiếp tục
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
