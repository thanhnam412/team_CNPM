import { Handshake, X, FileSignature } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import {
  NeoDrawer,
  NeoDrawerContent,
  NeoDrawerFooter,
  NeoDrawerHeader,
  NeoDrawerTitle,
} from "@/components/ui-custom/neo-drawer";

export interface TaskOverviewDrawerProps {
  isOpen: boolean;
  task: any;
  onClose: () => void;
  onApplyClick: () => void;
}

export function TaskOverviewDrawer({
  isOpen,
  task,
  onClose,
  onApplyClick,
}: TaskOverviewDrawerProps) {
  return (
    <NeoDrawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <NeoDrawerContent side="right">
        <NeoDrawerHeader className="flex flex-row justify-between items-center space-y-0">
          <NeoDrawerTitle className="flex items-center gap-3">
            <FileSignature className="w-6 h-6 text-primary" /> Task Overview
          </NeoDrawerTitle>
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="border-transparent h-8 w-8 shrink-0"
          >
            <X className="w-5 h-5" />
          </NeoButton>
        </NeoDrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {task && (
            <div className="space-y-8">
              <div className="bg-foreground text-background p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-2">
                    Client ID: {task.clientId}
                  </div>
                  <div className="font-heading font-black text-2xl uppercase mb-2">
                    {task.title}
                  </div>
                  <div className="flex gap-4 text-xs font-bold uppercase text-background/80">
                    <span>
                      Posted: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <span>Proposals: {task.proposalsCount || 0}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                    Bounty
                  </div>
                  <div className="font-heading font-black text-3xl text-warning">
                    {formatCurrency(task.budget || 0)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-black text-lg uppercase border-b-2 border-foreground pb-2 mb-4">
                  Task Description
                </h3>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border-2 border-foreground bg-secondary/10">
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-muted-foreground">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {task.skills?.map((skill: string) => (
                      <NeoBadge key={skill}>{skill}</NeoBadge>
                    )) || (
                      <span className="text-xs italic text-muted-foreground">
                        No skills specified
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 border-2 border-foreground bg-secondary/10">
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-muted-foreground">
                    Client Info
                  </h4>
                  <div className="text-sm">
                    <p>
                      <strong>Experience Level:</strong>{" "}
                      {task.experienceLevel || "Any"}
                    </p>
                    <p>
                      <strong>Project Type:</strong>{" "}
                      {task.projectType || "One-time"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <NeoDrawerFooter>
          <NeoButton variant="outline" onClick={onClose} className="h-14 px-8">
            Cancel
          </NeoButton>
          <NeoButton onClick={onApplyClick} className="h-14 px-10 text-lg">
            Apply Now <Handshake className="w-5 h-5 ml-2" />
          </NeoButton>
        </NeoDrawerFooter>
      </NeoDrawerContent>
    </NeoDrawer>
  );
}
