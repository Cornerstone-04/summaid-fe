import { Card, CardContent } from "@/components/ui/card";
import { Mic, FileText, Book } from "lucide-react";

export function FeatureCards() {
  const features = [
    { icon: <Mic className="w-8 h-8 text-blue-500" />, title: "Audio Recap" },
    {
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      title: "Study Flashcards",
    },
    { icon: <Book className="w-8 h-8 text-blue-500" />, title: "Note Explain" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {features.map((item, idx) => (
        <Card
          key={idx}
          className="hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-lg font-medium">{item.title}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
