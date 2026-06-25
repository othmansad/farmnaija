import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { lazy, Suspense, ComponentType } from "react";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { RemindersBootstrap } from "@/components/RemindersBootstrap";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// Retry dynamic imports once, then force a full reload to fetch the latest
// chunk manifest. Fixes "Failed to fetch dynamically imported module" after
// redeploys when the browser holds a stale index referencing old chunk hashes.
function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    const reloadKey = `chunk-reload-${factory.toString().slice(0, 50)}`;
    try {
      return await factory();
    } catch (err) {
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, "1");
        window.location.reload();
        // Return a never-resolving promise while reload happens
        return await new Promise<{ default: T }>(() => {});
      }
      throw err;
    }
  });
}

const Chat = lazyWithRetry(() => import("./pages/Chat.tsx"));
const Admin = lazyWithRetry(() => import("./pages/Admin.tsx"));
const Auth = lazyWithRetry(() => import("./pages/Auth.tsx"));
const PlannerPage = lazyWithRetry(() => import("./pages/PlannerPage.tsx"));
const AnalyticsPage = lazyWithRetry(() => import("./pages/AnalyticsPage.tsx"));
const LearnPage = lazyWithRetry(() => import("./pages/LearnPage.tsx"));
const CommunityPage = lazyWithRetry(() => import("./pages/CommunityPage.tsx"));
const ForumThreadPage = lazy(() => import("./pages/ForumThreadPage.tsx"));
const ExpertQAPage = lazy(() => import("./pages/ExpertQAPage.tsx"));
const NewsPage = lazy(() => import("./pages/NewsPage.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <PremiumProvider>
            <RemindersBootstrap />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider defaultOpen={false}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col min-w-0">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/planner" element={<PlannerPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/learn" element={<LearnPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community/forum/:id" element={<ForumThreadPage />} />
                        <Route path="/community/qa" element={<ExpertQAPage />} />
                        <Route path="/news" element={<NewsPage />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </div>
                </div>
              </SidebarProvider>
            </BrowserRouter>
          </PremiumProvider>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
