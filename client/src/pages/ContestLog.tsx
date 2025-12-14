import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2, Plus, Trash2 } from "lucide-react";
import type { ContestLog } from "@shared/schema";
import { format } from "date-fns";

export default function ContestLogPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [contestName, setContestName] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [notes, setNotes] = useState("");

  const { data: contests, isLoading } = useQuery<ContestLog[]>({
    queryKey: ["/api/contests"],
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/contests", {
        platform,
        contestName,
        date,
        problemsSolved,
        totalProblems,
        notes: notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contests"] });
      setOpen(false);
      resetForm();
      toast({ title: "Contest logged" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/contests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contests"] });
      toast({ title: "Contest deleted" });
    },
  });

  const resetForm = () => {
    setPlatform("");
    setContestName("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setProblemsSolved(0);
    setTotalProblems(0);
    setNotes("");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Contest Log</h1>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Contest Log
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your contest performance
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-contest">
              <Plus className="h-4 w-4 mr-1" />
              Add Contest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Contest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger data-testid="select-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Codeforces">Codeforces</SelectItem>
                    <SelectItem value="LeetCode">LeetCode</SelectItem>
                    <SelectItem value="CodeChef">CodeChef</SelectItem>
                    <SelectItem value="AtCoder">AtCoder</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Contest Name</Label>
                <Input
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  placeholder="e.g., Div 3 Round 900"
                  data-testid="input-contest-name"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  data-testid="input-contest-date"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Problems Solved</Label>
                  <Input
                    type="number"
                    value={problemsSolved}
                    onChange={(e) => setProblemsSolved(parseInt(e.target.value) || 0)}
                    min={0}
                    data-testid="input-problems-solved"
                  />
                </div>
                <div>
                  <Label>Total Problems</Label>
                  <Input
                    type="number"
                    value={totalProblems}
                    onChange={(e) => setTotalProblems(parseInt(e.target.value) || 0)}
                    min={0}
                    data-testid="input-total-problems"
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you learn? Any observations?"
                  rows={3}
                  data-testid="input-contest-notes"
                />
              </div>
              <Button
                onClick={() => addMutation.mutate()}
                disabled={!platform || !contestName || addMutation.isPending}
                className="w-full"
                data-testid="button-save-contest"
              >
                Save Contest
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {contests?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No contests logged yet. Add your first contest!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium text-sm">Platform</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Contest</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                    <th className="text-center py-3 px-4 font-medium text-sm">Solved</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Notes</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {contests?.map((contest) => (
                    <tr key={contest.id} className="border-b last:border-0 group" data-testid={`contest-row-${contest.id}`}>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium">{contest.platform}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{contest.contestName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(contest.date), "MMM d, yyyy")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-semibold">
                          {contest.problemsSolved}/{contest.totalProblems}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                          {contest.notes || "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(contest.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-contest-${contest.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
