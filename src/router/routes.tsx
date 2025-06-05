import { createBrowserRouter } from "react-router";
import ErrorPage from "@/pages/error-page";
import LandingPage from "@/pages/landing-page";
import LoginPage from "@/pages/auth/login";
import { ProtectedRoute } from "@/router/protected-routes";
import { PublicRoute } from "./public-routes";
import DashboardPage from "@/pages/dashboard/dashboard-page";
import UploadPage from "@/pages/upload/upload-page";
import StudySessionPage from "@/pages/session/study-session-page";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: (
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        ),
      },
      {
        path: "auth/get-started",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "upload", 
        element: (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "session/:sessionId", // New dynamic route for study sessions
        element: (
          <ProtectedRoute>
            <StudySessionPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
