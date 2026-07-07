import {
  ArrowDownRight,
  X,
  CreditCard,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";

import { useState } from "react";
import { useMockTopupMutation } from "@/tanstack/useFinance";
import { useGetMe } from "@/tanstack/useGetMe";
import { formatCurrency, parseDecimalInput } from "@/lib/utils";

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { data: me } = useGetMe();
  const topupMutation = useMockTopupMutation();
  const [amount, setAmount] = useState<string>("10000");

  const handleConfirm = () => {
    if (!me?.id || !amount) return;
    topupMutation.mutate(
      { userId: me.id, amount: Number(amount) },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const fee = numAmount * 0.029;
  const total = numAmount + fee;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="border-b-4 border-foreground p-6 flex justify-between items-center bg-secondary/30 shrink-0">
          <h2 className="font-heading font-black text-2xl uppercase tracking-widest flex items-center gap-3">
            <ArrowDownRight className="w-6 h-6 text-primary" /> Deposit Funds
          </h2>
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="border-transparent h-8 w-8"
          >
            <X className="w-5 h-5" />
          </NeoButton>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
              Select Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <NeoButton variant={amount === "5000" ? "default" : "outline"} onClick={() => setAmount("5000")}>$5K</NeoButton>
              <NeoButton variant={amount === "10000" ? "default" : "outline"} onClick={() => setAmount("10000")}>$10K</NeoButton>
              <NeoButton variant={amount === "50000" ? "default" : "outline"} onClick={() => setAmount("50000")}>$50K</NeoButton>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-black text-lg text-muted-foreground">
                $
              </span>
              <NeoInput
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseDecimalInput(e.target.value))}
                className="pl-10 h-14 font-heading text-xl focus-visible:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-4 p-4 border-2 border-primary bg-primary/5 shadow-[2px_2px_0px_0px_var(--primary)] cursor-pointer -translate-y-[2px]">
                <CreditCard className="w-6 h-6 text-primary" />
                <div className="flex-1">
                  <div className="font-bold text-sm uppercase">Credit Card</div>
                  <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                    Ending in 4242
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary/20 cursor-pointer">
                <Wallet className="w-6 h-6 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-bold text-sm uppercase">
                    Bank Transfer
                  </div>
                  <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                    Wire / ACH (No fees)
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-secondary/20 p-4 border-2 border-border">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Amount</span>
              <span>{formatCurrency(numAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold mb-2 text-muted-foreground">
              <span>Processing Fee (2.9%)</span>
              <span>{formatCurrency(fee)}</span>
            </div>
            <div className="flex justify-between font-black text-lg uppercase tracking-widest mt-4 pt-4 border-t-2 border-border">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex gap-4 shrink-0">
          <NeoButton
            variant="outline"
            className="flex-1 h-12"
            onClick={onClose}
          >
            Cancel
          </NeoButton>
          <NeoButton 
            className="flex-1 h-12 text-lg" 
            onClick={handleConfirm}
            disabled={topupMutation.isPending || numAmount <= 0}
          >
            {topupMutation.isPending ? "Processing..." : "Confirm Deposit"}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
