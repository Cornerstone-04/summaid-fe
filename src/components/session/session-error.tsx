import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function SessionError() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-8 px-6 text-center text-destructive">
        <p>
          Session data could not be loaded. Please go back to the dashboard.
        </p>
      </main>
    </div>
  );
}
