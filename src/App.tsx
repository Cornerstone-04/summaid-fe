import { RouterProvider } from "react-router";
import { router } from "./router/routes";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Toaster closeButton position="top-right" />

      <RouterProvider router={router} />
    </>
  );
};

export default App;
