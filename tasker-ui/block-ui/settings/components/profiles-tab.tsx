import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { parseDecimalInput } from "@/lib/utils";

export interface ProfilesTabProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function ProfilesTab({ formData, onInputChange }: ProfilesTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-secondary/10 border-2 border-border p-4 mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
          Your account operates in dual-role mode. Configure how you appear to
          others when acting as a Client versus an Expert.
        </p>
      </div>

      <section className="space-y-5">
        <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6 text-primary">
          Expert Profile
        </h2>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Professional Title
          </label>
          <NeoInput
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="e.g. Senior AI / Python Engineer"
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
          />
        </div>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Hourly Rate ($)
          </label>
          <NeoInput
            value={parseDecimalInput(formData.rate)}
            onChange={(e) =>
              onInputChange("rate", parseDecimalInput(e.target.value))
            }
            placeholder="45"
            type="number"
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-heading font-black text-xl h-12 w-32"
          />
        </div>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Bio / About Me
          </label>
          <NeoTextarea
            value={formData.bio}
            onChange={(e) => onInputChange("bio", e.target.value)}
            placeholder="I am a Senior AI Engineer specializing in..."
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-semibold text-sm min-h-[120px]"
          />
        </div>
      </section>

      <section className="space-y-5 mt-12 pt-8 border-t-4 border-foreground border-dashed">
        <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
          Client Profile
        </h2>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Company Name (Optional)
          </label>
          <NeoInput
            placeholder="e.g. Acme Corp"
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
          />
        </div>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Billing Address
          </label>
          <NeoTextarea
            placeholder="Enter your business address for invoices"
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-semibold text-sm min-h-[80px]"
          />
        </div>
      </section>
    </div>
  );
}
