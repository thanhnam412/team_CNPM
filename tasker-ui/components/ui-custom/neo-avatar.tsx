import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NeoAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar>
>(({ className, ...props }, ref) => (
  <Avatar
    ref={ref}
    className={cn(
      "rounded-none border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]",
      className,
    )}
    {...props}
  />
));
NeoAvatar.displayName = "NeoAvatar";

const NeoAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarImage>,
  React.ComponentPropsWithoutRef<typeof AvatarImage>
>(({ className, ...props }, ref) => (
  <AvatarImage
    ref={ref}
    className={cn("rounded-none object-cover", className)}
    {...props}
  />
));
NeoAvatarImage.displayName = "NeoAvatarImage";

const NeoAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarFallback>,
  React.ComponentPropsWithoutRef<typeof AvatarFallback>
>(({ className, ...props }, ref) => (
  <AvatarFallback
    ref={ref}
    className={cn(
      "rounded-none bg-primary text-primary-foreground font-black uppercase tracking-widest",
      className,
    )}
    {...props}
  />
));
NeoAvatarFallback.displayName = "NeoAvatarFallback";

export { NeoAvatar, NeoAvatarImage, NeoAvatarFallback };
