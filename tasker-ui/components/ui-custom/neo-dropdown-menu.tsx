import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const NeoDropdownMenu = DropdownMenu
const NeoDropdownMenuTrigger = DropdownMenuTrigger
const NeoDropdownMenuGroup = DropdownMenuGroup
const NeoDropdownMenuPortal = DropdownMenuPortal
const NeoDropdownMenuSub = DropdownMenuSub
const NeoDropdownMenuRadioGroup = DropdownMenuRadioGroup

const NeoDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    className={cn(
      "border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_var(--foreground)] bg-card p-1",
      className
    )}
    {...props}
  />
))
NeoDropdownMenuContent.displayName = (DropdownMenuContent as any).displayName

const NeoDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem>
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    inset={inset}
    className={cn(
      "rounded-none focus:bg-primary focus:text-primary-foreground font-bold tracking-widest uppercase text-xs cursor-pointer border-2 border-transparent focus:border-foreground mb-1 last:mb-0 transition-colors",
      className
    )}
    {...props}
  />
))
NeoDropdownMenuItem.displayName = (DropdownMenuItem as any).displayName

const NeoDropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuCheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItem>
>(({ className, ...props }, ref) => (
  <DropdownMenuCheckboxItem
    ref={ref}
    className={cn(
      "rounded-none focus:bg-primary focus:text-primary-foreground font-bold tracking-widest uppercase text-xs cursor-pointer border-2 border-transparent focus:border-foreground mb-1 last:mb-0",
      className
    )}
    {...props}
  />
))
NeoDropdownMenuCheckboxItem.displayName = (DropdownMenuCheckboxItem as any).displayName

const NeoDropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuRadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem>
>(({ className, ...props }, ref) => (
  <DropdownMenuRadioItem
    ref={ref}
    className={cn(
      "rounded-none focus:bg-primary focus:text-primary-foreground font-bold tracking-widest uppercase text-xs cursor-pointer border-2 border-transparent focus:border-foreground mb-1 last:mb-0",
      className
    )}
    {...props}
  />
))
NeoDropdownMenuRadioItem.displayName = (DropdownMenuRadioItem as any).displayName

const NeoDropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuLabel>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>
>(({ className, ...props }, ref) => (
  <DropdownMenuLabel
    ref={ref}
    className={cn(
      "font-black tracking-widest uppercase text-xs text-foreground/70",
      className
    )}
    {...props}
  />
))
NeoDropdownMenuLabel.displayName = (DropdownMenuLabel as any).displayName

const NeoDropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <DropdownMenuSeparator
    ref={ref}
    className={cn("bg-foreground h-[2px]", className)}
    {...props}
  />
))
NeoDropdownMenuSeparator.displayName = (DropdownMenuSeparator as any).displayName

const NeoDropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <DropdownMenuShortcut
      className={cn(
        "opacity-100 font-bold",
        className
      )}
      {...props}
    />
  )
}
NeoDropdownMenuShortcut.displayName = "NeoDropdownMenuShortcut"

const NeoDropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuSubContent
    ref={ref}
    className={cn(
      "border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_var(--foreground)] bg-card p-1",
      className
    )}
    {...props}
  />
))
NeoDropdownMenuSubContent.displayName = (DropdownMenuSubContent as any).displayName

const NeoDropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuSubTrigger
    ref={ref}
    inset={inset}
    className={cn(
      "rounded-none focus:bg-primary focus:text-primary-foreground font-bold tracking-widest uppercase text-xs cursor-pointer border-2 border-transparent focus:border-foreground mb-1 last:mb-0",
      className
    )}
    {...props}
  />
))
NeoDropdownMenuSubTrigger.displayName = (DropdownMenuSubTrigger as any).displayName

export {
  NeoDropdownMenu,
  NeoDropdownMenuTrigger,
  NeoDropdownMenuContent,
  NeoDropdownMenuItem,
  NeoDropdownMenuCheckboxItem,
  NeoDropdownMenuRadioItem,
  NeoDropdownMenuLabel,
  NeoDropdownMenuSeparator,
  NeoDropdownMenuShortcut,
  NeoDropdownMenuGroup,
  NeoDropdownMenuPortal,
  NeoDropdownMenuSub,
  NeoDropdownMenuSubContent,
  NeoDropdownMenuSubTrigger,
  NeoDropdownMenuRadioGroup,
}
