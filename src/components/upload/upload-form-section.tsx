import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UploadFormSectionProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  maxFiles?: number;
}

export function UploadFormSection({
  files,
  setFiles,
  maxFiles = 5,
}: UploadFormSectionProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const mimeType = file.type;
        const supported = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];
        if (supported.includes(mimeType)) return true;

        toast.error(`Unsupported file: ${file.name}`);
        return false;
      });

      const newSelection = [...files, ...validFiles];
      if (newSelection.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} attachments allowed.`);
        setFiles([...files, ...validFiles.slice(0, maxFiles - files.length)]);
      } else {
        setFiles(newSelection);
      }
    },
    [files, maxFiles, setFiles]
  );

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
    toast.info(`Removed ${fileToRemove.name}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Collapsible defaultOpen>
      <Card className="flex flex-col gap-3.5 py-3.5">
        <CardHeader className="px-3.5">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 hover:bg-transparent"
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col text-start">
                  <CardTitle className="text-base">Data Sources</CardTitle>
                  <CardDescription className="text-sm">
                    Max of {maxFiles} attachments
                  </CardDescription>
                </div>
                <ChevronDown className="size-5 transition-transform data-[state=open]:rotate-180" />
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <hr className="mx-3.5" />

        <CollapsibleContent>
          <CardContent className="flex flex-col gap-4 px-3.5">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center min-h-[200px] p-6 sm:p-8 text-center cursor-pointer border-2 border-dashed rounded-xl transition-colors ${
                isDragActive
                  ? "border-sa-primary-accent bg-sa-primary/5"
                  : "border-border hover:border-sa-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="size-14 bg-[#F0F2F5] dark:bg-background rounded-full flex items-center justify-center p-3.5 mb-4">
                <UploadCloud className="text-muted-foreground dark:text-[#F0F2F5]" />
              </div>
              <p className="text-sm sm:text-base font-medium text-muted-foreground">
                <span className="text-red-500 font-bold">Click to upload</span>{" "}
                or drag and drop
              </p>
              {files.length > 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  ({files.length} / {maxFiles} files selected)
                </p>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex flex-col items-start">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate max-w-[200px]">
                              {file.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{file.name}</TooltipContent>
                        </Tooltip>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFile(file)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiles([])}
                  className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
