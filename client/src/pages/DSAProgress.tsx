import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { BarChart3, Plus, Trash2, ExternalLink, Save } from "lucide-react";
import type { A2zProgress, Blind75 } from "@shared/schema";

export default function DSAProgress() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [questionName, setQuestionName] = useState("");
  const [solutionLink, setSolutionLink] = useState("");

  const { data: a2z, isLoading: a2zLoading } = useQuery<A2zProgress>({
    queryKey: ["/api/a2z-progress"],
  });

  const { data: blind75, isLoading: blind75Loading } = useQuery<Blind75[]>({
    queryKey: ["/api/blind75"],
  });

  const [easyTotal, setEasyTotal] = useState(0);
  const [easySolved, setEasySolved] = useState(0);
  const [mediumTotal, setMediumTotal] = useState(0);
  const [mediumSolved, setMediumSolved] = useState(0);
  const [hardTotal, setHardTotal] = useState(0);
  const [hardSolved, setHardSolved] = useState(0);

  useEffect(() => {
    if (a2z) {
      setEasyTotal(a2z.easyTotal);
      setEasySolved(a2z.easySolved);
      setMediumTotal(a2z.mediumTotal);
      setMediumSolved(a2z.mediumSolved);
      setHardTotal(a2z.hardTotal);
      setHardSolved(a2z.hardSolved);
    }
  }, [a2z]);

  const updateA2zMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/a2z-progress", {
        easyTotal,
        easySolved,
        mediumTotal,
        mediumSolved,
        hardTotal,
        hardSolved,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/a2z-progress"] });
      toast({ title: "Progress saved" });
    },
  });

  const addBlind75Mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/blind75", {
        questionName,
        solutionLink: solutionLink || null,
        completed: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blind75"] });
      setOpen(false);
      setQuestionName("");
      setSolutionLink("");
      toast({ title: "Question added" });
    },
  });

  const toggleBlind75Mutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return apiRequest("PATCH", `/api/blind75/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blind75"] });
    },
  });

  const deleteBlind75Mutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/blind75/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blind75"] });
      toast({ title: "Question deleted" });
    },
  });

  const total = easyTotal + mediumTotal + hardTotal;
  const solved = easySolved + mediumSolved + hardSolved;
  const overallPercent = total > 0 ? Math.round((solved / total) * 100) : 0;

  const easyPercent = easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0;
  const mediumPercent = mediumTotal > 0 ? Math.round((mediumSolved / mediumTotal) * 100) : 0;
  const hardPercent = hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0;

  const blind75Completed = blind75?.filter((q) => q.completed).length || 0;
  const blind75Total = blind75?.length || 0;

  if (a2zLoading || blind75Loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">DSA Progress</h1>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          DSA Progress
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your DSA preparation across sheets
        </p>
      </div>

      <Tabs defaultValue="a2z" className="space-y-4">
        <TabsList>
          <TabsTrigger value="a2z" data-testid="tab-a2z">A2Z Striver Sheet</TabsTrigger>
          <TabsTrigger value="blind75" data-testid="tab-blind75">Blind 75</TabsTrigger>
        </TabsList>

        <TabsContent value="a2z" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="md:col-span-1">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
                <p className="text-4xl font-bold font-mono" data-testid="text-overall-percent">
                  {overallPercent}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {solved} / {total} solved
                </p>
                <Progress value={overallPercent} className="mt-4" />
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Progress by Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-green-600 font-medium">Easy</Label>
                      <span className="font-mono text-sm">{easyPercent}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Total</Label>
                        <Input
                          type="number"
                          value={easyTotal}
                          onChange={(e) => setEasyTotal(parseInt(e.target.value) || 0)}
                          min={0}
                          data-testid="input-easy-total"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Solved</Label>
                        <Input
                          type="number"
                          value={easySolved}
                          onChange={(e) => setEasySolved(parseInt(e.target.value) || 0)}
                          min={0}
                          max={easyTotal}
                          data-testid="input-easy-solved"
                        />
                      </div>
                    </div>
                    <Progress value={easyPercent} className="bg-green-100 [&>div]:bg-green-500" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-amber-600 font-medium">Medium</Label>
                      <span className="font-mono text-sm">{mediumPercent}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Total</Label>
                        <Input
                          type="number"
                          value={mediumTotal}
                          onChange={(e) => setMediumTotal(parseInt(e.target.value) || 0)}
                          min={0}
                          data-testid="input-medium-total"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Solved</Label>
                        <Input
                          type="number"
                          value={mediumSolved}
                          onChange={(e) => setMediumSolved(parseInt(e.target.value) || 0)}
                          min={0}
                          max={mediumTotal}
                          data-testid="input-medium-solved"
                        />
                      </div>
                    </div>
                    <Progress value={mediumPercent} className="bg-amber-100 [&>div]:bg-amber-500" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-red-600 font-medium">Hard</Label>
                      <span className="font-mono text-sm">{hardPercent}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Total</Label>
                        <Input
                          type="number"
                          value={hardTotal}
                          onChange={(e) => setHardTotal(parseInt(e.target.value) || 0)}
                          min={0}
                          data-testid="input-hard-total"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Solved</Label>
                        <Input
                          type="number"
                          value={hardSolved}
                          onChange={(e) => setHardSolved(parseInt(e.target.value) || 0)}
                          min={0}
                          max={hardTotal}
                          data-testid="input-hard-solved"
                        />
                      </div>
                    </div>
                    <Progress value={hardPercent} className="bg-red-100 [&>div]:bg-red-500" />
                  </div>
                </div>

                <Button
                  onClick={() => updateA2zMutation.mutate()}
                  disabled={updateA2zMutation.isPending}
                  data-testid="button-save-a2z"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Progress
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blind75">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Blind 75 Questions</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {blind75Completed} / {blind75Total} completed
                </p>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-blind75">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Question</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Question Name</Label>
                      <Input
                        value={questionName}
                        onChange={(e) => setQuestionName(e.target.value)}
                        placeholder="e.g., Two Sum"
                        data-testid="input-question-name"
                      />
                    </div>
                    <div>
                      <Label>Solution Link (optional)</Label>
                      <Input
                        value={solutionLink}
                        onChange={(e) => setSolutionLink(e.target.value)}
                        placeholder="https://..."
                        data-testid="input-solution-link"
                      />
                    </div>
                    <Button
                      onClick={() => addBlind75Mutation.mutate()}
                      disabled={!questionName || addBlind75Mutation.isPending}
                      className="w-full"
                      data-testid="button-save-question"
                    >
                      Add Question
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
              {blind75?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No questions added yet.</p>
                </div>
              )}
              {blind75?.map((question) => (
                <div
                  key={question.id}
                  className="flex items-center gap-3 py-3 px-3 rounded-md hover-elevate group"
                  data-testid={`blind75-item-${question.id}`}
                >
                  <Checkbox
                    checked={question.completed}
                    onCheckedChange={(checked) =>
                      toggleBlind75Mutation.mutate({
                        id: question.id,
                        completed: checked as boolean,
                      })
                    }
                    data-testid={`checkbox-blind75-${question.id}`}
                  />
                  <span
                    className={`flex-1 text-sm ${
                      question.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {question.questionName}
                  </span>
                  {question.solutionLink && (
                    <a
                      href={question.solutionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                      data-testid={`link-solution-${question.id}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBlind75Mutation.mutate(question.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-delete-blind75-${question.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
