"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Wallet, Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  useProjectFinance,
  useAddFundsMutation,
} from "@/tanstack/useProjects";
import { formatCurrency } from "@/lib/utils";
import { ProjectFinanceBlock } from "@/block-ui/project/detail/finance";

export default function ProjectFinancePage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: financeData, isLoading } = useProjectFinance(projectId);

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const addFundsMutation = useAddFundsMutation();

  const form = useForm({
    defaultValues: { amount: 100 },
    onSubmit: async ({ value }) => {
      addFundsMutation.mutate(
        { projectId, amount: value.amount },
        {
          onSuccess: () => {
            setIsAddFundsOpen(false);
            form.reset();
          },
        },
      );
    },
  });

  const stats = [
    {
      title: "Total Budget",
      value: formatCurrency(financeData?.budget || 0),
      icon: Wallet,
      color: "text-foreground",
    },
    {
      title: "Escrow (Locked)",
      value: formatCurrency(financeData?.escrow || 0),
      icon: Lock,
      color: "text-[#E1801E]",
    },
    {
      title: "Spent",
      value: formatCurrency(financeData?.spent || 0),
      icon: ArrowUpRight,
      color: "text-destructive",
    },
    {
      title: "Available",
      value: formatCurrency(
        Number(financeData?.budget || 0) -
          Number(financeData?.spent || 0) -
          Number(financeData?.escrow || 0),
      ),
      icon: ArrowDownRight,
      color: "text-primary",
    },
  ];

  const transactions = financeData?.transactions || [];

  return (
    <ProjectFinanceBlock
      stats={stats}
      transactions={transactions}
      isLoading={isLoading}
      isAddFundsOpen={isAddFundsOpen}
      onOpenAddFunds={() => setIsAddFundsOpen(true)}
      onCloseAddFunds={() => setIsAddFundsOpen(false)}
      form={form}
    />
  );
}
