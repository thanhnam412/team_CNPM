import { Lock, FileSignature } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function ActiveEscrow({ contracts = [] }: { contracts?: any[] }) {
  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
      <h3 className="uppercase tracking-widest font-black text-sm mb-6 flex items-center gap-2 border-b-2 border-border pb-4">
        <Lock className="w-4 h-4 text-[#E1801E]" /> Active Escrow Contracts
      </h3>

      <div className="space-y-4">
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-bold text-sm uppercase tracking-widest border-2 border-dashed border-border">
            No active escrow contracts
          </div>
        ) : (
          contracts.map((contract: any) => (
            <div
              key={contract.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-2 border-border bg-secondary/20 hover:border-primary/50 transition-colors"
            >
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-primary" /> {contract.milestoneName}
                </h4>
                <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                  Expert: {contract.expertName} • Started: {new Date(contract.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xl font-heading font-black text-[#E1801E] tracking-wider">
                  {formatCurrency(Number(contract.agreedPrice))}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
