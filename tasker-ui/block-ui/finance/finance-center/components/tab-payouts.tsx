import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCheckbox } from "@/components/ui-custom/neo-checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";

export interface TabPayoutsProps {
  pendingPayouts: any[];
}

export function TabPayouts({ pendingPayouts }: TabPayoutsProps) {
  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-4 border-b-2 border-border bg-purple-500/10 flex items-center justify-between">
        <div>
          <h3 className="uppercase tracking-widest font-black text-sm text-purple-600">
            Pending Approvals
          </h3>
          <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mt-1">
            Review work and release funds to experts
          </p>
        </div>
        <NeoButton className="h-10 px-4 text-xs">Approve Selected (0)</NeoButton>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b-2 border-border text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground">
              <th className="p-4 border-r-2 border-border w-10 text-center">
                <NeoCheckbox />
              </th>
              <th className="p-4 border-r-2 border-border min-w-[200px]">
                Expert
              </th>
              <th className="p-4 border-r-2 border-border min-w-[300px]">
                Task / Milestone
              </th>
              <th className="p-4 border-r-2 border-border min-w-[150px]">
                Deadline
              </th>
              <th className="p-4 border-r-2 border-border text-right min-w-[120px]">
                Amount
              </th>
              <th className="p-4 text-center min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border font-semibold text-sm">
            {pendingPayouts.map((po) => (
              <tr
                key={po.id}
                className="hover:bg-secondary/10 transition-colors"
              >
                <td className="p-4 border-r-2 border-border text-center">
                  <NeoCheckbox />
                </td>
                <td className="p-4 border-r-2 border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 flex items-center justify-center font-bold text-xs uppercase border-2 border-border shrink-0 overflow-hidden">
                      {po.avatar?.startsWith("http") ? (
                        <img src={po.avatar} alt={po.expert} className="w-full h-full object-cover" />
                      ) : (
                        po.avatar || "U"
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs uppercase">
                        {po.expert}
                      </div>
                      <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                        {po.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 border-r-2 border-border">
                  <div className="font-bold uppercase tracking-wide text-xs">
                    {po.task}
                  </div>
                </td>
                <td className="p-4 border-r-2 border-border">
                  <div
                    className={cn(
                      "text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2 inline-block",
                      po.deadline.includes("Action")
                        ? "bg-destructive/10 text-destructive border-destructive"
                        : "bg-[#E1801E]/10 text-[#E1801E] border-[#E1801E]",
                    )}
                  >
                    {po.deadline}
                  </div>
                </td>
                <td className="p-4 border-r-2 border-border text-right">
                  <span className="font-heading font-black tracking-wider text-base text-foreground">
                    {formatCurrency(po.amount)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Link href={`/client/quick-tasks/${po.quickTaskId}`}>
                    <NeoButton
                      variant="outline"
                      className="text-[0.625rem] h-8 bg-primary/10 w-full"
                    >
                      Review Work
                    </NeoButton>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
