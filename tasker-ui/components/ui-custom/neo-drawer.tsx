import * as React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent as BaseSheetContent,
  SheetHeader as BaseSheetHeader,
  SheetFooter as BaseSheetFooter,
  SheetTitle as BaseSheetTitle,
  SheetDescription as BaseSheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { NeoButton } from "./neo-button";

export { Sheet as NeoDrawer, SheetTrigger as NeoDrawerTrigger, SheetClose as NeoDrawerClose };

export function NeoDrawerContent({
  className,
  children,
  side = "left",
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof BaseSheetContent>) {
  return (
    <BaseSheetContent
      side={side}
      showCloseButton={false}
      className={cn(
        "bg-card border-foreground p-0 flex flex-col h-full",
        side === "left" ? "border-r-4 shadow-[12px_0_0_0_var(--foreground)] w-full sm:!max-w-3xl" : "",
        side === "right" ? "border-l-4 shadow-[-12px_0_0_0_var(--foreground)] w-full sm:!max-w-3xl" : "",
        side === "top" ? "border-b-4 shadow-[0_12px_0_0_var(--foreground)]" : "",
        side === "bottom" ? "border-t-4 shadow-[0_-12px_0_0_var(--foreground)]" : "",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetClose
          render={
            <NeoButton
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 bg-secondary/30 border-2"
            />
          }
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      )}
    </BaseSheetContent>
  );
}

export function NeoDrawerHeader({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheetHeader>) {
  return (
    <BaseSheetHeader
      className={cn(
        "p-6 border-b-4 border-foreground bg-secondary/30 shrink-0",
        className
      )}
      {...props}
    />
  );
}

export function NeoDrawerFooter({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheetFooter>) {
  return (
    <BaseSheetFooter
      className={cn(
        "p-6 border-t-4 border-foreground bg-secondary/30 flex sm:justify-end gap-4 shrink-0",
        className
      )}
      {...props}
    />
  );
}

export function NeoDrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheetTitle>) {
  return (
    <BaseSheetTitle
      className={cn(
        "font-heading font-black text-2xl uppercase tracking-widest",
        className
      )}
      {...props}
    />
  );
}

export function NeoDrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseSheetDescription>) {
  return (
    <BaseSheetDescription
      className={cn(
        "text-xs font-bold text-muted-foreground uppercase tracking-widest",
        className
      )}
      {...props}
    />
  );
}
