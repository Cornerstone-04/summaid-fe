import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileTextIcon } from "lucide-react";

import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface FileDetail {
  fileName: string;
  cloudStorageUrl: string;
  mimeType: string;
  size: number;
  publicId?: string;
}

interface DocumentListSectionProps {
  files: FileDetail[];
}

export function DocumentListSection({ files }: DocumentListSectionProps) {
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
                    Attached documents for this study session.
                  </CardDescription>
                </div>
                <ChevronDown className="size-5 transition-transform data-[state=open]:rotate-180" />
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <hr className="mx-3.5" />
        <CollapsibleContent>
          <CardContent className="flex-1 flex flex-col gap-4 px-3.5">
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {files.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No files uploaded for this session.
                </p>
              ) : (
                files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex flex-col items-start">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-2">
                            <FileTextIcon className="w-4 h-4 text-sa-primary shrink-0" />
                            <span className="truncate max-w-[250px]">
                              {file.fileName}
                            </span>
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          <span>{file.fileName}</span>
                        </TooltipContent>
                      </Tooltip>

                      <span className="text-xs text-muted-foreground">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
