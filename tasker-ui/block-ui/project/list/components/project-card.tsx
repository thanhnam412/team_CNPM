import Link from "next/link";
import { Clock, Wallet, CheckCircle2, ArrowRight } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn, formatCurrency } from "@/lib/utils";

export interface ProjectCardProps {
  project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all flex flex-col cursor-pointer group">
      {/* Top Banner with Status */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-border bg-secondary/10 px-6 py-3">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "text-xs font-black uppercase tracking-widest px-3 py-1 border-2",
              project.status === "ACTIVE"
                ? "border-green-500 text-green-500 bg-green-500/10"
                : "border-muted-foreground text-muted-foreground",
            )}
          >
            {project.status}
          </span>
          {project.endDate && (
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center">
              <Clock className="w-3 h-3 mr-1" />{" "}
              {new Date(project.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="p-6 flex flex-col md:flex-row gap-6 justify-between">
        <div className="flex-1">
          <h3 className="font-heading font-black text-2xl uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm font-semibold text-muted-foreground max-w-3xl break-words line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="w-full md:w-64 shrink-0 flex flex-col justify-between border-t-2 md:border-t-0 md:border-l-2 border-border pt-6 md:pt-0 md:pl-6">
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Budget
              </p>
              <div className="flex items-center gap-2 text-foreground font-heading font-black text-xl">
                <Wallet className="w-5 h-5 text-primary" /> {formatCurrency(project.budget || 0)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href={`/client/projects/${project.id}`}>
              <NeoButton className="w-full text-xs">
                Manage Project <ArrowRight className="w-3 h-3 ml-2" />
              </NeoButton>
            </Link>

            {project.status === "Review" && (
              <NeoButton
                variant="outline"
                className="w-full border-purple-500 text-purple-600 bg-purple-500/10 text-[0.625rem]"
              >
                <CheckCircle2 className="w-3 h-3 mr-2" /> Review Delivery
              </NeoButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
