import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layout/app-sidebar";
import { DashboardHeader } from "@/layout/dashboard-header";
import { auth } from "@/auth";
import React from "react";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user as any} isExpert={false} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
