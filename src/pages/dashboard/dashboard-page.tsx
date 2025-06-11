import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FeatureCards } from "@/components/dashboard/feature-cards";
import { StudyMaterialControls } from "@/components/dashboard/study-material-controls";
import { StudyMaterialTable } from "@/components/dashboard/study-material-table";
import { useAuth } from "@/store/useAuth";
import { api } from "@/utils/api";

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");
  const { user } = useAuth();

  const userFullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Guest";
  const firstName = userFullName.split(" ")[0];

  const hasFetchedData = useRef(false);

  const fetchProtectedUserData = async () => {
    try {
      const response = await api.get("/users/profile");
      toast.success(`Protected data fetched! ${response.data.message}`);
      console.log("Protected User Data from Backend:", response.data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      console.error("Error fetching protected data from backend:", message);
      toast.error(message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        // Optional: handle re-auth
        // Example: getAuth().signOut(); navigate("/auth/get-started");
      }
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchProtectedUserData();
      hasFetchedData.current = true;
    }
  }, []);

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
