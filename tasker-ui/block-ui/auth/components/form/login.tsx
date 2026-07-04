"use client";

import { useState } from "react";
import { NeoCard, NeoCardContent } from "@/components/ui-custom/neo-card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { Checkbox } from "@/components/ui/checkbox";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import SocialSign from "../social-sign";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center lg:justify-end">
      <NeoCard className="w-full max-w-md">
        <NeoCardContent className="p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Chào mừng trở lại</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Vui lòng nhập thông tin của bạn để tiếp tục.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <NeoInput
                  id="email"
                  type="email"
                  placeholder="example@aitasker.com"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <NeoInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="font-normal">
                Ghi nhớ đăng nhập
              </Label>
            </div>

            <NeoButton className="w-full h-12 text-base">Đăng nhập</NeoButton>
          </form>

          <SocialSign />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <span
              className="font-medium text-primary hover:underline hover:cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Tham gia ngay
            </span>
          </p>
        </NeoCardContent>
      </NeoCard>
    </div>
  );
}
