import { FlashCard, Note } from "@/assets/icons";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router";

export function FeatureCards() {
  const features = [
    {
      icon: (
        <PlusCircle className="w-20 h-20 md:w-40 md:h-40 text-sa-primary" />
      ),
      title: "Create Summary",
      path: "/upload",
      toolParam: "summary",
    },
    {
      icon: <img src={FlashCard} />,
      title: "Study Flashcards",
      path: "/upload",
      toolParam: "flashcards",
    },
    {
      icon: <img src={Note} />,
      title: "Note Explain",
      path: "/upload",
      toolParam: "studyGuide",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {features.map((item, idx) => (
        <Link
          to={`${item.path}${item.toolParam ? `?tool=${item.toolParam}` : ""}`}
          key={idx}
          className="block"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-[3px] rounded-3xl hover:shadow-[#E4F1FB] min-h-[250px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 md:w-40 md:h-40 mb-4 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-medium">{item.title}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
