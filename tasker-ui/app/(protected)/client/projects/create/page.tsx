"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreateProjectBlock, CreateProjectFormValues } from "@/block-ui/create-project";
import { useCreateProjectMutation } from "@/tanstack/useProjects";

export default function CreateProjectPage() {
  const router = useRouter();
  const createProjectMutation = useCreateProjectMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      categories: "",
      estimatedDuration: "",
      startDate: "",
      endDate: "",
    } as CreateProjectFormValues,
    onSubmit: async ({ value }) => {
      try {
        await createProjectMutation.mutateAsync({
          title: value.name,
          description: value.description || null,
          tags: value.categories
            ? value.categories.split(",").map((c) => c.trim()).filter(Boolean)
            : null,
          startDate: value.startDate ? new Date(value.startDate).toISOString() : null,
          endDate: value.endDate ? new Date(value.endDate).toISOString() : null,
        });

        toast.success("Project Space Created successfully!");
        router.push("/client/projects");
      } catch (error: any) {
        toast.error("Failed to create project: " + (error?.message || "Unknown error"));
      }
    },
  });

  const handleCancel = () => {
    router.back();
  };

  return <CreateProjectBlock form={form} onCancel={handleCancel} />;
}
