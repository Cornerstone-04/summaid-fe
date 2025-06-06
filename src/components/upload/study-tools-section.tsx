import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface StudyToolsSectionProps {
  initialTool: string | null;
  preferences: {
    generateFlashcards: boolean;
    generateStudyGuide: boolean;
    generateSummary: boolean;
  };
  setPreferences: Dispatch<
    SetStateAction<{
      generateFlashcards: boolean;
      generateStudyGuide: boolean;
      generateSummary: boolean;
    }>
  >;
}

export function StudyToolsSection({
  initialTool,
  preferences,
  setPreferences,
}: StudyToolsSectionProps) {
  useEffect(() => {
    const newPreferences = {
      generateFlashcards: false,
      generateStudyGuide: false,
      generateSummary: false,
    };

    if (initialTool === "flashcards") {
      newPreferences.generateFlashcards = true;
      newPreferences.generateSummary = true;
    } else if (initialTool === "studyGuide") {
      newPreferences.generateStudyGuide = true;
      newPreferences.generateSummary = true;
    } else {
      newPreferences.generateSummary = true;
    }

    setPreferences(newPreferences);
  }, [initialTool, setPreferences]);

  const handleSummaryChange = (checked: boolean) => {
    if (
      !checked &&
      !preferences.generateFlashcards &&
      !preferences.generateStudyGuide
    ) {
      toast.warning(
        "You must select at least one content generation tool (Summary, Flashcards, or Study Guide)."
      );
      return;
    }
    setPreferences((prev) => ({ ...prev, generateSummary: checked }));
  };

  const handleFlashcardsChange = (checked: boolean) => {
    if (
      !checked &&
      !preferences.generateSummary &&
      !preferences.generateStudyGuide
    ) {
      toast.warning(
        "You must select at least one content generation tool (Summary, Flashcards, or Study Guide)."
      );
      setPreferences((prev) => ({
        ...prev,
        generateSummary: true,
        generateFlashcards: false,
      }));
      return;
    }
    setPreferences((prev) => ({ ...prev, generateFlashcards: checked }));
  };

  const handleStudyGuideChange = (checked: boolean) => {
    if (
      !checked &&
      !preferences.generateSummary &&
      !preferences.generateFlashcards
    ) {
      toast.warning(
        "You must select at least one content generation tool (Summary, Flashcards, or Study Guide)."
      );
      setPreferences((prev) => ({
        ...prev,
        generateSummary: true,
        generateStudyGuide: false,
      }));
      return;
    }
    setPreferences((prev) => ({ ...prev, generateStudyGuide: checked }));
  };

  return (
    <Collapsible defaultOpen={true}>
      <Card className="flex flex-col py-3.5! gap-3.5">
        <CardHeader className="px-3.5!">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-fit justify-between p-0 hover:bg-transparent"
            >
              <div className="flex items-center justify-between w-full word">
                <div className="flex flex-col items-start">
                  <CardTitle className="text-base">
                    Study Tools Available
                  </CardTitle>
                </div>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 transition-transform data-[state=open]:rotate-180" />
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <hr className="mx-3.5" />
        <CollapsibleContent>
          <CardContent className="flex-1 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="summary-switch"
                className="flex flex-col text-sm items-start gap-1"
              >
                Generate Summary
                <span className="text-muted-foreground mt-1">
                  Get a concise summary of your lecture content.
                </span>
              </Label>
              <Switch
                id="summary-switch"
                checked={preferences.generateSummary}
                onCheckedChange={handleSummaryChange}
                disabled={
                  preferences.generateSummary &&
                  !preferences.generateFlashcards &&
                  !preferences.generateStudyGuide
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="flashcards-switch"
                className="flex flex-col text-sm items-start gap-1"
              >
                Generate Flashcards
                <span className="text-muted-foreground mt-1">
                  Create interactive flashcards from your content.
                </span>
              </Label>
              <Switch
                id="flashcards-switch"
                checked={preferences.generateFlashcards}
                onCheckedChange={handleFlashcardsChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="study-guide-switch"
                className="flex flex-col text-sm items-start gap-1"
              >
                Generate Study Guide
                <span className="text-muted-foreground mt-1">
                  Get a structured study guide with key points.
                </span>
              </Label>
              <Switch
                id="study-guide-switch"
                checked={preferences.generateStudyGuide}
                onCheckedChange={handleStudyGuideChange}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
