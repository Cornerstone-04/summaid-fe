import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      const newFiles = acceptedFiles.filter((file) => {
        const mimeType = file.type;
        if (
          mimeType === "application/pdf" ||
          mimeType ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
          mimeType === "application/msword" ||
          mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          mimeType.startsWith("image/")
        ) {
          return true;
        }
        toast.error(`File type not supported for ${file.name}.`);
        return false;
      });

      if (files.length + newFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} attachments allowed per session.`);
        setFiles((prevFiles) => [
          ...prevFiles,
          ...newFiles.slice(0, maxFiles - prevFiles.length),
        ]);
      } else {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    },
    [files, maxFiles, setFiles]
  );

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    toast.info(`Removed ${fileToRemove.name}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Collapsible defaultOpen={true}>
      <Card className="flex flex-col py-3.5! gap-3.5">
        <CardHeader className="px-3.5!">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-fit justify-between p-0 hover:bg-transparent"
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col items-start">
                  <CardTitle className="text-base">Data Sources</CardTitle>
                  <CardDescription className="text-sm text-balance text-start">
                    Max of {maxFiles} attachments.
                  </CardDescription>
                </div>
                <ChevronDown className="size-5 transition-transform data-[state=open]:rotate-180" />{" "}
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <hr className="mx-3.5" />
        <CollapsibleContent>
          <CardContent className="flex-1 flex flex-col px-3.5 gap-3 sm:gap-4">
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed ${
                isDragActive
                  ? "border-sa-primary-accent bg-sa-primary/5"
                  : "border-border"
              } rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-sa-primary/50 transition-colors flex flex-col items-center justify-center min-h-[200px]`}
            >
              <input {...getInputProps()} />
              <div className="size-14 rounded-full bg-[#F0F2F5] dark:bg-background p-3.5 flex justify-center items-center mb-4">
                <UploadCloud className="text-muted-foreground dark:text-[#F0F2F5]" />{" "}
              </div>
              {isDragActive ? (
                <p className="text-base sm:text-lg font-medium text-sa-primary">
                  Drop the files here ...
                </p>
              ) : (
                <p className="text-sm sm:text-base font-medium text-muted-foreground">
                  <span className="text-red-500 font-bold">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
              )}
              {files.length > 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  ({files.length} / {maxFiles} files selected)
                </p>
              )}
            </div>
            {files.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex flex-col items-start">
                        <span className="truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
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
                  <Trash2 className="w-4 h-4 mr-2" /> Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
