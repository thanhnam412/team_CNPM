"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, LockKeyhole, Mail, User } from "lucide-react";

import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCard, NeoCardContent } from "@/components/ui-custom/neo-card";
import { Checkbox } from "@/components/ui/checkbox";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import SocialSign from "../social-sign";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex justify-center lg:justify-end">
      <NeoCard className="w-full max-w-md">
        <NeoCardContent className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Đăng ký tài khoản</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Bắt đầu sự nghiệp freelance chuyên nghiệp của bạn.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên</Label>

              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <NeoInput
                  id="fullname"
                  placeholder="Nhập họ và tên của bạn"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <NeoInput
                  id="email"
                  type="email"
                  placeholder="example@aitasker.vn"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <NeoInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" />

              <Label
                htmlFor="terms"
                className="text-sm leading-relaxed font-normal"
              >
                Tôi đồng ý với{" "}
                <Link href="#" className="text-primary hover:underline">
                  Điều khoản & Chính sách
                </Link>
              </Label>
            </div>

            <NeoButton className="w-full h-12 text-xs md:text-sm px-2">
              Tham gia ngay với tư cách Aitasker
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </NeoButton>

            <SocialSign />
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <span
              onClick={() => router.push("/login")}
              className="font-medium text-primary hover:underline hover:cursor-pointer"
            >
              Đăng nhập ngay
            </span>
          </p>
        </NeoCardContent>
      </NeoCard>
    </div>
  );
}
