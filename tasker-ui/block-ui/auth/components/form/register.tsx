"use client";

import Link from "next/link";
import { ArrowRight, Eye, Lock, LockKeyhole, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import SocialSign from "../social-sign";

export function RegisterForm() {
  const router = useRouter();

  return (
    <div className="flex justify-center lg:justify-end">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
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

                <Input
                  id="fullname"
                  placeholder="Nhập họ và tên của bạn"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="example@aitasker.vn"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-8 w-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                />
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

            <Button className="w-full">
              Tham gia ngay với tư cách Aitasker
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

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
        </CardContent>
      </Card>
    </div>
  );
}
