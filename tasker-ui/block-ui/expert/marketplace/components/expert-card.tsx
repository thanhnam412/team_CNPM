import Link from "next/link";
import { Zap, Star, CheckCircle2, MapPin, BookmarkCheck, Bookmark, UserPlus } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn, formatCurrency } from "@/lib/utils";

export interface ExpertCardProps {
  expert: any;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onInvite: (expert: any) => void;
}

export function ExpertCard({
  expert,
  isSaved,
  onToggleSave,
  onInvite,
}: ExpertCardProps) {
  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[6px_6px_0px_0px_var(--primary)] hover:-translate-y-1 hover:-translate-x-1 transition-all flex flex-col group">
      {/* Card Header (Avatar + Rate) */}
      <div className="p-5 border-b-2 border-border flex justify-between items-start bg-secondary/10 relative">
        {/* Badge */}
        {expert.badge && (
          <div className="absolute -top-3 -left-3 bg-purple-500 text-white border-2 border-border px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_0px_var(--border)]">
            <Zap className="w-3 h-3 fill-current" />
            <span className="text-[0.625rem] font-black uppercase tracking-widest">
              {expert.badge}
            </span>
          </div>
        )}

        <div className="flex gap-4 items-center w-full mt-2">
          <div className="relative shrink-0">
            <div className="w-16 h-16 border-2 border-border bg-background flex items-center justify-center font-heading font-black text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors overflow-hidden">
              {expert.avatar && expert.avatar.startsWith("http") ? (
                <img src={expert.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                expert.avatar || expert.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            {expert.online && (
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"
                title="Online Now"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-black text-lg uppercase truncate">
              {expert.name}
            </h3>
            <p
              className="text-xs font-bold text-muted-foreground uppercase truncate"
              title={expert.title}
            >
              {expert.title}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right ml-2 mt-2">
          <span className="font-heading font-black text-xl text-primary">
            {expert.rate ? `${formatCurrency(expert.rate)}/hr` : "TBD"}
          </span>
        </div>
      </div>

      {/* Card Body (Stats + Skills) */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-black">{expert.rating || 4.9}</span>
            <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              ({expert.reviews || 0})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="font-black text-primary">
              {expert.completedTasks || 0}
            </span>
            <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Tasks
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{expert.location}</span>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {(Array.isArray(expert.skills)
            ? expert.skills
            : typeof expert.skills === "string" && expert.skills.startsWith("[")
            ? JSON.parse(expert.skills)
            : []
          ).map((skill: string) => (
            <span
              key={skill}
              className="bg-secondary/50 border-2 border-border px-2 py-1 text-[0.625rem] font-black uppercase tracking-widest"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer (Actions) */}
      <div className="p-4 border-t-2 border-border bg-secondary/5 flex gap-3">
        <NeoButton
          variant="outline"
          size="icon"
          onClick={() => onToggleSave(expert.id)}
          className={cn(
            "h-10 w-10 shrink-0",
            isSaved ? "" : "text-muted-foreground",
          )}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </NeoButton>
        <Link href={`/client/experts/${expert.id}`} className="flex-1">
          <NeoButton variant="outline" className="w-full h-10 text-[0.625rem]">
            View Profile
          </NeoButton>
        </Link>
        <NeoButton
          onClick={() => onInvite(expert)}
          className="flex-1 h-10 text-[0.625rem]"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Invite
        </NeoButton>
      </div>
    </div>
  );
}
