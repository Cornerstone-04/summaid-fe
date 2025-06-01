"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Book,
  FileText,
  Mic,
  MoreVertical,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";

// Mock data for the dashboard
const studyMaterials = [
  {
    id: "1",
    name: "Database Normalization Principles",
    date: "April 23, 2025 00:00 AM",
    categories: ["Audio Recap", "Flashcard Set"],
  },
  {
    id: "2",
    name: "Understanding Big-O Notation",
    date: "April 23, 2025 40:00 AM",
    categories: ["Note Explain", "Audio Recap"],
  },
  {
    id: "3",
    name: "Introduction to Algorithms",
    date: "April 22, 2025 19:45 PM",
    categories: ["Note Explain", "Flashcard Set", "Audio Recap"],
  },
  {
    id: "4",
    name: "Data Structures: Trees & Graphs",
    date: "April 23, 2025 00:00 AM",
    categories: ["Note Explain", "Flashcard Set"],
  },
  {
    id: "5",
    name: "Introduction to Algorithms",
    date: "April 22, 2025 19:45 PM",
    categories: ["Note Explain", "Flashcard Set", "Audio Recap"],
  },
  {
    id: "6",
    name: "Introduction to Algorithms",
    date: "April 22, 2025 19:45 PM",
    categories: ["Note Explain", "Flashcard Set", "Audio Recap"],
  },
];

export function StudyDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaterials = studyMaterials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back Cornerstone!</h1>
          <p className="text-xl text-muted-foreground">
            Learn smarter with the power of AI ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium">Audio Recap</h3>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium">Study Flashcards</h3>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Book className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium">Note Explain</h3>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Study Materials</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search materials..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm text-gray-500">
            <div>Name</div>
            <div>Date created</div>
            <div>Category</div>
            <div className="text-right">Actions</div>
          </div>

          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50"
            >
              <div className="font-medium">{material.name}</div>
              <div className="text-sm text-gray-500">{material.date}</div>
              <div className="flex flex-wrap gap-1">
                {material.categories.map((category, index) => {
                  let icon = <FileText className="h-4 w-4" />;
                  let color = "bg-gray-100 text-gray-800";

                  if (category === "Audio Recap") {
                    icon = <Mic className="h-4 w-4" />;
                    color = "bg-blue-100 text-blue-800";
                  } else if (category === "Flashcard Set") {
                    icon = <FileText className="h-4 w-4" />;
                    color = "bg-orange-100 text-orange-800";
                  } else if (category === "Note Explain") {
                    icon = <Book className="h-4 w-4" />;
                    color = "bg-green-100 text-green-800";
                  }

                  return (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${color}`}
                    >
                      {icon}
                      <span className="ml-1">{category}</span>
                    </span>
                  );
                })}
              </div>
              <div className="flex justify-end gap-2">
                <Link to={`/study/${material.id}`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
