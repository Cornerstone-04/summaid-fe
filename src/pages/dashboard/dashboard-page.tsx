import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FeatureCards } from "@/components/dashboard/feature-cards";
import { StudyMaterialControls } from "@/components/dashboard/study-material-controls";
import { StudyMaterialTable } from "@/components/dashboard/study-material-table";
import { useAuth } from "@/store/useAuth";
import { useState } from "react";

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "Guest";

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="flex-1 container mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome {firstName}!</h1>
          <p className="text-xl text-muted-foreground">
            Learn smarter with the power of AI ✨
          </p>
        </div>

        <FeatureCards />

        <StudyMaterialControls
          viewMode={viewMode}
          onViewChange={setViewMode}
          sort={sortBy}
          onSortChange={setSortBy}
        />

        <StudyMaterialTable viewMode={viewMode} sortBy={sortBy} />
      </main>
    </div>
  );
}
