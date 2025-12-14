import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, BookOpen, Calendar, Edit2, Check, X } from "lucide-react";
import type { CaseStudy } from "@shared/schema";
import { format } from "date-fns";

export default function CaseStudies() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const { data: caseStudies, isLoading } = useQuery<CaseStudy[]>({
    queryKey: ["/api/case-studies"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { title: string; date: string; notes?: string }) => {
      return apiRequest("POST", "/api/case-studies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      setShowForm(false);
      setTitle("");
      setNotes("");
      toast({ title: "Case study added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest("PATCH", `/api/case-studies/${id}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      setEditingId(null);
      toast({ title: "Notes updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/case-studies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      toast({ title: "Case study deleted" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && date) {
      addMutation.mutate({
        title: title.trim(),
        date,
        notes: notes.trim() || undefined,
      });
    }
  };

  const startEditing = (study: CaseStudy) => {
    setEditingId(study.id);
    setEditNotes(study.notes || "");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Case Studies</h1>
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
            <BookOpen className="h-6 w-6" />
            Case Studies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Practice and track case study analysis
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-case-study">
          <Plus className="h-4 w-4 mr-1" />
          Add Case Study
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Case study title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-case-title"
                />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  data-testid="input-case-date"
                />
              </div>
              <Textarea
                placeholder="Notes and key learnings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                data-testid="input-case-notes"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-save-case-study">
                  Add Case Study
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {caseStudies?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No case studies yet. Start practicing!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {caseStudies?.map((study) => {
            const isEditing = editingId === study.id;

            return (
              <Card key={study.id} data-testid={`card-case-study-${study.id}`} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-medium" data-testid={`text-case-title-${study.id}`}>
                        {study.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(study.date), "MMM d, yyyy")}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(study)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-edit-case-${study.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(study.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-case-${study.id}`}
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
                        autoFocus
                        data-testid={`input-edit-notes-${study.id}`}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateMutation.mutate({ id: study.id, notes: editNotes })}>
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
                    study.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{study.notes}</p>
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
          <p className="text-sm font-medium mb-2">Case Studies Completed</p>
          <p className="text-3xl font-bold font-mono">{caseStudies?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
