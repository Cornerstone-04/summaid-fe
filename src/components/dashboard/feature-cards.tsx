import { FlashCard, Note } from "@/assets/icons";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";

export function FeatureCards() {
  const features = [
    {
      icon: (
        <PlusCircle className="w-6 h-6 sm:w-10 sm:h-10 md:w-16 md:h-16 text-sa-primary" />
      ),
      title: "Create Summary",
      path: "/upload",
      toolParam: "summary",
    },
    {
      icon: (
        <img
          src={FlashCard}
          className="w-6 h-6 sm:w-10 sm:h-10 md:w-16 md:h-16"
        />
      ),
      title: "Flashcards",
      path: "/upload",
      toolParam: "flashcards",
    },
    {
      icon: (
        <img src={Note} className="w-6 h-6 sm:w-10 sm:h-10 md:w-16 md:h-16" />
      ),
      title: "Study Guides",
      path: "/upload",
      toolParam: "studyGuide",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 mb-8">
      {features.map((item, idx) => (
        <Link
          to={`${item.path}${item.toolParam ? `?tool=${item.toolParam}` : ""}`}
          key={idx}
          className="block"
        >
          <Card className="hover:shadow-sm transition-all duration-150 cursor-pointer border rounded-xl sm:rounded-2xl w-full h-full hover:bg-muted active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <CardContent className="p-3 sm:p-5 flex flex-col items-center text-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-sm sm:text-base font-medium">{item.title}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
