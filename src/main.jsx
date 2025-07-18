import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router.jsx";
import Aos from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./Contexts/AuthContext/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

Aos.init();
const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="urbanist-font">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
