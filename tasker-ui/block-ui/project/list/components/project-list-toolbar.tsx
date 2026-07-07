import { Search, Filter } from "lucide-react";
import { NeoInput } from "@/components/ui-custom/neo-input";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";

export interface ProjectListToolbarProps {
  filter: string;
  onFilterChange: (val: string) => void;
}

export function ProjectListToolbar({
  filter,
  onFilterChange,
}: ProjectListToolbarProps) {
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/20 shrink-0">
      <div className="relative flex-1 w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <NeoInput
          placeholder="Search projects..."
          className="pl-9 h-10 focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
        />
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <NeoSelect
          value={filter}
          onValueChange={(val) => onFilterChange(val || "all")}
        >
          <NeoSelectTrigger className="w-full sm:w-48 h-10 text-xs">
            <Filter className="w-4 h-4 mr-2" />
            <NeoSelectValue placeholder="Filter Status" />
          </NeoSelectTrigger>
          <NeoSelectContent>
            <NeoSelectItem value="all" className="text-xs">
              All Projects
            </NeoSelectItem>
            <NeoSelectItem value="open" className="text-xs text-warning">
              Open
            </NeoSelectItem>
            <NeoSelectItem value="progress" className="text-xs text-blue-600">
              In Progress
            </NeoSelectItem>
            <NeoSelectItem value="review" className="text-xs text-purple-600">
              Review
            </NeoSelectItem>
            <NeoSelectItem value="completed" className="text-xs">
              Completed
            </NeoSelectItem>
          </NeoSelectContent>
        </NeoSelect>
      </div>
    </div>
  );
}
