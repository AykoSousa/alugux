
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Properties from "@/pages/Properties";
import Rentals from "@/pages/Rentals";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/components/auth-provider";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Index />
      </AuthProvider>
    ),
  },
  {
    path: "/properties",
    element: (
      <AuthProvider>
        <Properties />
      </AuthProvider>
    ),
  },
  {
    path: "/rentals",
    element: (
      <AuthProvider>
        <Rentals />
      </AuthProvider>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
