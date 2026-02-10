import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./contexts/FilterContext";
import { FilterVisibilityProvider } from "./contexts/FilterVisibilityContext";
import Index from "./pages/Index";
import CategoryOverview from "./pages/CategoryOverview";
import Trends from "./pages/Trends";
import Visibility from "./pages/Visibility";
import BrandOverview from "./pages/BrandOverview";
import PromptDeepDive from "./pages/PromptDeepDive";
import CitationAnalysis from "./pages/CitationAnalysis";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FilterProvider>
      <FilterVisibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<CategoryOverview />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/visibility" element={<Visibility />} />
              <Route path="/brands" element={<BrandOverview />} />
              <Route path="/prompts" element={<PromptDeepDive />} />
              <Route path="/citations" element={<CitationAnalysis />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FilterVisibilityProvider>
    </FilterProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;

// Prevent double initialization in development
if (!container.hasAttribute("data-root-initialized")) {
  container.setAttribute("data-root-initialized", "true");
  const root = createRoot(container);
  root.render(<App />);
}
