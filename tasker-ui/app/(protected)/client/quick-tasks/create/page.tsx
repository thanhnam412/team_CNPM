"use client";

import { useState } from "react";
import {
  Zap,
  TerminalSquare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CreateQuickTaskPage() {
  const [bounty, setBounty] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [taskContent, setTaskContent] = useState("");

  const handleAutoSuggest = () => {
    if (!taskContent) return;
    setIsSuggesting(true);
    setTimeout(() => {
      setIsSuggesting(false);
      setBounty("150"); // AI Suggested Bounty
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="bg-[#E1801E] border-b-4 border-foreground p-6 md:p-8 shrink-0 relative z-20">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
              <Zap className="w-8 h-8 md:w-10 md:h-10 fill-white" /> Post a
              Quick Task
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-90">
              Got a bug? Need a script? Post it as a Quick Task and get it
              solved today.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
        <div className="max-w-3xl mx-auto pb-20 space-y-8">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] p-6 md:p-8">
            <div className="space-y-8">
              {/* Task Title */}
              <div>
                <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                  Task Title
                </label>
                <NeoInput
                  placeholder="e.g., Fix CUDA out of memory error in PyTorch"
                  className="focus-visible:border-foreground focus-visible: h-14 text-lg"
                />
              </div>

              {/* Task Description / Terminal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block">
                    Description or Error Log
                  </label>
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <TerminalSquare className="w-3 h-3" /> Terminal Mode
                  </span>
                </div>
                <div className="relative border-2 border-foreground bg-secondary/10 shadow-[4px_4px_0px_0px_var(--foreground)] p-1">
                  <div className="bg-foreground flex items-center gap-2 px-3 py-2 border-b-2 border-foreground mb-1">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-[#E1801E]" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[0.5rem] font-mono text-background/50 ml-2 uppercase font-bold tracking-widest">
                      bash / error_log.txt
                    </span>
                  </div>
                  <NeoTextarea
                    value={taskContent}
                    onChange={(e) => setTaskContent(e.target.value)}
                    placeholder="Paste your code snippet, error log, or task description here..."
                    className="border-none text-sm min-h-[250px] p-4 focus-visible:ring-0 resize-none"
                  />
                </div>
              </div>

              {/* Bounty Section */}
              <div className="pt-8 border-t-2 border-border border-dashed">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="flex-1">
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      Set Bounty (Fixed Reward)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-black text-xl text-muted-foreground">
                        $
                      </span>
                      <NeoInput
                        type="number"
                        value={bounty}
                        onChange={(e) => setBounty(e.target.value)}
                        placeholder="0.00"
                        className="pl-8 h-16 font-heading text-2xl focus-visible:ring-0 focus-visible:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-start shrink-0 mb-1">
                    <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Not sure how much?
                    </span>
                    <NeoButton
                      onClick={handleAutoSuggest}
                      disabled={isSuggesting || !taskContent}
                      variant="outline"
                      className="h-10 text-[0.625rem] w-full sm:w-auto"
                    >
                      {isSuggesting ? (
                        "Analyzing..."
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-2" /> Auto-Suggest
                          Bounty
                        </>
                      )}
                    </NeoButton>
                  </div>
                </div>

                {bounty === "150" && !isSuggesting && (
                  <div className="mt-4 flex items-center gap-2 text-[0.625rem] font-bold text-green-600 uppercase tracking-widest bg-green-500/10 border border-green-500 p-2">
                    <CheckCircle2 className="w-4 h-4" /> Based on market rates
                    for similar CUDA debugging tasks, $150 is the optimal bounty
                    for a fast resolution (under 2 hours).
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <Link href="/client/quick-tasks">
              <NeoButton variant="ghost" className="h-12 px-6 w-full sm:w-auto">
                Cancel
              </NeoButton>
            </Link>

            <Link href="/client/quick-tasks" className="w-full sm:w-auto">
              <NeoButton className="w-full border-4 bg-[#E1801E] text-white h-16 px-12 text-lg hover:-translate-y-1  active:translate-y-1  flex items-center justify-center">
                Launch Task <Zap className="w-6 h-6 ml-3 fill-white" />
              </NeoButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
