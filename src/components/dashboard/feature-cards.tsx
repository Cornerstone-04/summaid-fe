import { FlashCard, Microphone, Note } from "@/assets/icons";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureCards() {
  const features = [
    { icon: <img src={Microphone} />, title: "Audio Recap" },
    {
      icon: <img src={FlashCard} />,
      title: "Study Flashcards",
    },
    { icon: <img src={Note} />, title: "Note Explain" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {features.map((item, idx) => (
        <Card
          key={idx}
          className="hover:shadow-md transition-shadow cursor-pointer border-[3px] rounded-3xl hover:shadow-[#E4F1FB] min-h-[250px]"
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 md:w-40 md:h-40 mb-4 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-lg font-medium">{item.title}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
