import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar isExpert={true} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
