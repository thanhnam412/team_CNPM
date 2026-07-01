import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ActiveUserPermissionAlert() {
  return (
    <Card className="relative w-full max-w-md overflow-hidden shadow-lg border-border mx-auto">
      {/* Warning Header Pattern */}
      <div className="h-1.5 w-full bg-destructive" />
      
      <div className="p-6">
        {/* Icon and Title */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 mt-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3" id="modal-title">
              Xác nhận thay đổi quyền hạn
            </h2>
            
            {/* Main Warning Message */}
            <div className="bg-muted/40 rounded-lg p-4 mb-6 border border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                User is currently active. Updating permissions will require the user
                to re-login to apply changes.
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
          <Button variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="destructive" className="w-full sm:w-auto shadow-sm">
            Confirm &amp; Force Re-login
          </Button>
        </div>
      </div>
    </Card>
  );
}
