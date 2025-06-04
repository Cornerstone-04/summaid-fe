interface FeatureCardProps {
  icon: React.ReactNode;
  label: string;
}

export default function FeatureCard({ icon, label }: FeatureCardProps) {
  return (
    <div className="bg-white border rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition">
      {icon}
      <p className="mt-4 font-medium text-gray-700">{label}</p>
    </div>
  );
}
