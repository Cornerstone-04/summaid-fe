// summaid-fe/src/components/session/StudyToolsDisplaySection.tsx
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
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface DocumentProcessingPreferences {
  generateFlashcards: boolean;
  generateStudyGuide: boolean;
  generateSummary: boolean;
}

interface StudyToolsDisplaySectionProps {
  preferences: DocumentProcessingPreferences;
  sessionStatus: string;
}

export function StudyToolsDisplaySection({
  preferences,
  sessionStatus,
}: StudyToolsDisplaySectionProps) {
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
                  <CardTitle className="text-base">
                    Study Tools Status
                  </CardTitle>
                  <CardDescription className="text-sm text-balance text-start">
                    Status of AI tools for this session.
                  </CardDescription>
                </div>
                <ChevronDown className="size-5 transition-transform data-[state=open]:rotate-180" />
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <hr className="mx-3.5" />
        <CollapsibleContent>
          <CardContent className="flex-1 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <Label className="flex flex-col text-sm items-start gap-1">
                Generate Summary
                <span className="text-xs text-muted-foreground mt-1">
                  {preferences.generateSummary ? "Enabled" : "Disabled"}
                </span>
              </Label>
              <Switch checked={preferences.generateSummary} disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col text-sm items-start gap-1">
                Generate Flashcards
                <span className="text-xs text-muted-foreground mt-1">
                  {preferences.generateFlashcards ? "Enabled" : "Disabled"}
                </span>
              </Label>
              <Switch checked={preferences.generateFlashcards} disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col text-sm items-start gap-1">
                Generate Study Guide
                <span className="text-xs text-muted-foreground mt-1">
                  {preferences.generateStudyGuide ? "Enabled" : "Disabled"}
                </span>
              </Label>
              <Switch checked={preferences.generateStudyGuide} disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col text-sm items-start gap-1">
                Enable Chatbot
                <span className="text-xs text-muted-foreground mt-1">
                  Enabled
                </span>
              </Label>
              <Switch checked={true} disabled />
            </div>
            <hr className="my-2" />
            <div className="text-sm text-muted-foreground">
              Processing Status:{" "}
              <span
                className={`font-semibold ${
                  sessionStatus === "completed"
                    ? "text-green-500"
                    : sessionStatus === "processing"
                    ? "text-blue-500 animate-pulse"
                    : sessionStatus === "failed"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
              </span>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
