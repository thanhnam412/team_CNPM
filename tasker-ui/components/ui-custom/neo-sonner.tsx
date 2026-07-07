"use client";

import { Toaster as BaseToaster } from "@/components/ui/sonner";
import { type ToasterProps } from "sonner";

const NeoToaster = ({ toastOptions, ...props }: ToasterProps) => {
  return (
    <BaseToaster
      position="top-right"
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast:
            "!w-[400px] !bg-card !text-foreground !border-2 !border-foreground !shadow-[4px_4px_0px_0px_var(--foreground)] !rounded-none !font-black !uppercase !tracking-widest !p-4 flex gap-3 items-center",
          description: "!text-muted-foreground !font-medium",
          actionButton:
            "!bg-primary !text-primary-foreground !border-2 !border-foreground !rounded-none !font-black !uppercase",
          cancelButton:
            "!bg-muted !text-muted-foreground !border-2 !border-foreground !rounded-none !font-black !uppercase",
          icon: "!text-foreground [&>svg]:!w-6 [&>svg]:!h-6",
          title: "!font-black !text-base",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};

export { NeoToaster };
