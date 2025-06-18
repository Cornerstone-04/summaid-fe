import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FeatureCards } from "@/components/dashboard/feature-cards";
import { StudyMaterialControls } from "@/components/dashboard/study-material-controls";
import { StudyMaterialTable } from "@/components/dashboard/study-material-table";
import { useAuth } from "@/store/useAuth";
import { api } from "@/utils/api";
import { useUserSessions } from "@/hooks/useUserSessions"; // Import the new hook

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");
  const { user } = useAuth(); // User state from your auth store

  // --- New: Fetch user sessions ---
  const { sessions, isLoadingSessions, sessionsError } = useUserSessions();

  const userFullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Guest";
  const firstName = userFullName.split(" ")[0];

  const hasFetchedProtectedData = useRef(false); // Renamed for clarity

  const fetchProtectedUserData = async () => {
    try {
      const response = await api.get("/users/profile");
      toast.success(`Protected data fetched! ${response.data.message}`);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      toast.error(message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        // Handle re-authentication or redirection if needed
        // Example: getAuth().signOut(); navigate("/auth/get-started");
      }
    }
  };

  useEffect(() => {
    // Only fetch protected data once per component mount, if not already fetched
    if (!hasFetchedProtectedData.current) {
      fetchProtectedUserData();
      hasFetchedProtectedData.current = true;
    }
  }, []); // Empty dependency array means this runs once after initial render

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="flex-1 container mx-auto py-8 px-6 md:px-8 lg:px-16 xl:px-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome {firstName}!</h1>
          <p className="text-xl text-muted-foreground">
            Learn smarter with the power of AI ✨
          </p>
        </div>

        <FeatureCards /> {/* You might pass session data to this too */}

        <StudyMaterialControls
          viewMode={viewMode}
          onViewChange={setViewMode}
          sort={sortBy}
          onSortChange={setSortBy}
        />

        {isLoadingSessions ? (
          <div className="text-center text-muted-foreground">Loading your study sessions...</div>
        ) : sessionsError ? (
          <div className="text-center text-destructive">Error: {sessionsError}</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-muted-foreground">No study sessions found. Upload a document to get started!</div>
        ) : (
          <StudyMaterialTable viewMode={viewMode} sortBy={sortBy} sessions={sessions} />
        )}
      </main>
    </div>
  );
}
