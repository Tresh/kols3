import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import About from "./pages/About";
import KOLCampaigns from "./pages/KOLCampaigns";
import AmbassadorLaunchpad from "./pages/AmbassadorLaunchpad";
import KOLMarket from "./pages/KOLMarket";
import CampusPrograms from "./pages/CampusPrograms";
import Events from "./pages/Events";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import SelfMarketing from "./pages/SelfMarketing";
import Dashboard from "./pages/Dashboard";
import DashboardKOL from "./pages/DashboardKOL";
import DashboardAmbassador from "./pages/DashboardAmbassador";
import DashboardCampus from "./pages/DashboardCampus";
import FounderNetwork from "./pages/FounderNetwork";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/kol-campaigns" element={<KOLCampaigns />} />
            <Route path="/ambassador-programs" element={<AmbassadorLaunchpad />} />
            <Route path="/kol-market" element={<KOLMarket />} />
            <Route path="/campus-programs" element={<CampusPrograms />} />
            <Route path="/events" element={<Events />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/ai-marketing" element={<SelfMarketing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/kol" element={<DashboardKOL />} />
            <Route path="/dashboard/ambassador" element={<DashboardAmbassador />} />
            <Route path="/dashboard/campus" element={<DashboardCampus />} />
            <Route path="/founder-network" element={<FounderNetwork />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ThemeToggle />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
