import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useProfile } from "@/contexts/ProfileContext";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  ClipboardList,
  Trophy,
  Star,
  Code2,
  FileText,
  GraduationCap,
  Award,
  Briefcase,
  Lightbulb,
  Users,
  BookOpen,
  BarChart3,
  FolderOpen,
  Wrench,
} from "lucide-react";

const globalItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "TODO List", url: "/todos", icon: CheckSquare },
  { title: "Habit Tracker", url: "/habits", icon: Calendar },
  { title: "Daily Logs", url: "/daily-logs", icon: ClipboardList },
];

const piyushItems = [
  { title: "CP Dashboard", url: "/cp-dashboard", icon: Trophy },
  { title: "Ratings", url: "/ratings", icon: Star },
  { title: "Contest Log", url: "/contests", icon: Code2 },
  { title: "DSA Progress", url: "/dsa-progress", icon: BarChart3 },
  { title: "Resume", url: "/resume", icon: FileText },
  { title: "Courses", url: "/courses", icon: GraduationCap },
  { title: "Certificates", url: "/certificates", icon: Award },
];

const shrutiItems = [
  { title: "Case Studies", url: "/case-studies", icon: BookOpen },
  { title: "Guesstimates", url: "/guesstimates", icon: Lightbulb },
  { title: "Competitions", url: "/competitions", icon: Users },
  { title: "Certificates", url: "/certificates", icon: Award },
  { title: "Skills", url: "/skills", icon: Wrench },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Courses", url: "/courses", icon: GraduationCap },
];

export function AppSidebar() {
  const { profile } = useProfile();
  const [location] = useLocation();
  const profileItems = profile === "piyush" ? piyushItems : shrutiItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-semibold text-lg">Prep Tracker</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Global
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {globalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {profile === "piyush" ? "Piyush" : "Shruti"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          {profile === "piyush" ? "Tech / CP / DSA" : "Analytics / SQL / Python"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
