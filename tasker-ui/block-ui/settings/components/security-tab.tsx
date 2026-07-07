import { Shield } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";

export function SecurityTab() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="space-y-5">
        <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
          Password
        </h2>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Current Password
          </label>
          <NeoInput
            type="password"
            placeholder="••••••••"
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
          />
        </div>
        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            New Password
          </label>
          <NeoInput
            type="password"
            placeholder="••••••••"
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
          />
        </div>
        <NeoButton
          variant="outline"
          className="rounded-none border-2 border-foreground h-10 font-bold uppercase tracking-widest text-xs"
        >
          Update Password
        </NeoButton>
      </section>

      <section className="space-y-5 mt-12">
        <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Two-Factor Authentication
        </h2>
        <div className="bg-card border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_var(--foreground)] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm uppercase">Authenticator App</h3>
            <p className="text-xs font-bold text-muted-foreground mt-1">
              Protect your account with an extra layer of security.
            </p>
          </div>
          <NeoButton className="rounded-none border-2 border-foreground bg-primary text-primary-foreground h-10 font-black uppercase tracking-widest text-xs shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-0.5">
            Enable 2FA
          </NeoButton>
        </div>
      </section>
    </div>
  );
}
