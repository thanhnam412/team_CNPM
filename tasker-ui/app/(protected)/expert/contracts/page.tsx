"use client";

import { useState } from "react";
import { FileSignature, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { useContracts } from "@/tanstack/useContracts";

export default function ExpertContractsPage() {
  const { data: contracts = [], isLoading } = useContracts();

  const [filter, setFilter] = useState<"ALL" | "HELD" | "RELEASED">("ALL");

  const filteredContracts = contracts.filter((c) => {
    if (filter === "ALL") return true;
    return c.escrowStatus === filter;
  });

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      <NeoPageHeader
        className="z-20 relative"
        containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
        title="My Contracts"
        icon={<FileSignature className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
        description="Review and sign pending contracts. Funds are securely locked in Escrow once generated."
      />

      <div className="flex-1 overflow-y-auto p-6 bg-secondary/5">
        <div className="max-w-7xl mx-auto space-y-6 pb-24">
          
          {/* Filters */}
          <div className="flex gap-2 border-b-2 border-border pb-4">
            <NeoButton 
              variant={filter === "ALL" ? "default" : "outline"}
              onClick={() => setFilter("ALL")}
              className="text-xs h-8 px-4"
            >
              All
            </NeoButton>
            <NeoButton 
              variant={filter === "HELD" ? "default" : "outline"}
              onClick={() => setFilter("HELD")}
              className="text-xs h-8 px-4"
            >
              Active (Escrow Held)
            </NeoButton>
            <NeoButton 
              variant={filter === "RELEASED" ? "default" : "outline"}
              onClick={() => setFilter("RELEASED")}
              className="text-xs h-8 px-4"
            >
              Completed (Released)
            </NeoButton>
          </div>

          {isLoading ? (
            <div className="text-center p-8 text-muted-foreground uppercase font-bold tracking-widest text-xs">
              Loading Contracts...
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-border bg-card">
              <FileSignature className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="font-heading font-black uppercase tracking-widest mb-2">No Contracts Found</div>
              <p className="text-xs text-muted-foreground font-semibold">You don't have any contracts matching this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContracts.map((contract) => (
                <div 
                  key={contract.id} 
                  className={cn(
                    "bg-card border-2 p-6 transition-all",
                    contract.status === "DRAFT" 
                      ? "border-[#E1801E] shadow-[4px_4px_0px_0px_#E1801E]" 
                      : "border-border shadow-[4px_4px_0px_0px_var(--border)]"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <NeoBadge 
                      variant={contract.escrowStatus === "HELD" ? "default" : "secondary"}
                    >
                      {contract.escrowStatus}
                    </NeoBadge>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="font-heading font-black text-lg mb-2">
                    Contract Reference: #{contract.id.substring(0,8)}
                  </h3>
                  
                  <div className="text-xs font-semibold text-muted-foreground mb-6">
                    {contract.quickTaskId ? (
                      <span>For Quick Task: <strong className="text-foreground">{contract.quickTaskId}</strong></span>
                    ) : contract.projectId ? (
                      <span>For Project: <strong className="text-foreground">{contract.projectId}</strong></span>
                    ) : (
                      <span>Direct Contract</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 border-2 border-border bg-background">
                    <div>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Agreed Price
                      </div>
                      <div className="font-black text-lg text-primary">
                        {formatCurrency(contract.agreedPrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Escrow Status
                      </div>
                      <div className="font-bold text-xs uppercase flex items-center gap-1">
                        {contract.escrowStatus === "HELD" ? (
                          <><CheckCircle2 className="w-4 h-4 text-green-500" /> SECURED</>
                        ) : contract.escrowStatus === "PENDING" ? (
                          <><AlertCircle className="w-4 h-4 text-[#E1801E]" /> PENDING</>
                        ) : (
                          <>{contract.escrowStatus}</>
                        )}
                      </div>
                    </div>
                  </div>

                  {contract.escrowStatus === "HELD" && (
                    <div className="pt-4 border-t-2 border-border">
                      <div className="text-xs font-bold uppercase tracking-widest text-green-600 bg-green-500/10 p-2 border-2 border-green-500 text-center">
                        Contract is Active. Workspace unlocked.
                      </div>
                    </div>
                  )}
                  {contract.escrowStatus === "RELEASED" && (
                    <div className="pt-4 border-t-2 border-border">
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-secondary/50 p-2 border-2 border-border text-center">
                        Funds have been released. Task Completed.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
