"use client";

import {
  Users,
  UserPlus,
  Shield,
  Star,
  Mail,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";
import { useTeam, useUpdateRoleMutation, useRemoveMemberMutation } from "@/tanstack/useTeam";
import { useParams } from "next/navigation";

interface TeamMember {
  id: string;
  name: string;
  role: "Client Admin" | "Internal Team" | "Expert";
  email: string;
  avatar: string;
  status: "Active" | "Pending";
  rating?: number;
}

export default function ProjectTeamPage() {
  const { projectId } = useParams() as { projectId: string };
  
  const { data: team = [], isLoading } = useTeam(projectId);
  const updateRoleMutation = useUpdateRoleMutation(projectId);
  const removeMemberMutation = useRemoveMemberMutation(projectId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
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
          >
            <Mail className="w-4 h-4 mr-2" /> Message All
          </NeoButton>
          <NeoButton className="flex-1 md:flex-none text-xs h-12">
            <UserPlus className="w-4 h-4 mr-2" /> Invite Member
          </NeoButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            Loading team...
          </div>
        )}
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-card border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] flex flex-col hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all group relative overflow-hidden"
          >
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
                {member.avatar}
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
                  {member.role === "Client Admin" && (
                    <Shield className="w-3 h-3" />
                  )}
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
                onChange={(e) => updateRoleMutation.mutate({ memberId: member.id, role: e.target.value })}
                disabled={updateRoleMutation.isPending}
              >
                <option value="Client Admin">Client Admin</option>
                <option value="Internal Team">Internal Team</option>
                <option value="Expert">Expert</option>
              </select>
              <button 
                onClick={() => {
                  if(confirm("Remove this member from the project?")) {
                    removeMemberMutation.mutate(member.id);
                  }
                }}
                disabled={removeMemberMutation.isPending}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                title="Remove Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty Slot for Inviting */}
        <div className="border-4 border-dashed border-border bg-secondary/5 flex flex-col items-center justify-center text-center p-6 min-h-[300px] hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-full border-4 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary mb-4 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-lg uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
            Add Team Member
          </h3>
          <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-[200px]">
            Invite internal colleagues or hire new experts from the marketplace.
          </p>
        </div>
      </div>
    </div>
  );
}
