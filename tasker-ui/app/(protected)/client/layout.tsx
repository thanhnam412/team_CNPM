import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { auth } from "@/auth";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isExpert = false;

  return (
    <SidebarProvider>
      <AppSidebar isExpert={isExpert} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
