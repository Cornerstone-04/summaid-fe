import { useAuth } from "@/store/useAuth";
import { ReactNode } from "react";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!user) return <Navigate to="/auth/get-started" />;

  return <>{children}</>;
}
