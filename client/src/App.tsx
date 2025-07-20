import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Reports from "@/pages/reports";
import Map from "@/pages/map";
import Leaderboard from "@/pages/leaderboard";
import TaxNotice from "@/pages/tax-notice";
import TaxDetails from "@/pages/tax-details";
import NotFound from "@/pages/not-found";
import VerifyStatus from "@/pages/verify-status";
import NotificationCenter from "./pages/notification-center";
import Insights from "./pages/insights";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/reports" component={Reports} />
      <Route path="/map" component={Map} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/tax-notice" component={TaxNotice} />
      <Route path="/tax-details" component={TaxDetails} />
      <Route path="/verify-status" component={VerifyStatus} />
      <Route path="/insights" component={Insights} />
      <Route path="/notification-center" component={NotificationCenter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
