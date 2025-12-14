import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Calendar } from "lucide-react";

const contestSchedule = [
  {
    platform: "Codeforces",
    name: "Div 4",
    day: "Friday",
    time: "8:05 PM IST",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    platform: "Codeforces",
    name: "Div 3",
    day: "Sunday",
    time: "8:05 PM IST",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    platform: "LeetCode",
    name: "Weekly Contest",
    day: "Sunday",
    time: "8:00 AM IST",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    platform: "LeetCode",
    name: "Biweekly Contest",
    day: "Saturday",
    time: "8:00 PM IST",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    platform: "CodeChef",
    name: "Starters",
    day: "Wednesday",
    time: "8:00 PM IST",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
];

export default function CPDashboard() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Competitive Programming
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Weekly contest schedule and preparation dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Contest Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contestSchedule.map((contest, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-3 px-4 rounded-lg border ${
                  contest.day === today ? "bg-primary/5 border-primary/20" : ""
                }`}
                data-testid={`contest-${index}`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={contest.color}>
                    {contest.platform}
                  </Badge>
                  <span className="font-medium text-sm">{contest.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{contest.day}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="h-3 w-3" />
                    {contest.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm mb-2">Before Contest</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Review templates and snippets</li>
                <li>Check your IDE setup</li>
                <li>Stay hydrated, take breaks</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm mb-2">During Contest</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Read all problems first</li>
                <li>Start with easier ones</li>
                <li>Check edge cases before submitting</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm mb-2">After Contest</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Upsolve unsolved problems</li>
                <li>Note learnings and patterns</li>
                <li>Review editorials</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
