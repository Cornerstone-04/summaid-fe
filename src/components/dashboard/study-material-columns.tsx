import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil, // Keep Pencil for the dropdown, though it's optional if you prefer just text
  MoreVertical,
  Trash2,
  Mic,
  FileText,
  Book,
} from "lucide-react";
import { JSX } from "react";

export type Category = "Audio Recap" | "Flashcard Set" | "Note Explain";

export type StudyMaterial = {
  id: string;
  name: string;
  date: string;
  categories: Category[];
};

const categoryStyles: Record<Category, string> = {
  "Audio Recap":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Flashcard Set":
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Note Explain":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const icons: Record<Category, JSX.Element> = {
  "Audio Recap": <Mic className="h-4 w-4" />,
  "Flashcard Set": <FileText className="h-4 w-4" />,
  "Note Explain": <Book className="h-4 w-4" />,
};

export const studyMaterialColumns = (
  onEdit?: (material: StudyMaterial) => void, // onEdit function from parent
  onDelete?: (material: StudyMaterial) => void // Add onDelete if you plan to handle delete via prop
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
          onClick={(e) => e.stopPropagation()} // Crucial: Stop click from bubbling to TableRow
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Ensure dropdown trigger also stops propagation if it's separate */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()} // Stop click from propagating further than the button
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Stop click from propagating out of the dropdown item
                  onEdit?.(material);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit title
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={(e) => {
                  e.stopPropagation(); // Stop click from propagating out of the dropdown item
                  onDelete?.(material); // Call onDelete
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
