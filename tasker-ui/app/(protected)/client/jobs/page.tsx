"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobsContextBlock } from "@/block-ui/jobs/create-context";

export default function JobsContextPage() {
  const router = useRouter();
  const [context, setContext] = useState("project");
  const [selectedProject, setSelectedProject] = useState("new_project");

  // Mock data for projects
  const mockProjects = [
    { id: "ats", name: "Hệ thống AI Đánh giá Hồ sơ (LLM-based ATS)" },
    { id: "erp", name: "Hệ thống Quản lý Doanh nghiệp (ERP)" },
    { id: "ecommerce", name: "Nền tảng Thương mại điện tử B2B" },
  ];

  const handleContinue = () => {
    if (context === "standalone") {
      router.push("/client/quick-tasks/create");
    } else {
      if (selectedProject === "new_project") {
        router.push("/client/projects/create");
      } else {
        router.push(`/client/projects/${selectedProject}`);
      }
    }
  };

  return (
    <JobsContextBlock
      context={context}
      onContextChange={(val) => setContext(val || "project")}
      selectedProject={selectedProject}
      onSelectedProjectChange={(val) => setSelectedProject(val || "new_project")}
      mockProjects={mockProjects}
      onContinue={handleContinue}
    />
  );
}
