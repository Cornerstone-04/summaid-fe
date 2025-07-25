// src/components/session/FlashcardQuiz.tsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { MCQ } from "@/services/documents.services";

interface FlashcardQuizProps {
  flashcards: MCQ[];
  sessionTitle: string;
  initialDifficulty: "easy" | "medium" | "hard";
  numQuestionsToGenerate: number;
  onQuizComplete: (score: number, total: number) => void;
  onCancelQuiz: () => void;
}

type QuizStatus = "idle" | "inProgress" | "submitted";

export function FlashcardQuiz({
  flashcards,
  sessionTitle,
  initialDifficulty,
  numQuestionsToGenerate,
  onQuizComplete,
  onCancelQuiz,
}: FlashcardQuizProps) {
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("inProgress");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [remainingTime, setRemainingTime] = useState(5 * 60);
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const quizFlashcards = useMemo(() => {
    const shuffled = [...flashcards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestionsToGenerate);
  }, [flashcards, numQuestionsToGenerate]);

  useEffect(() => {
    if (quizStatus === "inProgress" && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && quizStatus === "inProgress") {
      handleSubmitQuiz();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStatus, remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAnswerChange = useCallback((qIndex: number, value: string) => {
    if (quizStatus === "inProgress") {
      setSelectedAnswers((prev) => ({ ...prev, [qIndex]: value }));
    }
  }, [quizStatus]);

  const handleSubmitQuiz = useCallback(() => {
    setQuizStatus("submitted");
    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    quizFlashcards.forEach((fc, i) => {
      if (selectedAnswers[i] === fc.answer) score++;
    });

    onQuizComplete(score, quizFlashcards.length);
  }, [quizFlashcards, selectedAnswers, onQuizComplete]);

  const handleCancelQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuizStatus("idle");
    onCancelQuiz();
  }, [onCancelQuiz]);

  const getOptionClass = (qIndex: number, option: string) => {
    if (quizStatus !== "submitted") return "";
    const correct = option === quizFlashcards[qIndex].answer;
    const selected = selectedAnswers[qIndex] === option;
    if (correct) return "text-green-600 font-semibold";
    if (selected && !correct) return "text-red-600 font-semibold";
    return "";
  };

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-10">
        <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-muted-foreground/50" />
        No flashcards available for this session. Please generate some.
      </div>
    );
  }

  if (numQuestionsToGenerate <= 0 || quizFlashcards.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-10">
        <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
        Flashcard quiz not available. Adjust preferences or generate more questions.
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden text-sm!">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">{sessionTitle}</CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground">
          <span>
            Quiz level: <strong>{currentDifficulty}</strong> |{" "}
            {quizFlashcards.length} Questions | {formatTime(remainingTime)} min
          </span>
          <Select
            value={currentDifficulty}
            onValueChange={(value: "easy" | "medium" | "hard") => setCurrentDifficulty(value)}
            disabled={quizStatus !== "inProgress"}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        <div className="flex justify-center mb-4">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-lg font-bold ${
              remainingTime <= 60 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
            }`}
          >
            {formatTime(remainingTime)}
          </div>
        </div>

        {quizFlashcards.map((flashcard, qIndex) => (
          <div key={qIndex} className="space-y-3 text-sm!">
            <h4 className="font-semibold">
              QUESTION {qIndex + 1} OF {quizFlashcards.length}
            </h4>
            <p className="">{flashcard.question}</p>
            <RadioGroup
              value={selectedAnswers[qIndex] || ""}
              onValueChange={(value) => handleAnswerChange(qIndex, value)}
              className="space-y-2"
              disabled={quizStatus !== "inProgress"}
            >
              {flashcard.options.map((option, oIndex) => {
                const label = String.fromCharCode(65 + oIndex);
                return (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`q${qIndex}-o${oIndex}`}
                      disabled={quizStatus !== "inProgress"}
                    />
                    <Label
                      htmlFor={`q${qIndex}-o${oIndex}`}
                      className={getOptionClass(qIndex, option)}
                    >
                      <span className="font-bold mr-2">{label}.</span> {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            {quizStatus === "submitted" && (
              <p className="text-sm mt-1">
                {selectedAnswers[qIndex] === flashcard.answer ? (
                  <span className="text-green-600">✅ Correct</span>
                ) : (
                  <span className="text-red-600">
                    ❌ Incorrect. Correct answer:{" "}
                    <strong>{flashcard.answer}</strong>
                  </span>
                )}
              </p>
            )}
          </div>
        ))}
      </CardContent>

      <div className="p-6 pt-0 flex justify-end gap-4 border-t border-border">
        {quizStatus === "inProgress" && (
          <>
            <Button variant="outline" onClick={handleCancelQuiz}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < quizFlashcards.length}
            >
              Submit Quiz
            </Button>
          </>
        )}

        {quizStatus === "submitted" && (
          <Button onClick={onCancelQuiz}>Back to Results</Button>
        )}
      </div>
    </Card>
  );
}
