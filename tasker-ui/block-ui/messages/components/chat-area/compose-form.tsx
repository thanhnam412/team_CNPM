import { Paperclip, Send } from "lucide-react";
import { ReactFormExtendedApi } from "@tanstack/react-form";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";

export interface ComposeFormProps {
  form: ReactFormExtendedApi<any>;
}

export function ComposeForm({ form }: ComposeFormProps) {
  return (
    <div className="p-4 bg-card border-t-2 border-border shrink-0 z-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex items-end gap-2 md:gap-3 max-w-5xl mx-auto">
          <div className="flex flex-col gap-2 shrink-0 pb-1 hidden sm:flex">
            <NeoButton
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </NeoButton>
          </div>

          <div className="flex-1 relative">
            <form.Field
              name="content"
              children={(field) => (
                <NeoTextarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit();
                    }
                  }}
                  placeholder="Type a message... (Markdown supported)"
                  className="min-h-[52px] max-h-[200px] resize-y focus-visible: text-sm font-semibold p-3"
                />
              )}
            />
          </div>

          <form.Subscribe
            selector={(state) => ({
              content: state.values.content,
              isSubmitting: state.isSubmitting,
            })}
            children={({ content, isSubmitting }) => (
              <NeoButton
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="h-[52px] px-4 md:px-6 shrink-0"
              >
                <Send className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Send</span>
              </NeoButton>
            )}
          />
        </div>
      </form>
      <div className="mt-2 text-center hidden sm:block">
        <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
          Pro Tip: Use{""}
          <strong className="text-foreground">```</strong> for code blocks or
          drop files directly here.
        </span>
      </div>
    </div>
  );
}
