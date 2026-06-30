"use client";

import Icons from "@/components/icon";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/share/const";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SocialSign() {
  const params = useSearchParams();

  const handleSocialSignIn = (type: "facebook" | "google") => {
    if (type === "google" && BASE_URL) {
      const absoluteRedirectUrl = `${BASE_URL}/${params.get("redirect") ?? ""}`;
      signIn(type, {
        redirectTo: absoluteRedirectUrl,
      });
    }
  };

  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            HOẶC TIẾP TỤC VỚI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => handleSocialSignIn("google")}>
          <Icons.Google />
          Google
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialSignIn("facebook")}
        >
          <Icons.Facebook />
          Facebook
        </Button>
      </div>
    </>
  );
}
