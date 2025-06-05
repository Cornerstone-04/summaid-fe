import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Grid2X2, List, Check, ChevronDown } from "lucide-react";

type ViewMode = "grid" | "table";
type SortOption = "recent" | "title";

interface StudyMaterialControlsProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function StudyMaterialControls({
  viewMode,
  onViewChange,
  sort,
  onSortChange,
}: StudyMaterialControlsProps) {
  return (
    <div className="flex flex-row gap-4 justify-between items-start md:items-center mb-6">
      {/* Grid/Table Toggle */}
      <div className="relative flex w-fit rounded-full bg-muted overflow-hidden border border-border dark:border-gray-700">
        {/* Sliding highlight */}
        <div
          className={`absolute top-0 bottom-0 w-1/2 transition-all duration-300 rounded-full bg-primary/10 ${
            viewMode === "table" ? "left-1/2" : "left-0"
          }`}
        />

        {/* Grid Button */}
        <Button
          onClick={() => onViewChange("grid")}
          variant="ghost"
          size="icon"
          className="relative z-10 min-w-[64px] px-4 py-2 text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
        >
          <Grid2X2 className="w-4 h-4" />
          {viewMode === "grid" && <Check className="w-4 h-4 text-primary" />}
        </Button>

        {/* Table Button */}
        <Button
          onClick={() => onViewChange("table")}
          variant="ghost"
          size="icon"
          className="relative z-10 min-w-[64px] px-4 py-2 text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
        >
          <List className="w-4 h-4" />
          {viewMode === "table" && <Check className="w-4 h-4 text-primary" />}
        </Button>
      </div>

      {/* Sorting Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full text-sm flex items-center justify-between gap-1"
          >
            {sort === "recent" ? "Most recent" : "Title"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuItem onClick={() => onSortChange("recent")}>
            {sort === "recent" && (
              <Check className="w-4 h-4 mr-2 text-primary" />
            )}
            Most recent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("title")}>
            {sort === "title" && (
              <Check className="w-4 h-4 mr-2 text-primary" />
            )}
            Title
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
