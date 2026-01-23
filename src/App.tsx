import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider } from "@/hooks/useAuth";
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
import FounderNetwork from "./pages/FounderNetwork";
import CampaignLaunchpad from "./pages/CampaignLaunchpad";
import Auth from "./pages/Auth";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardDeals from "./pages/DashboardDeals";
import DashboardCampaigns from "./pages/DashboardCampaigns";
import DashboardTasks from "./pages/DashboardTasks";
import DashboardHistory from "./pages/DashboardHistory";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardSettings from "./pages/DashboardSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/kol-campaigns" element={<KOLCampaigns />} />
              <Route path="/ambassador-programs" element={<AmbassadorLaunchpad />} />
              <Route path="/kol-market" element={<KOLMarket />} />
              <Route path="/campus-programs" element={<CampusPrograms />} />
              <Route path="/events" element={<Events />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/ai-marketing" element={<SelfMarketing />} />
              <Route path="/founder-network" element={<FounderNetwork />} />
              <Route path="/campaign-launchpad" element={<CampaignLaunchpad />} />
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/dashboard/deals" element={<DashboardDeals />} />
              <Route path="/dashboard/campaigns" element={<DashboardCampaigns />} />
              <Route path="/dashboard/tasks" element={<DashboardTasks />} />
              <Route path="/dashboard/history" element={<DashboardHistory />} />
              <Route path="/dashboard/profile" element={<DashboardProfile />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ThemeToggle />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
