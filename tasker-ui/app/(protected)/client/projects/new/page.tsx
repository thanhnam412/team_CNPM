"use client";

import { useState, useEffect } from "react";
import {
  Rocket,
  Wand2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BrainCircuit,
  FileCode2,
  DollarSign,
  Calendar,
  Sparkles,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScope, setGeneratedScope] = useState("");

  const handleGenerateScope = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedScope(
        "## Technical Scope & Architecture\\n\\n" +
          "Based on your requirements, here is the recommended technical approach:\\n\\n" +
          "### 1. Data Pipeline\\n" +
          "- **Ingestion:** Setup a secure ETL pipeline to pull daily records from AWS S3.\\n" +
          "- **Preprocessing:** Use Pandas/Dask for data cleaning and handling missing values.\\n\\n" +
          "### 2. Machine Learning Model\\n" +
          "- **Algorithm:** XGBoost or Random Forest for baseline churn prediction.\\n" +
          "- **Metrics:** Focus on F1-Score and ROC-AUC due to class imbalance.\\n\\n" +
          "### 3. Deployment\\n" +
          "- Containerize the inference API using Docker and FastAPI.\\n" +
          "- Deploy to an existing Kubernetes cluster or AWS SageMaker.",
      );
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Header & Progress Bar */}
      <div className="bg-card border-b-2 border-border p-6 md:p-8 shrink-0 relative z-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
            <Rocket className="w-8 h-8 md:w-10 md:h-10 text-primary" /> Post a
            Project
          </h1>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
            Let our AI assistant help you scope and define your technical
            requirements.
          </p>

          {/* Blocky Progress Bar */}
          <div className="flex items-center mt-8 gap-2">
            {[
              { num: 1, label: "Basics" },
              { num: 2, label: "AI Scoping" },
              { num: 3, label: "Budget & Post" },
            ].map((s, i) => (
              <div key={s.num} className="flex-1 flex flex-col gap-2">
                <div
                  className={cn(
                    "h-4 border-2 transition-all duration-300",
                    step > s.num
                      ? "bg-primary border-foreground"
                      : step === s.num
                        ? "bg-primary border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                        : "bg-secondary border-border",
                  )}
                />
                <span
                  className={cn(
                    "text-[0.625rem] font-black uppercase tracking-widest",
                    step >= s.num ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  STEP {s.num}: {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto pb-20">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-secondary/10 border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="space-y-6">
                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Project Title
                    </label>
                    <NeoInput
                      placeholder="e.g., Build a Customer Churn Prediction Model"
                      className="focus-visible:border-primary focus-visible: h-14 text-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      AI Specialty
                    </label>
                    <NeoSelect>
                      <NeoSelectTrigger className="w-full h-12 bg-background text-sm">
                        <NeoSelectValue placeholder="Select Category" />
                      </NeoSelectTrigger>
                      <NeoSelectContent className="">
                        <NeoSelectItem value="llm" className="text-xs">
                          LLM & GenAI
                        </NeoSelectItem>
                        <NeoSelectItem value="cv" className="text-xs">
                          Computer Vision
                        </NeoSelectItem>
                        <NeoSelectItem value="mlops" className="text-xs">
                          MLOps & Deployment
                        </NeoSelectItem>
                        <NeoSelectItem value="data" className="text-xs">
                          Predictive Analytics / Data
                        </NeoSelectItem>
                      </NeoSelectContent>
                    </NeoSelect>
                  </div>

                  <div>
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Business Goal (In your own words)
                    </label>
                    <NeoTextarea
                      placeholder="Describe what you want to achieve. Don't worry about the technical details, our AI will help you with that in the next step."
                      className="focus-visible:border-primary focus-visible: font-semibold text-sm min-h-[150px] p-4"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <NeoButton onClick={() => setStep(2)} className="h-14 px-8">
                  Next Step: AI Scoping <ArrowRight className="w-5 h-5 ml-2" />
                </NeoButton>
              </div>
            </div>
          )}

          {/* STEP 2: AI SCOPING */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
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
                      Let's translate your business goal into a technical brief
                      for experts.
                    </p>
                  </div>

                  {!generatedScope && !isGenerating && (
                    <NeoButton
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

                  {generatedScope && (
                    <div className="space-y-4 pt-4 border-t-2 border-border border-dashed animate-in fade-in duration-500">
                      <div className="flex items-center gap-2 text-green-500 font-bold uppercase tracking-widest text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Scope Generated
                        Successfully
                      </div>
                      <NeoTextarea
                        defaultValue={generatedScope}
                        className="bg-secondary/10 text-sm min-h-[300px] p-4 focus-visible:ring-0 focus-visible:border-primary"
                      />
                      <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                        You can manually edit this technical scope before
                        posting.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <NeoButton
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-14 px-8"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </NeoButton>
                <NeoButton
                  disabled={!generatedScope}
                  onClick={() => setStep(3)}
                  className="h-14 px-8"
                >
                  Next Step: Budget <ArrowRight className="w-5 h-5 ml-2" />
                </NeoButton>
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET & POST */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Column */}
                <div className="bg-secondary/10 border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)]">
                  <h3 className="font-heading font-black text-lg uppercase tracking-widest flex items-center gap-2 mb-6">
                    <DollarSign className="w-5 h-5 text-primary" /> Budget
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                        Project Type
                      </label>
                      <NeoSelect defaultValue="fixed">
                        <NeoSelectTrigger className="w-full h-12 bg-background text-sm">
                          <NeoSelectValue placeholder="Select Type" />
                        </NeoSelectTrigger>
                        <NeoSelectContent className="">
                          <NeoSelectItem value="fixed" className="text-xs">
                            Fixed Price (Milestones)
                          </NeoSelectItem>
                          <NeoSelectItem value="hourly" className="text-xs">
                            Hourly Rate
                          </NeoSelectItem>
                        </NeoSelectContent>
                      </NeoSelect>
                    </div>

                    <div>
                      <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                        Estimated Budget ($)
                      </label>
                      <div className="flex items-center gap-2">
                        <NeoInput
                          placeholder="Min"
                          type="number"
                          className="focus-visible:border-primary h-12"
                        />
                        <span className="font-black text-muted-foreground">
                          -
                        </span>
                        <NeoInput
                          placeholder="Max"
                          type="number"
                          className="focus-visible:border-primary h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Column */}
                <div className="bg-secondary/10 border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)]">
                  <h3 className="font-heading font-black text-lg uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-primary" /> Timeline
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                        Expected Duration
                      </label>
                      <NeoSelect defaultValue="medium">
                        <NeoSelectTrigger className="w-full h-12 bg-background text-sm">
                          <NeoSelectValue placeholder="Select Duration" />
                        </NeoSelectTrigger>
                        <NeoSelectContent className="">
                          <NeoSelectItem value="short" className="text-xs">
                            Less than 1 month
                          </NeoSelectItem>
                          <NeoSelectItem value="medium" className="text-xs">
                            1 to 3 months
                          </NeoSelectItem>
                          <NeoSelectItem value="long" className="text-xs">
                            More than 3 months
                          </NeoSelectItem>
                        </NeoSelectContent>
                      </NeoSelect>
                    </div>

                    <div>
                      <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                        Expert Commitment
                      </label>
                      <NeoSelect defaultValue="part">
                        <NeoSelectTrigger className="w-full h-12 bg-background text-sm">
                          <NeoSelectValue placeholder="Select Commitment" />
                        </NeoSelectTrigger>
                        <NeoSelectContent className="">
                          <NeoSelectItem value="part" className="text-xs">
                            Part-time (10-30 hrs/week)
                          </NeoSelectItem>
                          <NeoSelectItem value="full" className="text-xs">
                            Full-time (40+ hrs/week)
                          </NeoSelectItem>
                        </NeoSelectContent>
                      </NeoSelect>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-border">
                <NeoButton
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="h-14 px-8"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </NeoButton>

                <Link href="/client/projects">
                  <NeoButton className="border-4 h-16 px-10 text-lg group">
                    Post Project to Marketplace{""}
                    <Wand2 className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                  </NeoButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
