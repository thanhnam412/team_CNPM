export interface MilestoneHeaderProps {
  totalBudget: string;
  totalPaid: string;
}

export function MilestoneHeader({
  totalBudget,
  totalPaid,
}: MilestoneHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-border pb-6">
      <div>
        <h2 className="text-2xl font-heading font-black uppercase tracking-widest">
          Milestones & Payments
        </h2>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
          Manage project phases and deliverables
        </p>
      </div>

      <div className="flex gap-4">
        <div className="text-right">
          <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
            Total Budget
          </div>
          <div className="font-heading font-black text-xl text-primary">
            {totalBudget}
          </div>
        </div>
        <div className="w-px bg-border h-10" />
        <div className="text-right">
          <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
            Paid
          </div>
          <div className="font-heading font-black text-xl text-green-600">
            {totalPaid}
          </div>
        </div>
      </div>
    </div>
  );
}
