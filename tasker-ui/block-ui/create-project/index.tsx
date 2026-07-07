"use client";

import { ProjectFormHeader } from "./components/project-form-header";
import { ProjectFormFields } from "./components/project-form-fields";
import { ProjectFormActions } from "./components/project-form-actions";

import { ReactFormExtendedApi } from "@tanstack/react-form";

export interface CreateProjectFormValues {
  name: string;
  description: string;
  categories: string;
  estimatedDuration: string;
  startDate: string;
  endDate: string;
}

export interface CreateProjectBlockProps {
  form: ReactFormExtendedApi<CreateProjectFormValues, any, any, any, any, any, any, any, any, any, any, any>;
  onCancel: () => void;
}

export function CreateProjectBlock({ form, onCancel }: CreateProjectBlockProps) {
  return (
    <div className="flex flex-1 flex-col relative w-full h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-12 no-scrollbar">
        <ProjectFormHeader />

        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            <ProjectFormFields form={form} />
            
            <button type="submit" className="hidden" />
          </form>
        </div>
      </div>

      <ProjectFormActions form={form} onCancel={onCancel} />
    </div>
  );
}
