"use client";

import { ReactNode } from "react";
import { AppStoreProvider } from "@/store/app-store";
import { ToastViewport } from "@/components/ui/toast";

export default function Providers({ children }: { children: ReactNode }) {
  return <AppStoreProvider>{children}<ToastViewport /></AppStoreProvider>;
}
