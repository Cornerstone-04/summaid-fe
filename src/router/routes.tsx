import { createBrowserRouter } from "react-router";
import ErrorPage from "@/pages/error-page";
import LandingPage from "@/pages/landing-page";
import LoginPage from "@/pages/auth/login";
import { ProtectedRoute } from "@/router/protected-routes";
import { PublicRoute } from "./public-routes";

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
            <LandingPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
