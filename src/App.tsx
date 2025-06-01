import { RouterProvider } from "react-router";
import { router } from "./router/routes";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { listenToAuthChanges } from "./store/useAuth";

const App = () => {
  useEffect(() => {
    listenToAuthChanges();
  }, []);

  return (
    <>
      <Toaster closeButton position="top-right" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
