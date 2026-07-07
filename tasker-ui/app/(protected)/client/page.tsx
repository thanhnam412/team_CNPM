"use client";

import { ClientDashboardBlock } from "@/block-ui/client-dashboard";

export default function DashboardOverviewPage() {
  const userName = "Client_01";

  // Mock Data
  const finance = {
    availableBalance: "$4,500.00",
    inEscrow: "$2,150.00",
    spentMTD: "$850.00",
  };

  const pendingActions = [
    {
      task: "API Integration Module",
      expert: "Alex_Code",
      type: "Project",
      id: "PROJ-123",
    },
    {
      task: "Web Scraper Script",
      expert: "Data_Wizard_99",
      type: "Quick Task",
      id: "QT-889",
    },
  ];

  const activeProjects = [
    {
      id: "PROJ-123",
      name: "Hệ thống Quản lý Doanh nghiệp (ERP)",
      deadlineInfo: "Deadline: Dec 31, 2026",
      status: "On Track",
      progress: 65,
      escrow: "$5,000.00",
    },
    {
      id: "PROJ-124",
      name: "B2B E-commerce Platform",
      deadlineInfo: "Due in 3 days",
      status: "At Risk",
      progress: 85,
      escrow: "$3,200.00",
    },
  ];

  const unreadMessages = [
    {
      name: "Alex_Code",
      time: "10:42 AM",
      msg: "I've started setting up the proxy pool for the scraper.",
      unread: 2,
      context: "QT-889",
    },
    {
      name: "DesignStudio",
      time: "Yesterday",
      msg: "Attached the initial wireframes for your review.",
      unread: 1,
      context: "PROJ-124",
    },
  ];

  return (
    <ClientDashboardBlock
      userName={userName}
      finance={finance}
      pendingActions={pendingActions}
      activeProjects={activeProjects}
      unreadMessages={unreadMessages}
    />
  );
}
