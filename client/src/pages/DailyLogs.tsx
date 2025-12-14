import { useState, useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, TrendingUp, Save, Minus, Plus } from "lucide-react";
import type { DailyLogPiyush, DailyLogShruti } from "@shared/schema";
import { format, subDays } from "date-fns";

export default function DailyLogs() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const today = format(new Date(), "yyyy-MM-dd");
  
  const [selectedDate, setSelectedDate] = useState(today);
  const [dsaCount, setDsaCount] = useState(0);
  const [pythonCount, setPythonCount] = useState(0);
  const [sqlCount, setSqlCount] = useState(0);
  const [notes, setNotes] = useState("");

  const { data: piyushLogs, isLoading: piyushLoading } = useQuery<DailyLogPiyush[]>({
    queryKey: ["/api/daily-logs/piyush"],
    enabled: profile === "piyush",
  });

  const { data: shrutiLogs, isLoading: shrutiLoading } = useQuery<DailyLogShruti[]>({
    queryKey: ["/api/daily-logs/shruti"],
    enabled: profile === "shruti",
  });

  useEffect(() => {
    if (profile === "piyush" && piyushLogs) {
      const log = piyushLogs.find((l) => l.date === selectedDate);
      setDsaCount(log?.dsaQuestionsSolved || 0);
      setNotes(log?.notes || "");
    } else if (profile === "shruti" && shrutiLogs) {
      const log = shrutiLogs.find((l) => l.date === selectedDate);
      setPythonCount(log?.pythonQuestionsSolved || 0);
      setSqlCount(log?.sqlQuestionsSolved || 0);
      setNotes(log?.notes || "");
    }
  }, [profile, piyushLogs, shrutiLogs, selectedDate]);

  const savePiyushMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/daily-logs/piyush", {
        date: selectedDate,
        dsaQuestionsSolved: dsaCount,
        notes: notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-logs/piyush"] });
      toast({ title: "Log saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save log", variant: "destructive" });
    },
  });

  const saveShrutiMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/daily-logs/shruti", {
        date: selectedDate,
        pythonQuestionsSolved: pythonCount,
        sqlQuestionsSolved: sqlCount,
        notes: notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-logs/shruti"] });
      toast({ title: "Log saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save log", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (profile === "piyush") {
      savePiyushMutation.mutate();
    } else {
      saveShrutiMutation.mutate();
    }
  };

  const loadExistingLog = (date: string) => {
    setSelectedDate(date);
    if (profile === "piyush") {
      const log = piyushLogs?.find((l) => l.date === date);
      setDsaCount(log?.dsaQuestionsSolved || 0);
      setNotes(log?.notes || "");
    } else {
      const log = shrutiLogs?.find((l) => l.date === date);
      setPythonCount(log?.pythonQuestionsSolved || 0);
      setSqlCount(log?.sqlQuestionsSolved || 0);
      setNotes(log?.notes || "");
    }
  };

  const logs = profile === "piyush" ? piyushLogs : shrutiLogs;
  const isLoading = profile === "piyush" ? piyushLoading : shrutiLoading;
  const isSaving = profile === "piyush" ? savePiyushMutation.isPending : saveShrutiMutation.isPending;

  const last7Days = [...Array(7)].map((_, i) => format(subDays(new Date(), i), "yyyy-MM-dd"));
  
  let weeklyTotal = 0;
  let allTimeTotal = 0;
  
  if (profile === "piyush" && piyushLogs) {
    piyushLogs.forEach((log) => {
      allTimeTotal += log.dsaQuestionsSolved;
      if (last7Days.includes(log.date)) {
        weeklyTotal += log.dsaQuestionsSolved;
      }
    });
  } else if (profile === "shruti" && shrutiLogs) {
    shrutiLogs.forEach((log) => {
      const total = log.pythonQuestionsSolved + log.sqlQuestionsSolved;
      allTimeTotal += total;
      if (last7Days.includes(log.date)) {
        weeklyTotal += total;
      }
    });
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Daily Logs</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Daily Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your daily {profile === "piyush" ? "DSA" : "Python & SQL"} progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Weekly Total</p>
            <p className="text-3xl font-bold font-mono" data-testid="text-weekly-total">
              {weeklyTotal}
            </p>
            <p className="text-xs text-muted-foreground">last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">All Time</p>
            <p className="text-3xl font-bold font-mono" data-testid="text-alltime-total">
              {allTimeTotal}
            </p>
            <p className="text-xs text-muted-foreground">questions solved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Daily Average</p>
            <p className="text-3xl font-bold font-mono">
              {logs?.length ? Math.round(allTimeTotal / logs.length) : 0}
            </p>
            <p className="text-xs text-muted-foreground">questions/day</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Add/Edit Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => loadExistingLog(e.target.value)}
                max={today}
                data-testid="input-log-date"
              />
            </div>

            {profile === "piyush" ? (
              <div>
                <Label htmlFor="dsa">DSA Questions Solved</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDsaCount(Math.max(0, dsaCount - 1))}
                    data-testid="button-dsa-minus"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    id="dsa"
                    value={dsaCount}
                    onChange={(e) => setDsaCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 text-center font-mono text-lg"
                    min={0}
                    data-testid="input-dsa-count"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDsaCount(dsaCount + 1)}
                    data-testid="button-dsa-plus"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="python">Python Questions Solved</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPythonCount(Math.max(0, pythonCount - 1))}
                      data-testid="button-python-minus"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      id="python"
                      value={pythonCount}
                      onChange={(e) => setPythonCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 text-center font-mono text-lg"
                      min={0}
                      data-testid="input-python-count"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPythonCount(pythonCount + 1)}
                      data-testid="button-python-plus"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="sql">SQL Questions Solved</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSqlCount(Math.max(0, sqlCount - 1))}
                      data-testid="button-sql-minus"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      id="sql"
                      value={sqlCount}
                      onChange={(e) => setSqlCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-24 text-center font-mono text-lg"
                      min={0}
                      data-testid="input-sql-count"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSqlCount(sqlCount + 1)}
                      data-testid="button-sql-plus"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about today's progress..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                data-testid="input-log-notes"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
              data-testid="button-save-log"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
            {logs?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No entries yet. Start logging today!</p>
              </div>
            )}
            {logs?.slice(0, 14).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-3 px-3 rounded-md hover-elevate cursor-pointer border-b last:border-0"
                onClick={() => loadExistingLog(log.date)}
                data-testid={`log-entry-${log.id}`}
              >
                <div>
                  <p className="text-sm font-medium">
                    {format(new Date(log.date), "EEEE, MMM d")}
                  </p>
                  {"notes" in log && log.notes && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {log.notes}
                    </p>
                  )}
                </div>
                <div className="text-right font-mono">
                  {profile === "piyush" ? (
                    <span className="font-semibold">
                      {(log as DailyLogPiyush).dsaQuestionsSolved} DSA
                    </span>
                  ) : (
                    <div className="text-sm">
                      <span className="font-semibold">
                        {(log as DailyLogShruti).pythonQuestionsSolved} Py
                      </span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="font-semibold">
                        {(log as DailyLogShruti).sqlQuestionsSolved} SQL
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
