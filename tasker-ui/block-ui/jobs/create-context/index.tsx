"use client";

import { ContextOptions } from "./components/context-options";
import { ActionBar } from "./components/action-bar";

export interface JobsContextBlockProps {
  context: string;
  onContextChange: (val: string) => void;
  selectedProject: string;
  onSelectedProjectChange: (val: string) => void;
  mockProjects: any[];
  onContinue: () => void;
}

export function JobsContextBlock({
  context,
  onContextChange,
  selectedProject,
  onSelectedProjectChange,
  mockProjects,
  onContinue,
}: JobsContextBlockProps) {
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

        <ContextOptions
          context={context}
          onContextChange={onContextChange}
          selectedProject={selectedProject}
          onSelectedProjectChange={onSelectedProjectChange}
          mockProjects={mockProjects}
        />
      </div>

      <ActionBar onContinue={onContinue} />
    </div>
  );
}
