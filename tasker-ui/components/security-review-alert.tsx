import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export function SecurityReviewAlert() {
  return (
    <Card className="max-w-[480px] w-full overflow-hidden flex flex-col shadow-xl border-border mx-auto">
      {/* Top Error Bar */}
      <div className="h-1.5 w-full bg-destructive" />

      <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-6">
        {/* Icon Container with Pulse effect */}
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center animate-pulse mb-1 shrink-0">
          <ShieldAlert className="w-8 h-8" strokeWidth={2.5} />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Review needed
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your post contains restricted contact information. To protect your
            privacy and security, please remove any email addresses or phone
            numbers before publishing.
          </p>
        </div>

        {/* Contextual Snippet (Highlighting the error) */}
        <div className="w-full bg-muted/40 rounded-lg border border-destructive/20 p-4 text-left flex flex-col items-start gap-1">
          <span className="text-xs text-muted-foreground font-mono bg-destructive/5 py-1 px-2 rounded inline-block break-all">
            ...contact me directly at
          </span>
          <span className="text-xs text-destructive font-mono font-medium bg-destructive/10 px-2 py-1 rounded inline-block break-all">
            john.doe@personal-email.com
          </span>
          <span className="text-xs text-muted-foreground font-mono bg-destructive/5 py-1 px-2 rounded inline-block break-all">
            to apply, or call...
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-muted/40 px-6 py-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-auto">
        <Button variant="outline" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button className="w-full sm:w-auto shadow-sm">Edit Post</Button>
      </div>
    </Card>
  );
}
