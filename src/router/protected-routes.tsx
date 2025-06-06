import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/store/useAuth";
import { ReactNode } from "react";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Skeleton className="size-4/5" />
      </div>
    );

  if (!user) return <Navigate to="/auth/get-started" />;

  return <>{children}</>;
}
