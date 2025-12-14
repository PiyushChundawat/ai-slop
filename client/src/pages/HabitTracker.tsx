import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Calendar, Flame, Edit2, Check, X } from "lucide-react";
import type { Habit, HabitEntry } from "@shared/schema";
import { format, subDays } from "date-fns";

function getLast10Days() {
  return [...Array(10)].map((_, i) => {
    const date = subDays(new Date(), 9 - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      dayLabel: format(date, "EEE"),
      dateLabel: format(date, "d"),
      isToday: i === 9,
    };
  });
}

export default function HabitTracker() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [newHabit, setNewHabit] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const days = getLast10Days();

  const { data: habits, isLoading: habitsLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits", profile],
  });

  const { data: entries, isLoading: entriesLoading } = useQuery<HabitEntry[]>({
    queryKey: ["/api/habit-entries", profile],
  });

  const addHabitMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiRequest("POST", "/api/habits", { name, profile, sortOrder: habits?.length || 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits", profile] });
      setNewHabit("");
      toast({ title: "Habit added" });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return apiRequest("PATCH", `/api/habits/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits", profile] });
      setEditingId(null);
      toast({ title: "Habit updated" });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits", profile] });
      queryClient.invalidateQueries({ queryKey: ["/api/habit-entries", profile] });
      toast({ title: "Habit deleted" });
    },
  });

  const toggleEntryMutation = useMutation({
    mutationFn: async ({
      habitId,
      date,
      completed,
    }: {
      habitId: string;
      date: string;
      completed: boolean;
    }) => {
      return apiRequest("POST", "/api/habit-entries", { habitId, date, completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habit-entries", profile] });
    },
  });

  const getEntryForHabitAndDate = (habitId: string, date: string) => {
    return entries?.find((e) => e.habitId === habitId && e.date === date);
  };

  const calculateStreak = (habitId: string) => {
    let streak = 0;
    const today = format(new Date(), "yyyy-MM-dd");
    let currentDate = today;

    for (let i = 0; i < 30; i++) {
      const entry = entries?.find(
        (e) => e.habitId === habitId && e.date === currentDate && e.completed
      );
      if (entry) {
        streak++;
        currentDate = format(subDays(new Date(currentDate), 1), "yyyy-MM-dd");
      } else if (i === 0) {
        currentDate = format(subDays(new Date(currentDate), 1), "yyyy-MM-dd");
        const yesterdayEntry = entries?.find(
          (e) => e.habitId === habitId && e.date === currentDate && e.completed
        );
        if (yesterdayEntry) {
          streak++;
          currentDate = format(subDays(new Date(currentDate), 1), "yyyy-MM-dd");
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateCompletion = (habitId: string) => {
    const completedDays = days.filter((d) => {
      const entry = getEntryForHabitAndDate(habitId, d.date);
      return entry?.completed;
    }).length;
    return Math.round((completedDays / 10) * 100);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabitMutation.mutate(newHabit.trim());
    }
  };

  const startEditing = (habit: Habit) => {
    setEditingId(habit.id);
    setEditingName(habit.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEditing = () => {
    if (editingId && editingName.trim()) {
      updateHabitMutation.mutate({ id: editingId, name: editingName.trim() });
    }
  };

  if (habitsLoading || entriesLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Habit Tracker</h1>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Habit Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your daily habits over the last 10 days
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <form onSubmit={handleAddHabit} className="flex gap-2">
            <Input
              placeholder="Add a new habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              data-testid="input-new-habit"
              className="max-w-xs"
            />
            <Button
              type="submit"
              disabled={!newHabit.trim() || addHabitMutation.isPending}
              data-testid="button-add-habit"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </form>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {habits?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No habits yet. Add your first habit above!</p>
              <p className="text-xs mt-1">
                Suggestions: DSA, CP, Contest, Revision, Courses
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-sm min-w-[180px]">
                    Habit
                  </th>
                  {days.map((day) => (
                    <th
                      key={day.date}
                      className={`text-center py-3 px-2 font-medium text-xs min-w-[50px] ${
                        day.isToday ? "bg-primary/10 rounded-t-md" : ""
                      }`}
                    >
                      <div>{day.dayLabel}</div>
                      <div className="text-muted-foreground">{day.dateLabel}</div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-2 font-medium text-sm min-w-[80px]">
                    <Flame className="h-4 w-4 mx-auto" />
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-sm min-w-[60px]">
                    %
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {habits?.map((habit) => {
                  const streak = calculateStreak(habit.id);
                  const completion = calculateCompletion(habit.id);

                  return (
                    <tr key={habit.id} className="border-b last:border-0 group">
                      <td className="py-3 px-2">
                        {editingId === habit.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8 text-sm"
                              autoFocus
                              data-testid={`input-edit-habit-${habit.id}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={saveEditing}
                              className="h-8 w-8"
                              data-testid={`button-save-habit-${habit.id}`}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={cancelEditing}
                              className="h-8 w-8"
                              data-testid={`button-cancel-edit-${habit.id}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{habit.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(habit)}
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              data-testid={`button-edit-habit-${habit.id}`}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      {days.map((day) => {
                        const entry = getEntryForHabitAndDate(habit.id, day.date);
                        return (
                          <td
                            key={day.date}
                            className={`text-center py-3 px-2 ${
                              day.isToday ? "bg-primary/10" : ""
                            }`}
                          >
                            <Checkbox
                              checked={entry?.completed || false}
                              onCheckedChange={(checked) =>
                                toggleEntryMutation.mutate({
                                  habitId: habit.id,
                                  date: day.date,
                                  completed: checked as boolean,
                                })
                              }
                              data-testid={`checkbox-habit-${habit.id}-${day.date}`}
                            />
                          </td>
                        );
                      })}
                      <td className="text-center py-3 px-2">
                        <span className="font-mono text-sm font-semibold text-orange-500">
                          {streak}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className="font-mono text-sm">{completion}%</span>
                      </td>
                      <td className="py-3 px-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteHabitMutation.mutate(habit.id)}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-habit-${habit.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
