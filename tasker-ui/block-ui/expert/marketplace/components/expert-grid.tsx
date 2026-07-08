import { useState } from "react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { ExpertCard } from "./expert-card";

export interface ExpertGridProps {
  experts: any[];
  savedExperts: Record<string, boolean>;
  onToggleSave: (id: string) => void;
  onInvite: (expert: any) => void;
}

export function ExpertGrid({
  experts,
  savedExperts,
  onToggleSave,
  onInvite,
}: ExpertGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(experts.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExperts = experts.slice(startIndex, startIndex + itemsPerPage);

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background relative z-10">
      <div className="max-w-7xl mx-auto pb-24">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-black uppercase tracking-widest text-lg">
            Showing {Math.min(startIndex + 1, experts.length)} - {Math.min(startIndex + itemsPerPage, experts.length)} of {experts.length} Experts
          </h2>
          <div className="flex gap-2">
            <NeoButton variant="outline" className="h-8 px-3 text-[0.625rem]">
              Saved ({Object.values(savedExperts).filter(Boolean).length})
            </NeoButton>
          </div>
        </div>

        {/* Grid of Expert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              isSaved={!!savedExperts[expert.id]}
              onToggleSave={onToggleSave}
              onInvite={onInvite}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2 items-center">
              <NeoButton 
                variant="outline" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-xs h-10 px-6"
              >
                Previous
              </NeoButton>
              
              {getVisiblePages().map((page, idx) => (
                typeof page === "number" ? (
                  <NeoButton
                    key={idx}
                    variant="outline"
                    onClick={() => handlePageChange(page)}
                    className={`text-xs h-10 w-10 p-0 ${
                      currentPage === page ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]" : ""
                    }`}
                  >
                    {page}
                  </NeoButton>
                ) : (
                  <span key={idx} className="font-bold tracking-widest text-muted-foreground px-2">
                    ...
                  </span>
                )
              ))}

              <NeoButton 
                variant="outline" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-xs h-10 px-6"
              >
                Next
              </NeoButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
