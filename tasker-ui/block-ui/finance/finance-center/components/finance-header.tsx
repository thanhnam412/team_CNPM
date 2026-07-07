import { Wallet, Plus } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface FinanceHeaderProps {
  onOpenDeposit: () => void;
}

export function FinanceHeader({ onOpenDeposit }: FinanceHeaderProps) {
  return (
    <NeoPageHeader
      className="relative z-10"
      containerClassName="max-w-7xl mx-auto w-full"
      title="Finance Center"
      icon={<Wallet className="w-8 h-8 text-primary" />}
      description="Global overview of your wallets, escrows, and spending"
      rightContent={
        <>
          <NeoButton
            variant="outline"
            className="flex-1 md:flex-none h-12 px-6"
          >
            Spending Report
          </NeoButton>
          <NeoButton
            onClick={onOpenDeposit}
            className="flex-1 md:flex-none h-12 px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> Deposit Funds
          </NeoButton>
        </>
      }
    />
  );
}
