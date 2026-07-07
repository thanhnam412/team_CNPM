import { UserPlus, X, MessageSquare } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCheckbox } from "@/components/ui-custom/neo-checkbox";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";

export interface InviteModalProps {
  expert: any;
  formattedRate: string;
  isInviteOpen: boolean;
  inviteContext: string;
  inviteMessage: string;
  quickTasks: any[];
  projects: any[];
  isPending: boolean;
  onContextChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onClose: () => void;
  onSendInvite: () => void;
}

export function InviteModal({
  expert,
  formattedRate,
  isInviteOpen,
  inviteContext,
  inviteMessage,
  quickTasks,
  projects,
  isPending,
  onContextChange,
  onMessageChange,
  onClose,
  onSendInvite,
}: InviteModalProps) {
  if (!isInviteOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="border-b-4 border-foreground p-6 flex justify-between items-center bg-secondary/30 shrink-0">
          <h2 className="font-heading font-black text-2xl uppercase tracking-widest flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-primary" /> Invite Expert
          </h2>
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="border-transparent h-8 w-8"
          >
            <X className="w-5 h-5" />
          </NeoButton>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center gap-4 bg-secondary/10 border-2 border-border p-4">
            <div className="w-12 h-12 border-2 border-border bg-background flex items-center justify-center font-heading font-black text-xl shrink-0 overflow-hidden">
              {expert.avatar && expert.avatar.startsWith("http") ? (
                <img
                  src={expert.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                expert.avatar || expert.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div>
              <div className="font-heading font-black uppercase text-lg">
                {expert.name}
              </div>
              <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                {expert.title || "Expert"}
              </div>
            </div>
            <div className="ml-auto font-heading font-black text-primary text-xl">
              {formattedRate}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
              Select Context
            </label>
            <NeoSelect
              value={inviteContext}
              onValueChange={(val) => onContextChange(val || "none")}
            >
              <NeoSelectTrigger className="w-full h-12 text-sm">
                <NeoSelectValue placeholder="Select a Project or Quick Task" />
              </NeoSelectTrigger>
              <NeoSelectContent>
                <NeoSelectItem value="none" className="text-sm">
                  General Inquiry (No project)
                </NeoSelectItem>

                {quickTasks && quickTasks.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground bg-secondary/20 mt-2">
                      Active Quick Tasks
                    </div>
                    {quickTasks
                      .filter((qt: any) => qt.status === "OPEN")
                      .map((qt: any) => (
                        <NeoSelectItem
                          key={qt.id}
                          value={`qt_${qt.id}`}
                          className="text-sm"
                        >
                          {qt.title} (Task)
                        </NeoSelectItem>
                      ))}
                  </>
                )}

                {projects && projects.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground bg-secondary/20 mt-2">
                      Active Projects
                    </div>
                    {projects.map((p: any) => (
                      <NeoSelectItem
                        key={p.id}
                        value={`proj_${p.id}`}
                        className="text-sm"
                      >
                        {p.title} (Project)
                      </NeoSelectItem>
                    ))}
                  </>
                )}
              </NeoSelectContent>
            </NeoSelect>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Invitation Message
            </label>
            <NeoTextarea
              value={inviteMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              className="min-h-[120px] text-sm font-semibold p-4"
            />
          </div>

          <div className="flex items-start gap-3 p-4 border-2 border-primary bg-primary/5">
            <NeoCheckbox
              id="terms"
              defaultChecked
              className="mt-0.5 data-[state=checked]:bg-primary"
            />
            <label
              htmlFor="terms"
              className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer leading-tight"
            >
              By sending this invitation, a new direct message will be created in
              your <strong className="text-foreground">Global Inbox</strong>.
            </label>
          </div>
        </div>

        <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex gap-4 shrink-0">
          <NeoButton
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12"
          >
            Cancel
          </NeoButton>
          <NeoButton
            onClick={onSendInvite}
            disabled={isPending}
            className="flex-1 h-12"
          >
            {isPending ? "Sending..." : "Send Invite"}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
