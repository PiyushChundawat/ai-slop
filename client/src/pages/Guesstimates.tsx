import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Lightbulb, Edit2, Check, X } from "lucide-react";
import type { Guesstimate } from "@shared/schema";

export default function Guesstimates() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState("");
  const [learnings, setLearnings] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLearnings, setEditLearnings] = useState("");

  const { data: guesstimates, isLoading } = useQuery<Guesstimate[]>({
    queryKey: ["/api/guesstimates"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { topic: string; learnings?: string; notes?: string }) => {
      return apiRequest("POST", "/api/guesstimates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guesstimates"] });
      setShowForm(false);
      setTopic("");
      setLearnings("");
      setNotes("");
      toast({ title: "Guesstimate added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, learnings }: { id: string; learnings: string }) => {
      return apiRequest("PATCH", `/api/guesstimates/${id}`, { learnings });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guesstimates"] });
      setEditingId(null);
      toast({ title: "Learnings updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/guesstimates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guesstimates"] });
      toast({ title: "Guesstimate deleted" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      addMutation.mutate({
        topic: topic.trim(),
        learnings: learnings.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }
  };

  const startEditing = (guesstimate: Guesstimate) => {
    setEditingId(guesstimate.id);
    setEditLearnings(guesstimate.learnings || "");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Guesstimates</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Guesstimates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Practice market sizing and estimation problems
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-guesstimate">
          <Plus className="h-4 w-4 mr-1" />
          Add Guesstimate
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Guesstimate topic (e.g., 'Estimate Uber rides in NYC per day')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                data-testid="input-guesstimate-topic"
              />
              <Textarea
                placeholder="Key learnings and approach..."
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                rows={3}
                data-testid="input-guesstimate-learnings"
              />
              <Textarea
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                data-testid="input-guesstimate-notes"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-save-guesstimate">
                  Add Guesstimate
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {guesstimates?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No guesstimates yet. Start practicing!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {guesstimates?.map((guesstimate) => {
            const isEditing = editingId === guesstimate.id;

            return (
              <Card key={guesstimate.id} data-testid={`card-guesstimate-${guesstimate.id}`} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium" data-testid={`text-guesstimate-topic-${guesstimate.id}`}>
                      {guesstimate.topic}
                    </h3>
                    <div className="flex gap-1">
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(guesstimate)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-edit-guesstimate-${guesstimate.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(guesstimate.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-guesstimate-${guesstimate.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editLearnings}
                        onChange={(e) => setEditLearnings(e.target.value)}
                        rows={3}
                        placeholder="Key learnings..."
                        autoFocus
                        data-testid={`input-edit-learnings-${guesstimate.id}`}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateMutation.mutate({ id: guesstimate.id, learnings: editLearnings })}>
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {guesstimate.learnings && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Learnings:</p>
                          <p className="text-sm">{guesstimate.learnings}</p>
                        </div>
                      )}
                      {guesstimate.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{guesstimate.notes}</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-6 bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-2">Guesstimates Practiced</p>
          <p className="text-3xl font-bold font-mono">{guesstimates?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
