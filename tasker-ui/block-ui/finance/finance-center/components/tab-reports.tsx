import { PieChart, Download } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";

export interface TabReportsProps {
  budgetReports: any[];
}

export function TabReports({ budgetReports }: TabReportsProps) {
  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-4 border-b-2 border-border bg-secondary/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PieChart className="w-5 h-5 text-primary" />
          <div>
            <h3 className="uppercase tracking-widest font-black text-sm">
              Budget Utilization
            </h3>
            <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
              Breakdown by Project Space
            </p>
          </div>
        </div>
        <NeoButton
          variant="outline"
          className="text-xs h-10 px-4 w-full md:w-auto"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </NeoButton>
      </div>

      <div className="p-6">
        <div className="space-y-8">
          {budgetReports.map((report) => (
            <div
              key={report.id}
              className="border-2 border-border p-4 hover:bg-secondary/5 transition-colors group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                  <h4 className="font-heading font-black text-lg uppercase group-hover:text-primary transition-colors">
                    {report.name}
                  </h4>
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                    {report.id}
                  </span>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                      Budget
                    </span>
                    <span className="font-heading font-black">
                      {report.expected}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                      Spent
                    </span>
                    <span className="font-heading font-black text-destructive">
                      {report.spent}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                      Escrow
                    </span>
                    <span className="font-heading font-black text-[#E1801E]">
                      {report.escrow}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brutalist Progress Bar */}
              <div>
                <div className="flex justify-between text-[0.625rem] font-bold uppercase tracking-widest mb-1">
                  <span>Utilization</span>
                  <span
                    className={cn(
                      report.utilized >= 90
                        ? "text-destructive"
                        : "text-primary",
                    )}
                  >
                    {report.utilized}%
                  </span>
                </div>
                <div className="h-4 w-full border-2 border-border bg-secondary/30 relative">
                  <div
                    className={cn(
                      "h-full border-r-2 border-border",
                      report.utilized >= 90
                        ? "bg-destructive"
                        : report.utilized >= 75
                          ? "bg-[#E1801E]"
                          : "bg-primary",
                    )}
                    style={{ width: `${report.utilized}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
