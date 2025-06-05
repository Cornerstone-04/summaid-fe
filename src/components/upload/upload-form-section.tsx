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
import {
  UploadCloud,
  FileText,
  XCircle,
  Trash2,
  ChevronDown,
} from "lucide-react";
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
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" || // .pptx
          mimeType === "application/msword" || // .doc
          mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // .docx
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
      <Card className="flex flex-col">
        <CardHeader className="border-b border-border/50">
          {" "}
          {/* Adjusted padding */}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between px-0 hover:bg-transparent"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                  <CardTitle className="text-base sm:text-lg">
                    Upload Documents
                  </CardTitle>{" "}
                  {/* Adjusted font size */}
                  <CardDescription className="text-xs sm:text-sm text-balance text-start">
                    {" "}
                    {/* Adjusted font size */}
                    Max of {maxFiles} attachments. Supports PDF, DOCX, PPTX, and
                    Images.
                  </CardDescription>
                </div>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 transition-transform data-[state=open]:rotate-180" />{" "}
                {/* Adjusted icon size */}
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="flex-1 flex flex-col p-3 sm:p-4 gap-3 sm:gap-4">
            {" "}
            {/* Adjusted padding and gap */}
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed ${
                isDragActive
                  ? "border-sa-primary-accent bg-sa-primary/5"
                  : "border-border"
              } rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-sa-primary/50 transition-colors flex flex-col items-center justify-center`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mb-3 sm:mb-4" />{" "}
              {/* Adjusted icon size */}
              {isDragActive ? (
                <p className="text-base sm:text-lg font-medium text-muted-foreground">
                  Drop the files here ...
                </p>
              ) : (
                <p className="text-base sm:text-lg font-medium text-muted-foreground">
                  <span className="text-sa-primary font-bold">
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
                {" "}
                {/* Adjusted gap */}
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  {" "}
                  {/* Adjusted font size */}
                  Selected Files ({files.length}):
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 sm:p-3 border rounded-lg bg-muted/30 shadow-sm"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {" "}
                        {/* Adjusted gap */}
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-sa-primary shrink-0" />{" "}
                        {/* Adjusted icon size */}
                        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {file.name}
                        </span>{" "}
                        {/* Adjusted font size */}
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file)}
                        className="text-muted-foreground hover:text-destructive shrink-0 size-7 sm:size-8"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                        {/* Adjusted icon size */}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiles([])}
                  className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 text-sm" // Adjusted font size
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
