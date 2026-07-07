import { MapPin, UserPlus, Bookmark, BookmarkCheck, Star } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";

export interface IdentitySidebarProps {
  expert: any;
  formattedRate: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenInvite: () => void;
}

export function IdentitySidebar({
  expert,
  formattedRate,
  isSaved,
  onToggleSave,
  onOpenInvite,
}: IdentitySidebarProps) {
  return (
    <div className="w-full lg:w-[350px] shrink-0 border-b-2 lg:border-b-0 lg:border-r-2 border-border bg-card p-6 flex flex-col gap-6">
      {/* Avatar & Basic Info */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-32 h-32 border-4 border-foreground bg-primary flex items-center justify-center font-heading font-black text-5xl text-primary-foreground shadow-[6px_6px_0px_0px_var(--foreground)] overflow-hidden">
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
          {expert.online && (
            <div
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-card rounded-full"
              title="Online Now"
            />
          )}
        </div>

        <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
          {expert.name}
        </h1>
        <p className="text-sm font-bold text-muted-foreground uppercase mt-1">
          {expert.title || "Expert"}
        </p>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3">
          <MapPin className="w-4 h-4" /> {expert.location || "N/A"}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-3">
        <NeoButton onClick={onOpenInvite} className="w-full h-14 text-sm">
          <UserPlus className="w-5 h-5 mr-2" /> Invite to Project
        </NeoButton>
        <NeoButton
          variant="outline"
          onClick={onToggleSave}
          className={cn("w-full h-12", isSaved ? "bg-primary/5" : "")}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 mr-2" />
          ) : (
            <Bookmark className="w-4 h-4 mr-2" />
          )}
          {isSaved ? "Saved" : "Save Expert"}
        </NeoButton>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 gap-4 border-t-2 border-border pt-6">
        <div>
          <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Hourly Rate
          </div>
          <div className="font-heading font-black text-xl text-primary">
            {formattedRate}
          </div>
        </div>
        <div>
          <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Avg Rating
          </div>
          <div className="font-heading font-black text-xl flex items-center gap-1">
            {expert.rating || "N/A"}
            {expert.rating ? (
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ) : null}
          </div>
        </div>
        <div>
          <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Jobs Done
          </div>
          <div className="font-heading font-black text-xl">
            {expert.completedTasks || 0}
          </div>
        </div>
        <div>
          <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Total Reviews
          </div>
          <div className="font-heading font-black text-xl">
            {expert.reviewCount || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
