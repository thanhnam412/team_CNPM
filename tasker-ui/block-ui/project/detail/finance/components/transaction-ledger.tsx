import { History, Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn, formatCurrency } from "@/lib/utils";

export interface TransactionLedgerProps {
  transactions: any[];
  isLoading: boolean;
}

export function TransactionLedger({
  transactions,
  isLoading,
}: TransactionLedgerProps) {
  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
      <div className="p-6 border-b-2 border-border bg-secondary/30 flex justify-between items-center">
        <h3 className="uppercase tracking-widest font-black text-sm flex items-center gap-2">
          <History className="w-4 h-4" /> Transaction Ledger
        </h3>
        <NeoButton variant="ghost" className="text-xs h-8">
          View All
        </NeoButton>
      </div>

      <div className="divide-y-2 divide-border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground uppercase text-xs font-bold">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground uppercase text-xs font-bold">
            No transactions yet.
          </div>
        ) : (
          transactions.map((tx: any) => (
            <div
              key={tx.id}
              className="p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-none border-2 border-border flex items-center justify-center shrink-0",
                    tx.type === "ESCROW"
                      ? "bg-[#E1801E]/20 text-[#E1801E]"
                      : tx.type === "SPENT" || tx.type === "FEE"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary",
                  )}
                >
                  {tx.type === "ESCROW" ? (
                    <Lock className="w-4 h-4" />
                  ) : tx.type === "SPENT" || tx.type === "FEE" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-1">
                    {tx.desc}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                    <span className="hidden sm:inline">•</span>
                    <span title={tx.id}>{tx.id.split("-")[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[0.625rem] font-bold uppercase tracking-widest border-2 border-border px-2 py-0.5 bg-background">
                  {tx.source || "System"}
                </span>
                <span
                  className={cn(
                    "font-heading font-black tracking-wider text-sm",
                    tx.type === "DEPOSIT" ||
                      tx.type === "REFUND" ||
                      tx.type === "PAYMENT_RECEIVED"
                      ? "text-primary"
                      : "text-foreground",
                  )}
                >
                  {tx.type === "DEPOSIT" ||
                  tx.type === "REFUND" ||
                  tx.type === "PAYMENT_RECEIVED"
                    ? "+"
                    : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
