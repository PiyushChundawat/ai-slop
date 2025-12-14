import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileToggle } from "@/components/ProfileToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import TodoList from "@/pages/TodoList";
import HabitTracker from "@/pages/HabitTracker";
import DailyLogs from "@/pages/DailyLogs";
import CPDashboard from "@/pages/CPDashboard";
import Ratings from "@/pages/Ratings";
import ContestLog from "@/pages/ContestLog";
import DSAProgress from "@/pages/DSAProgress";
import Resume from "@/pages/Resume";
import Courses from "@/pages/Courses";
import Certificates from "@/pages/Certificates";
import CaseStudies from "@/pages/CaseStudies";
import Guesstimates from "@/pages/Guesstimates";
import Competitions from "@/pages/Competitions";
import Skills from "@/pages/Skills";
import Projects from "@/pages/Projects";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/todos" component={TodoList} />
      <Route path="/habits" component={HabitTracker} />
      <Route path="/daily-logs" component={DailyLogs} />
      <Route path="/cp-dashboard" component={CPDashboard} />
      <Route path="/ratings" component={Ratings} />
      <Route path="/contests" component={ContestLog} />
      <Route path="/dsa-progress" component={DSAProgress} />
      <Route path="/resume" component={Resume} />
      <Route path="/courses" component={Courses} />
      <Route path="/certificates" component={Certificates} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/guesstimates" component={Guesstimates} />
      <Route path="/competitions" component={Competitions} />
      <Route path="/skills" component={Skills} />
      <Route path="/projects" component={Projects} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <ProfileProvider>
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <header className="flex items-center justify-between gap-4 p-3 border-b sticky top-0 z-50 bg-background">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <div className="flex items-center gap-2">
                      <ProfileToggle />
                      <ThemeToggle />
                    </div>
                  </header>
                  <main className="flex-1 overflow-auto">
                    <Router />
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </ProfileProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
