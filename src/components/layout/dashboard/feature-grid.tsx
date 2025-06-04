import { Mic, Files, BookOpen } from "lucide-react";
import FeatureCard from "./feature-card";

export default function FeatureGrid() {
  const features = [
    { icon: <Mic className="w-10 h-10 text-blue-600" />, label: "Audio Recap" },
    { icon: <Files className="w-10 h-10 text-blue-600" />, label: "Study Flashquiz" },
    { icon: <BookOpen className="w-10 h-10 text-blue-600" />, label: "Note Explain" },
  ];

  return (
    <section className="px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <FeatureCard key={i} icon={f.icon} label={f.label} />
      ))}
    </section>
  );
}
