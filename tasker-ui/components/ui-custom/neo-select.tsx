import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const NeoSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, ...props }, ref) => (
  <SelectTrigger
    ref={ref}
    className={cn(
      "w-full rounded-none border-2 border-border h-12 shadow-[2px_2px_0px_0px_var(--border)] focus:shadow-[2px_2px_0px_0px_var(--primary)] focus:border-primary bg-background font-bold uppercase text-xs tracking-widest",
      className,
    )}
    {...props}
  />
));
NeoSelectTrigger.displayName = "NeoSelectTrigger";

const NeoSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => (
  <SelectContent
    ref={ref}
    className={cn(
      "border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] rounded-none bg-popover",
      className,
    )}
    {...props}
  />
));
NeoSelectContent.displayName = "NeoSelectContent";

const NeoSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn(
      "font-bold uppercase text-xs focus:bg-primary/20 rounded-none cursor-pointer",
      className,
    )}
    {...props}
  />
));
NeoSelectItem.displayName = "NeoSelectItem";

export {
  Select as NeoSelect,
  SelectGroup as NeoSelectGroup,
  SelectValue as NeoSelectValue,
  NeoSelectTrigger,
  NeoSelectContent,
  SelectLabel as NeoSelectLabel,
  NeoSelectItem,
  SelectSeparator as NeoSelectSeparator,
  SelectScrollUpButton as NeoSelectScrollUpButton,
  SelectScrollDownButton as NeoSelectScrollDownButton,
};
