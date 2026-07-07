import Link from "next/link";
import { Wallet } from "lucide-react";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoWidgetHeader } from "@/components/ui-custom/neo-widget-header";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface FinanceSnapshotWidgetProps {
  availableBalance: string;
  inEscrow: string;
  spentMTD: string;
}

export function FinanceSnapshotWidget({
  availableBalance,
  inEscrow,
  spentMTD,
}: FinanceSnapshotWidgetProps) {
  return (
    <NeoCard className="lg:col-span-1 p-6 flex flex-col">
      <NeoWidgetHeader
        title="Finance"
        icon={<Wallet className="w-5 h-5 text-primary" />}
        href="/client/finance"
        linkText="View All"
      />

      <div className="space-y-4 flex-1">
        <div>
          <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Available Balance
          </div>
          <div className="font-heading font-black text-3xl md:text-4xl">
            {availableBalance}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border border-dashed">
          <div>
            <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              In Escrow
            </div>
            <div className="font-heading font-black text-lg text-warning">
              {inEscrow}
            </div>
          </div>
          <div>
            <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Spent (MTD)
            </div>
            <div className="font-heading font-black text-lg">{spentMTD}</div>
          </div>
        </div>
      </div>

      <Link href="/client/finance?tab=deposit" className="mt-6">
        <NeoButton variant="outline" className="w-full h-10">
          Deposit Funds
        </NeoButton>
      </Link>
    </NeoCard>
  );
}
