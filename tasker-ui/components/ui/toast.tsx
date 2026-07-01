"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function ToastViewport() {
  const { toasts, dismissToast } = useAppStore();
  return (
    <div className="fixed right-4 top-24 z-[80] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDone={() => dismissToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onDone }: { toast: { id: string; message: string; type: string }; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "rounded-lg border bg-surface-container-lowest p-4 shadow-glow",
        toast.type === "success" && "border-emerald-500/30",
        toast.type === "warning" && "border-tertiary/40",
        toast.type === "error" && "border-error/40",
        toast.type === "info" && "border-primary/30",
      )}
    >
      <p className="text-sm font-semibold text-on-surface">{toast.message}</p>
    </motion.div>
  );
}
