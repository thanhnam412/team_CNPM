import { CreditCard, Plus, Lock, Bell, Trash2 } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCheckbox } from "@/components/ui-custom/neo-checkbox";

export function TabSettings() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Methods */}
        <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
          <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Payment Methods
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-primary bg-primary/5 shadow-[2px_2px_0px_0px_var(--primary)] -translate-y-[1px]">
              <div className="w-12 h-8 bg-secondary border-2 border-border flex items-center justify-center font-black text-xs">
                VISA
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="font-bold text-sm uppercase">
                  Visa ending in 4242
                </div>
                <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                  Expires 12/28 • Default
                </div>
              </div>
              <div className="flex gap-2">
                <NeoButton
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-destructive text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </NeoButton>
              </div>
            </div>

            <NeoButton
              variant="outline"
              className="w-full border-dashed h-12 text-xs"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Payment Method
            </NeoButton>
          </div>
        </div>

        {/* Automation & Escrow */}
        <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
          <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E1801E]" /> Escrow Automation
          </h3>

          <div className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <NeoCheckbox
                id="auto-escrow"
                defaultChecked
                className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <div>
                <label
                  htmlFor="auto-escrow"
                  className="font-bold text-sm uppercase cursor-pointer block"
                >
                  Auto-Fund Escrow on Task Accept
                </label>
                <p className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest mt-1">
                  Automatically deduct from Wallet or charge Default Payment
                  Method when you accept an expert's proposal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6 h-fit">
        <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-foreground" /> Notifications
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="notif-payout"
              className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer"
            >
              Payout Successful
            </label>
            <NeoCheckbox id="notif-payout" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="notif-low"
              className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer"
            >
              Low Wallet Balance
            </label>
            <NeoCheckbox id="notif-low" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="notif-action"
              className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer text-[#E1801E]"
            >
              Action Required (Escrow)
            </label>
            <NeoCheckbox
              id="notif-action"
              defaultChecked
              className="border-[#E1801E] data-[state=checked]:bg-[#E1801E] data-[state=checked]:text-white"
            />
          </div>

          <NeoButton className="w-full mt-4 text-[0.625rem]">
            Save Preferences
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
