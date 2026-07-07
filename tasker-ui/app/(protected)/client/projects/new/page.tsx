"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCreateProjectMutation } from "@/tanstack/useProjects";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Wand2,
  CheckCircle2,
  BrainCircuit,
  DollarSign,
  Calendar,
  Sparkles,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoFormField } from "@/components/ui-custom/neo-form-field";
import {
  WizardHeader,
  WizardStepContainer,
  WizardCard,
  WizardSectionTitle,
  WizardBackButton,
  WizardNextButton,
} from "@/components/ui-custom/neo-wizard";

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a specialty"),
  description: z.string().min(20, "Please describe your goal (min 20 chars)"),
  technicalScope: z.string().optional(),
  type: z.string(),
  budgetMin: z.number().min(0, "Invalid budget").optional(),
  budgetMax: z.number().min(1, "Please enter a valid max budget"),
  duration: z.string(),
  commitment: z.string(),
});

const STEP1_FIELDS = [
  {
    name: "title",
    label: "Project Title",
    placeholder: "e.g., Build a Customer Churn Prediction Model",
    type: "text" as const,
  },
  {
    name: "category",
    label: "AI Specialty",
    placeholder: "Select Category",
    type: "select" as const,
    options: [
      { label: "LLM & GenAI", value: "llm" },
      { label: "Computer Vision", value: "cv" },
      { label: "MLOps & Deployment", value: "mlops" },
      { label: "Predictive Analytics / Data", value: "data" },
    ],
  },
  {
    name: "description",
    label: "Business Goal (In your own words)",
    placeholder:
      "Describe what you want to achieve. Don't worry about the technical details...",
    type: "textarea" as const,
  },
];

const STEP3_TIMELINE_FIELDS = [
  {
    name: "duration",
    label: "Expected Duration",
    placeholder: "Select Duration",
    type: "select" as const,
    options: [
      { label: "Less than 1 month", value: "short" },
      { label: "1 to 3 months", value: "medium" },
      { label: "More than 3 months", value: "long" },
    ],
  },
  {
    name: "commitment",
    label: "Expert Commitment",
    placeholder: "Select Commitment",
    type: "select" as const,
    options: [
      { label: "Part-time (10-30 hrs/week)", value: "part" },
      { label: "Full-time (40+ hrs/week)", value: "full" },
    ],
  },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const createMutation = useCreateProjectMutation();

  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      technicalScope: "",
      type: "fixed",
      budgetMin: undefined as number | undefined,
      budgetMax: 0,
      duration: "medium",
      commitment: "part",
    },
    onSubmit: async ({ value }) => {
      createMutation.mutate({
        title: value.title,
        description: value.description,
        budget: value.budgetMax,
        category: value.category,
        technicalScope: value.technicalScope,
        type: value.type,
        duration: value.duration,
        commitment: value.commitment,
      }, {
        onSuccess: () => router.push("/client/projects")
      });
    },
  });

  const handleGenerateScope = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      form.setFieldValue(
        "technicalScope",
        "## Technical Scope & Architecture\n\n" +
          "Based on your requirements, here is the recommended technical approach:\n\n" +
          "### 1. Data Pipeline\n" +
          "- **Ingestion:** Setup a secure ETL pipeline to pull daily records from AWS S3.\n" +
          "- **Preprocessing:** Use Pandas/Dask for data cleaning and handling missing values.\n\n" +
          "### 2. Machine Learning Model\n" +
          "- **Algorithm:** XGBoost or Random Forest for baseline churn prediction.\n" +
          "- **Metrics:** Focus on F1-Score and ROC-AUC due to class imbalance.\n\n" +
          "### 3. Deployment\n" +
          "- Containerize the inference API using Docker and FastAPI.\n" +
          "- Deploy to an existing Kubernetes cluster or AWS SageMaker.",
      );
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <WizardHeader
        icon={Rocket}
        title="Create a Project"
        subtitle="Let our AI assistant help you scope and define your technical requirements."
        currentStep={step}
        steps={[
          { num: 1, label: "Basics" },
          { num: 2, label: "AI Scoping" },
          { num: 3, label: "Budget & Post" },
        ]}
      />

      <div className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto pb-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* STEP 1: BASICS */}
            {step === 1 && (
              <WizardStepContainer>
                <WizardCard>
                  <div className="space-y-6">
                    {STEP1_FIELDS.map(({ name, ...rest }) => (
                      <NeoFormField
                        key={name}
                        form={form}
                        name={name}
                        validators={{
                          onChange: (projectSchema.shape as any)[name],
                        }}
                        {...rest}
                      />
                    ))}
                  </div>
                </WizardCard>

                <div className="flex justify-end">
                  <WizardNextButton
                    label="Next Step: AI Scoping"
                    onClick={() => {
                      const step1Schema = projectSchema.pick({
                        title: true,
                        category: true,
                        description: true,
                      });
                      const result = step1Schema.safeParse(form.state.values);

                      if (!result.success) {
                        form.validateAllFields("change");
                        return;
                      }
                      setStep(2);
                    }}
                  />
                </div>
              </WizardStepContainer>
            )}

            {/* STEP 2: AI SCOPING */}
            {step === 2 && (
              <WizardStepContainer>
                <div className="bg-card border-2 border-primary p-6 shadow-[6px_6px_0px_0px_var(--primary)] flex flex-col md:flex-row gap-6 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="w-16 h-16 shrink-0 bg-primary border-2 border-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_var(--foreground)]">
                    <BrainCircuit className="w-8 h-8 text-primary-foreground" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-heading font-black text-xl uppercase tracking-widest">
                        AI Scoping Assistant
                      </h3>
                      <p className="text-sm font-bold text-muted-foreground mt-1">
                        Let's translate your business goal into a technical
                        brief for experts.
                      </p>
                    </div>

                    <NeoFormField
                      form={form}
                      name="technicalScope"
                      type="textarea"
                      hideLabel
                      className="bg-secondary/10 text-sm min-h-[300px] p-4 focus-visible:ring-0 focus-visible:border-primary"
                    />

                    {!form.state.values.technicalScope && !isGenerating && (
                      <NeoButton
                        type="button"
                        variant="secondary"
                        onClick={handleGenerateScope}
                        className="h-12 px-6 w-fit"
                      >
                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                        {""}
                        Generate Technical Scope
                      </NeoButton>
                    )}

                    {isGenerating && (
                      <div className="space-y-3 pt-4 border-t-2 border-border border-dashed">
                        <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs">
                          <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                          Analyzing requirements...
                        </div>
                        <div className="h-4 bg-primary/20 w-3/4 rounded-none animate-pulse" />
                        <div className="h-4 bg-primary/20 w-1/2 rounded-none animate-pulse" />
                        <div className="h-4 bg-primary/20 w-5/6 rounded-none animate-pulse" />
                      </div>
                    )}

                    {form.state.values.technicalScope && (
                      <div className="space-y-4 pt-4 border-t-2 border-border border-dashed animate-in fade-in duration-500">
                        <div className="flex items-center gap-2 text-green-500 font-bold uppercase tracking-widest text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Scope Generated
                          Successfully
                        </div>
                        <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                          You can manually edit this technical scope above
                          before posting.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <WizardBackButton onClick={() => setStep(1)} />
                  <form.Subscribe
                    selector={(state) => [state.values.technicalScope]}
                    children={([technicalScope]) => (
                      <WizardNextButton
                        disabled={!technicalScope}
                        label="Next Step: Budget"
                        onClick={() => setStep(3)}
                      />
                    )}
                  />
                </div>
              </WizardStepContainer>
            )}

            {/* STEP 3: BUDGET & POST */}
            {step === 3 && (
              <WizardStepContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget Column */}
                  <WizardCard>
                    <WizardSectionTitle icon={DollarSign} title="Budget" />
                    <div className="space-y-6">
                      <NeoFormField
                        form={form}
                        name="type"
                        type="select"
                        label="Project Type"
                        placeholder="Select Type"
                        options={[
                          { label: "Fixed Price (Milestones)", value: "fixed" },
                          { label: "Hourly Rate", value: "hourly" },
                        ]}
                      />

                      <div>
                        <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                          Estimated Budget ($)
                        </label>
                        <div className="flex items-center gap-2">
                          <NeoFormField
                            form={form}
                            name="budgetMin"
                            validators={{
                              onChange: projectSchema.shape.budgetMin,
                            }}
                            type="number"
                            placeholder="Min"
                            hideLabel
                            className="focus-visible:border-primary h-12"
                          />
                          <span className="font-black text-muted-foreground">
                            -
                          </span>
                          <NeoFormField
                            form={form}
                            name="budgetMax"
                            validators={{
                              onChange: projectSchema.shape.budgetMax,
                            }}
                            type="number"
                            placeholder="Max"
                            hideLabel
                            className="focus-visible:border-primary h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </WizardCard>

                  {/* Timeline Column */}
                  <WizardCard>
                    <WizardSectionTitle icon={Calendar} title="Timeline" />
                    <div className="space-y-6">
                      {STEP3_TIMELINE_FIELDS.map(({ name, ...rest }) => (
                        <NeoFormField
                          key={name}
                          form={form}
                          name={name}
                          validators={{
                            onChange: (projectSchema.shape as any)[name],
                          }}
                          {...rest}
                        />
                      ))}
                    </div>
                  </WizardCard>
                </div>

                <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-border">
                  <WizardBackButton onClick={() => setStep(2)} />
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <NeoButton
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="border-4 h-16 px-10 text-lg group"
                      >
                        {isSubmitting
                          ? "Posting..."
                          : "Post Project to Marketplace"}
                        <Wand2 className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                      </NeoButton>
                    )}
                  />
                </div>
              </WizardStepContainer>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
