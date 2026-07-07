import { History, AlertCircle, Download, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FinanceTabsProps {
  activeTab: string;
  onChangeTab: (tabId: string) => void;
  payoutsCount?: number;
}

const TABS = [
  { id: "transactions", label: "Transaction History", icon: History },
  { id: "payouts", label: "Pending Payouts", icon: AlertCircle },
  { id: "reports", label: "Budget Reports", icon: Download },
  { id: "settings", label: "Settings", icon: CreditCard },
];

export function FinanceTabs({
  activeTab,
  onChangeTab,
  payoutsCount = 0,
}: FinanceTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b-2 border-border overflow-x-auto no-scrollbar pt-4">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 border-2 border-transparent uppercase font-bold tracking-widest text-xs transition-all whitespace-nowrap outline-none",
              isActive
                ? "border-border border-b-background bg-background text-primary translate-y-[2px] shadow-[0px_-2px_0px_0px_var(--primary)_inset]"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-b-transparent hover:border-border/50",
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {tab.id === "payouts" && payoutsCount > 0 && (
              <span className="ml-2 bg-purple-500 text-white text-[0.625rem] px-1.5 py-0.5 font-black rounded-none">
                {payoutsCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
