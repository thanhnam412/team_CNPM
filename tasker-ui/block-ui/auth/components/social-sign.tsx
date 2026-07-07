"use client";

import Icons from "@/components/icon";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { BASE_URL } from "@/share/const";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SocialSignInner() {
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
        <NeoButton variant="outline" className="h-12 gap-2" onClick={() => handleSocialSignIn("google")}>
          <Icons.Google />
          Google
        </NeoButton>

        <NeoButton
          variant="outline"
          className="h-12 gap-2"
          onClick={() => handleSocialSignIn("facebook")}
        >
          <Icons.Facebook />
          Facebook
        </NeoButton>
      </div>
    </>
  );
}

export default function SocialSign() {
  return (
    <Suspense fallback={<div className="grid grid-cols-2 gap-4 mt-8"><div className="h-12 rounded-md bg-muted animate-pulse" /><div className="h-12 rounded-md bg-muted animate-pulse" /></div>}>
      <SocialSignInner />
    </Suspense>
  );
}
