import { Shield, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TeamMemberCardProps {
  member: any;
  onUpdateRole: (memberId: string, role: string) => void;
  isUpdatingRole: boolean;
  onRemoveMember: (memberId: string) => void;
  isRemoving: boolean;
}

export function TeamMemberCard({
  member,
  onUpdateRole,
  isUpdatingRole,
  onRemoveMember,
  isRemoving,
}: TeamMemberCardProps) {
  return (
    <div className="bg-card border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] flex flex-col hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all group relative overflow-hidden">
      {/* Status Banner */}
      {member.status === "Pending" && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[0.625rem] font-black uppercase tracking-widest px-3 py-1 border-b-2 border-l-2 border-foreground">
          Pending Invite
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col items-center text-center">
        <div
          className={cn(
            "w-20 h-20 mb-4 border-4 flex items-center justify-center font-heading font-black text-3xl shadow-[4px_4px_0px_0px_var(--foreground)]",
            member.role === "Expert"
              ? "bg-primary border-foreground text-primary-foreground"
              : member.role === "Client Admin"
                ? "bg-foreground border-foreground text-background"
                : "bg-secondary border-foreground text-foreground",
          )}
        >
          {member.avatar?.startsWith("http") ? (
            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            member.avatar || member.name?.substring(0, 2).toUpperCase()
          )}
        </div>

        <h3 className="font-heading font-black text-xl uppercase tracking-wider mb-1">
          {member.name}
        </h3>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate w-full">
          {member.email}
        </p>

        <div className="mt-4 flex flex-col items-center gap-2">
          <span
            className={cn(
              "text-[0.625rem] font-black uppercase tracking-widest px-3 py-1 border-2 flex items-center gap-1",
              member.role === "Client Admin"
                ? "border-foreground bg-foreground/10 text-foreground"
                : member.role === "Expert"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/20 text-muted-foreground",
            )}
          >
            {member.role === "Client Admin" && <Shield className="w-3 h-3" />}
            {member.role === "Expert" && <Star className="w-3 h-3" />}
            {member.role}
          </span>

          {member.rating && (
            <div className="flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {""}
              {member.rating} Expert Rating
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t-2 border-border bg-secondary/10 p-3 flex justify-between items-center">
        <select
          className="bg-background border-2 border-border text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 outline-none focus:border-primary cursor-pointer h-8"
          value={member.role}
          onChange={(e) => onUpdateRole(member.id, e.target.value)}
          disabled={isUpdatingRole}
        >
          <option value="Client Admin">Client Admin</option>
          <option value="Internal Team">Internal Team</option>
          <option value="Expert">Expert</option>
        </select>
        <button
          onClick={() => onRemoveMember(member.id)}
          disabled={isRemoving}
          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          title="Remove Member"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
