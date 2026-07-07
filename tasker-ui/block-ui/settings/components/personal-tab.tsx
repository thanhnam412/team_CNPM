import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";

export interface PersonalTabProps {
  me: any;
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

export function PersonalTab({ me, formData, onInputChange }: PersonalTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section>
        <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
          Avatar
        </h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 border-4 border-foreground bg-primary flex items-center justify-center font-heading font-black text-4xl text-primary-foreground shadow-[4px_4px_0px_0px_var(--foreground)] overflow-hidden">
            {me?.avatar ? (
              <img
                src={me.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              formData.name.charAt(0).toUpperCase() || "U"
            )}
          </div>
          <div className="flex flex-col gap-2">
            <NeoButton
              variant="outline"
              className="rounded-none border-2 border-foreground h-10 font-bold uppercase tracking-widest text-xs"
            >
              Upload New
            </NeoButton>
            <NeoButton
              variant="ghost"
              className="rounded-none h-10 font-bold uppercase tracking-widest text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Remove
            </NeoButton>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
          Basic Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
              Display Name
            </label>
            <NeoInput
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="e.g. Alex Code"
              className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
            />
          </div>
        </div>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Email Address
          </label>
          <NeoInput
            value={me?.email || ""}
            readOnly
            disabled
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-secondary/30 font-bold h-12"
          />
        </div>

        <div>
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
            Timezone
          </label>
          <NeoInput
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            placeholder="e.g. Remote, UTC+07:00"
            className="rounded-none border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:border-primary focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] font-bold h-12"
          />
        </div>
      </section>
    </div>
  );
}
