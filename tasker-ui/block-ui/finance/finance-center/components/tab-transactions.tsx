import { Search, Filter } from "lucide-react";
import { NeoInput } from "@/components/ui-custom/neo-input";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { cn, formatCurrency } from "@/lib/utils";

export interface TabTransactionsProps {
  transactions: any[];
  isLoading: boolean;
}

export function TabTransactions({
  transactions,
  isLoading,
}: TabTransactionsProps) {
  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Filter Toolbar */}
      <div className="p-4 border-b-2 border-border bg-secondary/20 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <NeoInput
            placeholder="Search by ID, Description..."
            className="pl-9 h-10 focus-visible:"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <NeoSelect defaultValue="all">
            <NeoSelectTrigger className="w-full md:w-40 h-10 text-[0.625rem]">
              <Filter className="w-3 h-3 mr-2" />
              <NeoSelectValue placeholder="Type" />
            </NeoSelectTrigger>
            <NeoSelectContent>
              <NeoSelectItem value="all" className="text-[0.625rem]">
                All Types
              </NeoSelectItem>
              <NeoSelectItem value="deposit" className="text-[0.625rem]">
                Deposits
              </NeoSelectItem>
              <NeoSelectItem value="escrow" className="text-[0.625rem]">
                Escrow Locked
              </NeoSelectItem>
              <NeoSelectItem value="spent" className="text-[0.625rem]">
                Payouts/Spent
              </NeoSelectItem>
            </NeoSelectContent>
          </NeoSelect>

          <NeoSelect defaultValue="7days">
            <NeoSelectTrigger className="w-full md:w-40 h-10 text-[0.625rem]">
              <NeoSelectValue placeholder="Timeframe" />
            </NeoSelectTrigger>
            <NeoSelectContent>
              <NeoSelectItem value="7days" className="text-[0.625rem]">
                Last 7 Days
              </NeoSelectItem>
              <NeoSelectItem value="30days" className="text-[0.625rem]">
                Last 30 Days
              </NeoSelectItem>
              <NeoSelectItem value="all" className="text-[0.625rem]">
                All Time
              </NeoSelectItem>
            </NeoSelectContent>
          </NeoSelect>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b-2 border-border text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground">
              <th className="p-4 border-r-2 border-border min-w-[120px]">
                Date & ID
              </th>
              <th className="p-4 border-r-2 border-border min-w-[300px]">
                Description & Source
              </th>
              <th className="p-4 border-r-2 border-border min-w-[100px]">
                Type
              </th>
              <th className="p-4 border-r-2 border-border text-right min-w-[120px]">
                Amount
              </th>
              <th className="p-4 text-right min-w-[120px]">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border font-semibold text-sm">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground uppercase text-xs"
                >
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground uppercase text-xs"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx: any) => (
                <tr
                  key={tx.id}
                  className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                >
                  <td className="p-4 border-r-2 border-border">
                    <div className="flex flex-col">
                      <span className="text-xs">
                        {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[0.625rem] text-muted-foreground">
                        {new Date(tx.date || tx.createdAt).toLocaleTimeString()}
                      </span>
                      <span
                        className="text-[0.625rem] font-bold text-muted-foreground mt-1 truncate max-w-[100px]"
                        title={tx.id}
                      >
                        {tx.id.split("-")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 border-r-2 border-border">
                    <div className="font-bold uppercase tracking-wide text-xs mb-2 group-hover:text-primary transition-colors">
                      {tx.desc}
                    </div>
                    <div className="text-[0.625rem] uppercase tracking-widest px-2 py-0.5 border-2 border-border bg-background inline-block">
                      {tx.source || "System"}
                    </div>
                  </td>
                  <td className="p-4 border-r-2 border-border">
                    <div
                      className={cn(
                        "inline-flex items-center justify-center text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2 w-24",
                        tx.type === "DEPOSIT"
                          ? "bg-primary/10 border-primary text-primary"
                          : tx.type === "ESCROW"
                            ? "bg-[#E1801E]/10 border-[#E1801E] text-[#E1801E]"
                            : tx.type === "SPENT" || tx.type === "FEE"
                              ? "bg-destructive/10 border-destructive text-destructive"
                              : "bg-purple-500/10 border-purple-500 text-purple-600",
                      )}
                    >
                      {tx.type}
                    </div>
                  </td>
                  <td className="p-4 border-r-2 border-border text-right">
                    <span
                      className={cn(
                        "font-heading font-black tracking-wider text-base",
                        tx.type === "DEPOSIT" ||
                          tx.type === "REFUND" ||
                          tx.type === "PAYMENT_RECEIVED"
                          ? "text-primary"
                          : tx.type === "ESCROW"
                            ? "text-[#E1801E]"
                            : "text-destructive",
                      )}
                    >
                      {tx.type === "DEPOSIT" ||
                      tx.type === "REFUND" ||
                      tx.type === "PAYMENT_RECEIVED"
                        ? "+"
                        : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-heading font-black text-right text-foreground">
                      {formatCurrency(tx.balanceAfter)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
