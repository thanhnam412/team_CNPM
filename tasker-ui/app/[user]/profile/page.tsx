"use client";

import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/ui-custom/neo-card";
import {
  NeoAvatar,
} from "@/components/ui-custom/neo-avatar";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { Separator } from "@/components/ui/separator";

type UserProfileProps = {
  user: {
    name: string;
    email: string;
    username: string;
    role: string;
    bio?: string;
    avatarUrl?: string;
  };
};

export default function UserProfileCard({ user }: UserProfileProps) {
  user = {
    name: "Nguyen Van A",
    email: "nguyenvana@gmail.com",
    username: "nguyenvana",
    role: "Admin",
    bio: "Full-stack developer, thích AI, React và trading.",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  };
  return (
    <NeoCard className="w-full max-w-md mx-auto p-4 bg-[#f8f9fa]">
      <NeoCardHeader className="flex flex-col items-center text-center space-y-4">
        <NeoAvatar className="h-24 w-24 text-4xl" name={user.name} />

        <div>
          <NeoCardTitle className="text-2xl">{user.name}</NeoCardTitle>
          <p className="text-sm text-muted-foreground font-bold tracking-widest uppercase mt-1">
            @{user.username}
          </p>
        </div>

        <NeoBadge variant="secondary">{user.role}</NeoBadge>
      </NeoCardHeader>

      <div className="h-1 bg-border my-4 w-full"></div>

      <NeoCardContent className="space-y-4 pt-4 mt-4">
        <div className="text-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Email
          </p>
          <p className="font-black text-lg">{user.email}</p>
        </div>

        {user.bio && (
          <div className="text-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Bio
            </p>
            <p className="font-semibold leading-relaxed p-4 bg-white border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] mt-2">
              {user.bio}
            </p>
          </div>
        )}
      </NeoCardContent>
    </NeoCard>
  );
}
