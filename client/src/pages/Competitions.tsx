import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Users, ExternalLink, Edit2, Check, X } from "lucide-react";
import type { CaseCompetition } from "@shared/schema";

export default function Competitions() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [competitionName, setCompetitionName] = useState("");
  const [notes, setNotes] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const { data: competitions, isLoading } = useQuery<CaseCompetition[]>({
    queryKey: ["/api/competitions"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { competitionName: string; notes?: string; documentUrl?: string }) => {
      return apiRequest("POST", "/api/competitions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitions"] });
      setShowForm(false);
      setCompetitionName("");
      setNotes("");
      setDocumentUrl("");
      toast({ title: "Competition added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest("PATCH", `/api/competitions/${id}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitions"] });
      setEditingId(null);
      toast({ title: "Notes updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/competitions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitions"] });
      toast({ title: "Competition deleted" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (competitionName.trim()) {
      addMutation.mutate({
        competitionName: competitionName.trim(),
        notes: notes.trim() || undefined,
        documentUrl: documentUrl.trim() || undefined,
      });
    }
  };

  const startEditing = (competition: CaseCompetition) => {
    setEditingId(competition.id);
    setEditNotes(competition.notes || "");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Case Competitions</h1>
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
            <Users className="h-6 w-6" />
            Case Competitions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track case competition participation and learnings
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-competition">
          <Plus className="h-4 w-4 mr-1" />
          Add Competition
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Competition name"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                data-testid="input-competition-name"
              />
              <Textarea
                placeholder="Notes, learnings, and reflections..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                data-testid="input-competition-notes"
              />
              <Input
                placeholder="Document/presentation URL (optional)"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                data-testid="input-competition-url"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-save-competition">
                  Add Competition
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {competitions?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No competitions yet. Add your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {competitions?.map((competition) => {
            const isEditing = editingId === competition.id;

            return (
              <Card key={competition.id} data-testid={`card-competition-${competition.id}`} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium" data-testid={`text-competition-name-${competition.id}`}>
                      {competition.competitionName}
                    </h3>
                    <div className="flex gap-1">
                      {competition.documentUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          data-testid={`button-view-doc-${competition.id}`}
                        >
                          <a href={competition.documentUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(competition)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-edit-competition-${competition.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(competition.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-competition-${competition.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={3}
                        placeholder="Notes..."
                        autoFocus
                        data-testid={`input-edit-notes-${competition.id}`}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateMutation.mutate({ id: competition.id, notes: editNotes })}>
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
                    competition.notes && (
                      <p className="text-sm text-muted-foreground">{competition.notes}</p>
                    )
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-6 bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-2">Competitions Participated</p>
          <p className="text-3xl font-bold font-mono">{competitions?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
