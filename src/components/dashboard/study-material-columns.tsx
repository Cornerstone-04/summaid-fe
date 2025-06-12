import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  MoreVertical,
  Trash2,
  FileText,
  Book,
  AlignLeft,
} from "lucide-react";
import { JSX } from "react";
import { StudyMaterial } from "@/types";

export type Category = "Flashcards" | "Study Guide" | "Summary";

const categoryStyles: Record<Category, string> = {
  Flashcards:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Study Guide":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Summary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const icons: Record<Category, JSX.Element> = {
  Flashcards: <FileText className="h-4 w-4" />,
  "Study Guide": <Book className="h-4 w-4" />,
  Summary: <AlignLeft className="h-4 w-4" />,
};

export const studyMaterialColumns = (
  onEdit?: (material: StudyMaterial) => void,
  onDelete?: (material: StudyMaterial) => void
): ColumnDef<StudyMaterial>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "date",
    header: "Date Created",
  },
  {
    accessorKey: "categories",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.getValue("categories") as Category[];
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((category, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${categoryStyles[category]}`}
            >
              {icons[category]}
              <span className="ml-1">{category}</span>
            </span>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const material = row.original;
      return (
        <div
          className="flex justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(material);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit title
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(material);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
