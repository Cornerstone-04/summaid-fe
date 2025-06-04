import DashboardHeader from "@/components/layout/dashboard/dashboard-header";
import FeatureGrid from "@/components/layout/dashboard/feature-grid";
import MaterialsTable from "@/components/layout/dashboard/materials-table";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DashboardHeader />

      <section className="px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Welcome back Cornerstone!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Learn smarter with the power of AI ✨
        </p>
      </section>

      <FeatureGrid />
      <MaterialsTable />
    </div>
  );
}
