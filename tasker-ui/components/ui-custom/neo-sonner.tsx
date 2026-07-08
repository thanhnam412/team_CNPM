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
            "!w-[400px] !border-2 !shadow-[4px_4px_0px_0px_var(--foreground)] !rounded-none !font-black !uppercase !tracking-widest !p-4 flex gap-3 items-center " +
            "data-[type=default]:!bg-card data-[type=default]:!text-foreground data-[type=default]:!border-foreground " +
            "data-[type=error]:!bg-[#ffb3b3] data-[type=error]:!text-black data-[type=error]:!border-black " +
            "data-[type=success]:!bg-[#bbf7d0] data-[type=success]:!text-black data-[type=success]:!border-black " +
            "data-[type=warning]:!bg-[#fde047] data-[type=warning]:!text-black data-[type=warning]:!border-black " +
            "data-[type=info]:!bg-[#bfdbfe] data-[type=info]:!text-black data-[type=info]:!border-black",
          description: "!font-medium opacity-90",
          actionButton:
            "!bg-primary !text-primary-foreground !border-2 !border-foreground !rounded-none !font-black !uppercase",
          cancelButton:
            "!bg-muted !text-muted-foreground !border-2 !border-foreground !rounded-none !font-black !uppercase",
          icon: "[&>svg]:!w-6 [&>svg]:!h-6",
          title: "!font-black !text-base",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};

export { NeoToaster };
