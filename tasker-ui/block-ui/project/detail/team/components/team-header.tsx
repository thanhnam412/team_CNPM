import { Mail, UserPlus } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface TeamHeaderProps {
  onMessageAll: () => void;
  onInviteMember: () => void;
}

export function TeamHeader({
  onMessageAll,
  onInviteMember,
}: TeamHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-border pb-6">
      <div>
        <h2 className="text-2xl font-heading font-black uppercase tracking-widest">
          Team Members
        </h2>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
          Manage access and collaborators
        </p>
      </div>

      <div className="flex gap-3 w-full md:w-auto">
        <NeoButton
          variant="outline"
          className="flex-1 md:flex-none text-xs h-12"
          onClick={onMessageAll}
        >
          <Mail className="w-4 h-4 mr-2" /> Message All
        </NeoButton>
        <NeoButton
          className="flex-1 md:flex-none text-xs h-12"
          onClick={onInviteMember}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </NeoButton>
      </div>
    </div>
  );
}
