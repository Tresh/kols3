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
import CreatorProfile from "./pages/CreatorProfile";
import CampusPrograms from "./pages/CampusPrograms";
import Events from "./pages/Events";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import SelfMarketing from "./pages/SelfMarketing";
import FounderNetwork from "./pages/FounderNetwork";
import CampaignLaunchpad from "./pages/CampaignLaunchpad";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardDeals from "./pages/DashboardDeals";
import DashboardCampaigns from "./pages/DashboardCampaigns";
import DashboardTasks from "./pages/DashboardTasks";
import DashboardHistory from "./pages/DashboardHistory";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardLeaderboard from "./pages/DashboardLeaderboard";

// Role-specific dashboards
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import CreatorOffers from "./pages/dashboard/creator/CreatorOffers";
import CreatorPrograms from "./pages/dashboard/creator/CreatorPrograms";
import CreatorTasks from "./pages/dashboard/creator/CreatorTasks";
import CreatorProofOfWork from "./pages/dashboard/creator/CreatorProofOfWork";
import CreatorWallet from "./pages/dashboard/creator/CreatorWallet";
import CreatorProfilePage from "./pages/dashboard/creator/CreatorProfilePage";
import CreatorSettings from "./pages/dashboard/creator/CreatorSettings";

import MarketerDashboard from "./pages/dashboard/marketer/MarketerDashboard";
import MarketerProfile from "./pages/dashboard/marketer/MarketerProfile";
import MarketerOffers from "./pages/dashboard/marketer/MarketerOffers";
import MarketerCampaigns from "./pages/dashboard/marketer/MarketerCampaigns";
import MarketerTasks from "./pages/dashboard/marketer/MarketerTasks";
import MarketerProofOfWork from "./pages/dashboard/marketer/MarketerProofOfWork";
import MarketerSettings from "./pages/dashboard/marketer/MarketerSettings";

import ProjectDashboard from "./pages/dashboard/project/ProjectDashboard";
import ProjectAIRecommendations from "./pages/dashboard/project/ProjectAIRecommendations";
import ProjectCampaigns from "./pages/dashboard/project/ProjectCampaigns";
import ProjectOffers from "./pages/dashboard/project/ProjectOffers";
import ProjectTalentDiscovery from "./pages/dashboard/project/ProjectTalentDiscovery";
import ProjectTasks from "./pages/dashboard/project/ProjectTasks";
import ProjectSettings from "./pages/dashboard/project/ProjectSettings";

// Admin Dashboard Routes
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import AdminCampaigns from "./pages/dashboard/admin/AdminCampaigns";
import AdminUsers from "./pages/dashboard/admin/AdminUsers";
import AdminRoles from "./pages/dashboard/admin/AdminRoles";
import AdminTasks from "./pages/dashboard/admin/AdminTasks";
import AdminProofOfWork from "./pages/dashboard/admin/AdminProofOfWork";
import AdminSettings from "./pages/dashboard/admin/AdminSettings";

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
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/kol-campaigns" element={<KOLCampaigns />} />
              <Route path="/ambassador-programs" element={<AmbassadorLaunchpad />} />
              <Route path="/kol-market" element={<KOLMarket />} />
              <Route path="/creator/:id" element={<CreatorProfile />} />
              <Route path="/campus-programs" element={<CampusPrograms />} />
              <Route path="/events" element={<Events />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/ai-marketing" element={<SelfMarketing />} />
              <Route path="/founder-network" element={<FounderNetwork />} />
              <Route path="/campaign-launchpad" element={<CampaignLaunchpad />} />
              
              {/* Legacy dashboard routes */}
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/dashboard/deals" element={<DashboardDeals />} />
              <Route path="/dashboard/campaigns" element={<DashboardCampaigns />} />
              <Route path="/dashboard/tasks" element={<DashboardTasks />} />
              <Route path="/dashboard/history" element={<DashboardHistory />} />
              <Route path="/dashboard/profile" element={<DashboardProfile />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
              
              {/* Creator Dashboard Routes */}
              <Route path="/dashboard/creator" element={<CreatorDashboard />} />
              <Route path="/dashboard/creator/profile" element={<CreatorProfilePage />} />
              <Route path="/dashboard/creator/offers" element={<CreatorOffers />} />
              <Route path="/dashboard/creator/programs" element={<CreatorPrograms />} />
              <Route path="/dashboard/creator/tasks" element={<CreatorTasks />} />
              <Route path="/dashboard/creator/proof-of-work" element={<CreatorProofOfWork />} />
              <Route path="/dashboard/creator/wallet" element={<CreatorWallet />} />
              <Route path="/dashboard/creator/settings" element={<CreatorSettings />} />
              
              {/* Marketer Dashboard Routes */}
              <Route path="/dashboard/marketer" element={<MarketerDashboard />} />
              <Route path="/dashboard/marketer/profile" element={<MarketerProfile />} />
              <Route path="/dashboard/marketer/offers" element={<MarketerOffers />} />
              <Route path="/dashboard/marketer/campaigns" element={<MarketerCampaigns />} />
              <Route path="/dashboard/marketer/tasks" element={<MarketerTasks />} />
              <Route path="/dashboard/marketer/proof-of-work" element={<MarketerProofOfWork />} />
              <Route path="/dashboard/marketer/settings" element={<MarketerSettings />} />
              
              {/* Project Dashboard Routes */}
              <Route path="/dashboard/project" element={<ProjectDashboard />} />
              <Route path="/dashboard/project/ai-recommendations" element={<ProjectAIRecommendations />} />
              <Route path="/dashboard/project/campaigns" element={<ProjectCampaigns />} />
              <Route path="/dashboard/project/offers" element={<ProjectOffers />} />
              <Route path="/dashboard/project/talent" element={<ProjectTalentDiscovery />} />
              <Route path="/dashboard/project/tasks" element={<ProjectTasks />} />
              <Route path="/dashboard/project/settings" element={<ProjectSettings />} />
              
              
              {/* Admin Dashboard Routes */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/campaigns" element={<AdminCampaigns />} />
              <Route path="/dashboard/admin/users" element={<AdminUsers />} />
              <Route path="/dashboard/admin/roles" element={<AdminRoles />} />
              <Route path="/dashboard/admin/tasks" element={<AdminTasks />} />
              <Route path="/dashboard/admin/proof-of-work" element={<AdminProofOfWork />} />
              <Route path="/dashboard/admin/settings" element={<AdminSettings />} />

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
