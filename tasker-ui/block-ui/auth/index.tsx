"use client";

import { HeroSideSection } from "@/block-ui/auth/components/hero-section";
import { LoginForm } from "./components/form/login";
import { RegisterForm } from "./components/form/register";

interface Props {
  type: "register" | "login";
}

export default function AuthBlock({ type }: Props) {
  return (
    <div className="grow flex items-start justify-center pt-16 px-margin-mobile">
      <div className="w-full max-w-300 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 ">
        <HeroSideSection />
        {type === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
