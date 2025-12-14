import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Target,
  TrendingUp,
  Calendar,
  Code2,
  BookOpen,
} from "lucide-react";
import type { Todo, Habit, HabitEntry, DailyLogPiyush, DailyLogShruti, A2zProgress, Course } from "@shared/schema";
import { format, subDays } from "date-fns";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold font-mono">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useProfile();

  const { data: todos, isLoading: todosLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos", profile],
  });

  const { data: habits, isLoading: habitsLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits", profile],
  });

  const { data: habitEntries } = useQuery<HabitEntry[]>({
    queryKey: ["/api/habit-entries", profile],
  });

  const { data: dailyLogsPiyush } = useQuery<DailyLogPiyush[]>({
    queryKey: ["/api/daily-logs/piyush"],
    enabled: profile === "piyush",
  });

  const { data: dailyLogsShruti } = useQuery<DailyLogShruti[]>({
    queryKey: ["/api/daily-logs/shruti"],
    enabled: profile === "shruti",
  });

  const { data: a2zProgress } = useQuery<A2zProgress>({
    queryKey: ["/api/a2z-progress"],
    enabled: profile === "piyush",
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses", profile],
  });

  if (todosLoading || habitsLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Welcome back, {profile === "piyush" ? "Piyush" : "Shruti"}
        </h1>
        <DashboardSkeleton />
      </div>
    );
  }

  const completedTodos = todos?.filter((t) => t.completed).length || 0;
  const totalTodos = todos?.length || 0;

  const today = format(new Date(), "yyyy-MM-dd");
  const last7Days = [...Array(7)].map((_, i) => format(subDays(new Date(), i), "yyyy-MM-dd"));
  
  const todayHabitEntries = habitEntries?.filter((e) => e.date === today && e.completed) || [];
  const totalHabits = habits?.length || 0;
  const habitsCompletedToday = todayHabitEntries.length;

  let weeklyQuestions = 0;
  let totalQuestions = 0;
  
  if (profile === "piyush" && dailyLogsPiyush) {
    dailyLogsPiyush.forEach((log) => {
      totalQuestions += log.dsaQuestionsSolved;
      if (last7Days.includes(log.date)) {
        weeklyQuestions += log.dsaQuestionsSolved;
      }
    });
  } else if (profile === "shruti" && dailyLogsShruti) {
    dailyLogsShruti.forEach((log) => {
      totalQuestions += log.pythonQuestionsSolved + log.sqlQuestionsSolved;
      if (last7Days.includes(log.date)) {
        weeklyQuestions += log.pythonQuestionsSolved + log.sqlQuestionsSolved;
      }
    });
  }

  let dsaProgress = 0;
  if (profile === "piyush" && a2zProgress) {
    const total = a2zProgress.easyTotal + a2zProgress.mediumTotal + a2zProgress.hardTotal;
    const solved = a2zProgress.easySolved + a2zProgress.mediumSolved + a2zProgress.hardSolved;
    dsaProgress = total > 0 ? Math.round((solved / total) * 100) : 0;
  }

  const coursesInProgress = courses?.filter((c) => c.completedContent < c.totalContent).length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" data-testid="text-welcome">
          Welcome back, {profile === "piyush" ? "Piyush" : "Shruti"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {profile === "piyush"
            ? "Track your DSA, CP, and tech prep progress"
            : "Track your analytics, SQL, and Python progress"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Tasks Completed"
          value={`${completedTodos}/${totalTodos}`}
          subtitle="todos done"
          icon={CheckCircle2}
        />
        <StatCard
          title="Today's Habits"
          value={`${habitsCompletedToday}/${totalHabits}`}
          subtitle="habits completed"
          icon={Target}
        />
        <StatCard
          title="Weekly Questions"
          value={weeklyQuestions}
          subtitle={`${totalQuestions} total`}
          icon={TrendingUp}
        />
        {profile === "piyush" ? (
          <StatCard
            title="A2Z Progress"
            value={`${dsaProgress}%`}
            subtitle="Striver sheet"
            icon={Code2}
          />
        ) : (
          <StatCard
            title="Courses"
            value={coursesInProgress}
            subtitle="in progress"
            icon={BookOpen}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile === "piyush" && dailyLogsPiyush?.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.date), "MMM d, yyyy")}
                  </span>
                  <span className="font-mono font-medium">
                    {log.dsaQuestionsSolved} DSA
                  </span>
                </div>
              ))}
              {profile === "shruti" && dailyLogsShruti?.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.date), "MMM d, yyyy")}
                  </span>
                  <span className="font-mono font-medium">
                    {log.pythonQuestionsSolved} Py / {log.sqlQuestionsSolved} SQL
                  </span>
                </div>
              ))}
              {((profile === "piyush" && (!dailyLogsPiyush || dailyLogsPiyush.length === 0)) ||
                (profile === "shruti" && (!dailyLogsShruti || dailyLogsShruti.length === 0))) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No daily logs yet. Start tracking your progress!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todos?.filter((t) => !t.completed).slice(0, 5).map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{todo.content}</span>
                </div>
              ))}
              {(!todos || todos.filter((t) => !t.completed).length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All tasks completed! Add more from the TODO page.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
