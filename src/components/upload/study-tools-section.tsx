// src/components/upload/StudyToolsSection.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useEffect } from "react";
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
  setPreferences: React.Dispatch<
    React.SetStateAction<{
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
      <Card className="flex flex-col">
        <CardHeader className="border-b border-border/50">
          
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between px-0 hover:bg-transparent"
            >
              <div className="flex items-center justify-between w-full word">
                <div className="flex flex-col items-start">
                  <CardTitle className="text-base sm:text-lg">
                    Study Tools Available
                  </CardTitle>{" "}
                  {/* Adjusted font size */}
                  <CardDescription className="text-xs sm:text-sm text-balance text-start">
                    {" "}
                    {/* Adjusted font size */}
                    Select AI tools to generate for this session based on your
                    documents.
                  </CardDescription>
                </div>
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 transition-transform data-[state=open]:rotate-180" />{" "}
                {/* Adjusted icon size */}
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="flex-1 flex flex-col gap-4 sm:gap-5 p-3 sm:p-4">
            {" "}
            {/* Adjusted padding and gap */}
            {/* Generate Summary */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor="summary-switch"
                className="flex flex-col text-base"
              >
                Generate Summary
                <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {" "}
                  {/* Adjusted font size */}
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
            <Separator />
            {/* Generate Flashcards */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor="flashcards-switch"
                className="flex flex-col text-base"
              >
                Generate Flashcards
                <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {" "}
                  {/* Adjusted font size */}
                  Create interactive flashcards from your content.
                </span>
              </Label>
              <Switch
                id="flashcards-switch"
                checked={preferences.generateFlashcards}
                onCheckedChange={handleFlashcardsChange}
              />
            </div>
            <Separator />
            {/* Generate Study Guide */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor="study-guide-switch"
                className="flex flex-col text-base"
              >
                Generate Study Guide
                <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {" "}
                  {/* Adjusted font size */}
                  Get a structured study guide with key points.
                </span>
              </Label>
              <Switch
                id="study-guide-switch"
                checked={preferences.generateStudyGuide}
                onCheckedChange={handleStudyGuideChange}
              />
            </div>
            <Separator />
            {/* Enable Chatbot (Always on) */}
            <div className="flex items-center justify-between">
              <Label
                htmlFor="chatbot-switch"
                className="flex flex-col text-base"
              >
                Enable Chatbot
                <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {" "}
                  {/* Adjusted font size */}
                  Interact with AI for further learning and clarifications.
                </span>
              </Label>
              <Switch id="chatbot-switch" checked={true} disabled />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
