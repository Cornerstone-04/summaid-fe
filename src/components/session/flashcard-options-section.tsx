// src/components/session/flashcard-options-section.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the props interface for FlashcardOptions
interface FlashcardOptionsProps {
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number; // 0 if Flashquiz Questions is off, otherwise a positive number (e.g., 5)
  numOptions: number;   // 0 if Answer Options is off, otherwise a positive number (e.g., 4)

  onDifficultyChange: (value: "easy" | "medium" | "hard") => void;
  onNumQuestionsToggle: (enabled: boolean) => void;
  onNumOptionsToggle: (enabled: boolean) => void;
  isSendingMessage: boolean; // Added this prop
}

export default function FlashcardOptions({
  difficulty,
  numQuestions,
  numOptions,
  onDifficultyChange,
  onNumQuestionsToggle,
  onNumOptionsToggle,
  isSendingMessage, // Destructure the new prop
}: FlashcardOptionsProps) {
  const isFlashquizEnabled = numQuestions > 0;
  const isAnswerOptionsEnabled = numOptions > 0;

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
                    Flashcards Preference
                  </CardTitle>
                </div>
                <ChevronDown className="size-5 transition-transform data-[state=open]:rotate-180" />
              </div>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <hr className="mx-3.5" />
        <CollapsibleContent>
          <CardContent className="flex-1 flex flex-col gap-5">
            <div className="grid gap-4">
              <p>Intensity Level</p>
              <div>
                <div>
                  <RadioGroup
                    value={difficulty}
                    onValueChange={onDifficultyChange}
                    className="flex flex-row justify-between"
                    disabled={isSendingMessage} // Disable while sending message
                  >
                    <div className="flex flex-col items-center gap-2">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label className="text-muted-foreground" htmlFor="easy">
                        Easy
                      </Label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <RadioGroupItem
                        value="medium"
                        id="medium"
                        className="size-4"
                      />
                      <Label className="text-muted-foreground" htmlFor="medium">
                        Medium
                      </Label>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label className="text-muted-foreground" htmlFor="hard">
                        Hard
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col text-sm items-start gap-1">
                Flashquiz Questions
                <span className="text-xs text-muted-foreground">
                  On/Off for tailored or random quiz
                </span>
              </Label>
              <Switch
                checked={isFlashquizEnabled}
                onCheckedChange={onNumQuestionsToggle}
                disabled={isSendingMessage} // Disable while sending message
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex flex-col text-sm items-start gap-1">
                Answer Options
                <span className="text-xs text-muted-foreground">
                  Display options with questions
                </span>
              </Label>
              <Switch
                checked={isAnswerOptionsEnabled}
                onCheckedChange={onNumOptionsToggle}
                disabled={isSendingMessage} // Disable while sending message
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
