"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center text-center space-y-3">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>

        <Badge variant="secondary">{user.role}</Badge>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-3 pt-4">
        <div className="text-sm">
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        {user.bio && (
          <div className="text-sm">
            <p className="text-muted-foreground">Bio</p>
            <p className="font-medium leading-relaxed">{user.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
