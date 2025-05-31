import ErrorPage from "@/pages/error-page";
import LandingPage from "@/pages/landing-page";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "dashboard", element: <LandingPage /> },
    ],
  },
]);
