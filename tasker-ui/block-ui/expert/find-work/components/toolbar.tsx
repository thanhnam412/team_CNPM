import { Search, Filter } from "lucide-react";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoInput } from "@/components/ui-custom/neo-input";

export interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}: ToolbarProps) {
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/20 border-b-2 border-border shrink-0">
      <div className="relative flex-1 w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
        <NeoInput
          placeholder="Search tasks by keyword or technology..."
          className="pl-9 h-10 focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <NeoSelect value={filter} onValueChange={(val) => onFilterChange(val || "all")}>
          <NeoSelectTrigger className="w-full sm:w-48 h-10 text-xs">
            <Filter className="w-4 h-4 mr-2" />
            <NeoSelectValue placeholder="Sort By" />
          </NeoSelectTrigger>
          <NeoSelectContent>
            <NeoSelectItem value="all" className="text-xs">
              Newest First
            </NeoSelectItem>
            <NeoSelectItem value="budget_high" className="text-xs text-warning">
              Highest Budget
            </NeoSelectItem>
            <NeoSelectItem value="deadline" className="text-xs text-red-600">
              Urgent Deadline
            </NeoSelectItem>
          </NeoSelectContent>
        </NeoSelect>
      </div>
    </div>
  );
}
