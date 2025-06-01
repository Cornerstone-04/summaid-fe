import { Navigate } from "react-router";
import { useAuth } from "@/store/useAuth";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (user) return <Navigate to="/dashboard" />;

  return <>{children}</>;
}
