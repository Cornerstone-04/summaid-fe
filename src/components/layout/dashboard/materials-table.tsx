import { Mic, BookOpen, Files, Pencil, Eye, MoreVertical } from "lucide-react";

const data = [
  {
    name: "Database Normalization Principles",
    date: "April 23, 2025 00:00 AM",
    categories: ["audio", "flashcard"],
  },
  {
    name: "Understanding Big-O Notation",
    date: "April 23, 2025 04:00 AM",
    categories: ["note", "audio"],
  },
  {
    name: "Introduction to Algorithms",
    date: "April 22, 2025 19:45 PM",
    categories: ["note", "flashcard", "audio"],
  },
  {
    name: "Data Structures: Trees & Graphs",
    date: "April 23, 2025 00:00 AM",
    categories: ["note", "flashcard"],
  },
];

const categoryMap = {
  audio: {
    label: "Audio Recap",
    icon: <Mic className="w-3.5 h-3.5 mr-1" />,
    color: "text-blue-600 bg-blue-100",
  },
  note: {
    label: "Note Explain",
    icon: <BookOpen className="w-3.5 h-3.5 mr-1" />,
    color: "text-green-600 bg-green-100",
  },
  flashcard: {
    label: "Flashcard Set",
    icon: <Files className="w-3.5 h-3.5 mr-1" />,
    color: "text-yellow-600 bg-yellow-100",
  },
};

export default function MaterialsTable() {
  return (
    <section className="px-6 mt-12 pb-10">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Date created</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium">{item.name}</td>
                <td className="px-4 py-4 text-gray-600">{item.date}</td>
                <td className="px-4 py-4 flex flex-wrap gap-2">
                  {item.categories.map((key) => {
                    const tag = categoryMap[key];
                    return (
                      <span
                        key={key}
                        className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${tag.color}`}
                      >
                        {tag.icon}
                        {tag.label}
                      </span>
                    );
                  })}
                </td>
                <td className="px-4 py-4 flex items-center space-x-3 text-gray-500">
                  <Pencil className="w-4 h-4 cursor-pointer hover:text-blue-600" />
                  <Eye className="w-4 h-4 cursor-pointer hover:text-blue-600" />
                  <MoreVertical className="w-4 h-4 cursor-pointer hover:text-blue-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
