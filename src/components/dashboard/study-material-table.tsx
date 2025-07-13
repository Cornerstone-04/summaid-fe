import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { studyMaterialColumns } from "./study-material-columns";
import { Category, SessionDocument, StudyMaterial } from "@/types";
import { useUpdateSessionTitle } from "@/hooks/useUpdateSessionTitle";
import { useDeleteSession } from "@/hooks/useDeleteSession";

interface StudyMaterialsTableProps {
  viewMode: "grid" | "table";
  sortBy: "recent" | "title";
  sessions: SessionDocument[];
}

export function StudyMaterialTable({
  viewMode,
  sortBy,
  sessions,
}: StudyMaterialsTableProps) {
  const [query, setQuery] = useState("");
  const [editItem, setEditItem] = useState<StudyMaterial | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [deleteItem, setDeleteItem] = useState<StudyMaterial | null>(null);

  const navigate = useNavigate();
  const updateSessionTitle = useUpdateSessionTitle();
  const deleteSession = useDeleteSession();

  // Helper to convert SessionDocument to a format compatible with StudyMaterial
  const mapSessionToStudyMaterial = (
    session: SessionDocument
  ): StudyMaterial => {
    const displayName = session.title || session.id;

    const categories: Category[] = [];
    if (session.preferences.generateSummary) categories.push("Summary");
    if (session.preferences.generateFlashcards) categories.push("Flashcards");
    if (session.preferences.generateStudyGuide) categories.push("Study Guide");

    // Add status category based on session status
    if (session.status === "completed") categories.push("Processed");
    else if (session.status === "processing" || session.status === "pending")
      categories.push("Pending");
    else if (
      session.status === "failed" ||
      session.status === "completed_with_errors"
    )
      categories.push("Error");

    return {
      id: session.id,
      name: displayName,
      date: session.created_at
        ? new Date(session.created_at).toLocaleDateString()
        : "N/A",
      categories: categories,
      status: session.status,
    };
  };

  const filtered = useMemo(() => {
    const mappedSessions = sessions.map(mapSessionToStudyMaterial);

    return mappedSessions
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) =>
        sortBy === "recent"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : a.name.localeCompare(b.name)
      );
  }, [query, sortBy, sessions]);

  const handleEdit = useCallback((material: StudyMaterial) => {
    setEditItem(material);
    setEditedTitle(material.name);
    toast.info(
      "Edit functionality is a placeholder. Implement Supabase update."
    );
  }, []);

  const handleDelete = useCallback((material: StudyMaterial) => {
    console.log("Delete clicked for:", material.name);
    setDeleteItem(material);
    toast.info(
      "Delete functionality is a placeholder. Implement Supabase delete."
    );
  }, []);

  const columns = useMemo(
    () => studyMaterialColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const table = useReactTable<StudyMaterial>({
    data: filtered,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleSave() {
    if (!editItem || editedTitle.trim() === "") return;

    updateSessionTitle.mutate({
      sessionId: editItem.id,
      newTitle: editedTitle.trim(),
    });

    setEditItem(null);
  }

  function handleConfirmDelete() {
    if (!deleteItem) return;
    deleteSession.mutate(deleteItem.id);
    setDeleteItem(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center md:justify-start items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 w-full rounded-full"
          />
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="rounded-md border overflow-x-auto">
          <Table className="rounded-2xl">
            <TableHeader className="bg-sa-primary">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-[#FAFCFF]!">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => navigate(`/session/${row.original.id}`)}
                  className="cursor-pointer hover:bg-accent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow transition cursor-pointer"
              onClick={() => navigate(`/session/${item.id}`)}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <div onClick={(e) => e.stopPropagation()}>
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
                            handleEdit(item);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit title
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.date}</p>
                <div className="flex flex-wrap gap-1">
                  {item.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 bg-muted rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editItem && (
        <Dialog
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Title</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditItem(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  updateSessionTitle.isPending || editedTitle.trim() === ""
                }
              >
                {updateSessionTitle.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {deleteItem && (
        <Dialog
          open={!!deleteItem}
          onOpenChange={(open) => !open && setDeleteItem(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div>
              Are you sure you want to delete "{deleteItem.name}"? This action
              cannot be undone.
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeleteItem(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteSession.isPending}
              >
                {deleteSession.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
