import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function SessionSkeleton() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1 flex flex-col md:flex-row p-4 sm:p-6">
        <Skeleton className="w-full md:w-1/4 h-[calc(100vh-100px)] rounded-lg mr-4 mb-4 md:mb-0" />
        <Skeleton className="flex-1 h-[calc(100vh-100px)] rounded-lg mr-4 mb-4 md:mb-0" />
        <Skeleton className="w-full md:w-1/4 h-[calc(100vh-100px)] rounded-lg" />
      </main>
    </div>
  );
}
