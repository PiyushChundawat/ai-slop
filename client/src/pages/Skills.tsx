import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Wrench, Edit2, Check, X } from "lucide-react";
import type { Skill } from "@shared/schema";

export default function Skills() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills", profile],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { skillName: string; notes?: string }) => {
      return apiRequest("POST", "/api/skills", { ...data, profile });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills", profile] });
      setShowForm(false);
      setSkillName("");
      setNotes("");
      toast({ title: "Skill added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest("PATCH", `/api/skills/${id}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills", profile] });
      setEditingId(null);
      toast({ title: "Notes updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills", profile] });
      toast({ title: "Skill deleted" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillName.trim()) {
      addMutation.mutate({
        skillName: skillName.trim(),
        notes: notes.trim() || undefined,
      });
    }
  };

  const startEditing = (skill: Skill) => {
    setEditingId(skill.id);
    setEditNotes(skill.notes || "");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Skills</h1>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
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
            <Wrench className="h-6 w-6" />
            Skills
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and document your skills
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-skill">
          <Plus className="h-4 w-4 mr-1" />
          Add Skill
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Skill name (e.g., Python, SQL, Excel, Tableau)"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                data-testid="input-skill-name"
              />
              <Textarea
                placeholder="Notes (experience, projects used in, etc.)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                data-testid="input-skill-notes"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-save-skill">
                  Add Skill
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {skills?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No skills added yet. Start documenting your skills!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {skills?.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="text-sm">
                {skill.skillName}
              </Badge>
            ))}
          </div>
          <div className="space-y-4">
            {skills?.map((skill) => {
              const isEditing = editingId === skill.id;

              return (
                <Card key={skill.id} data-testid={`card-skill-${skill.id}`} className="group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium" data-testid={`text-skill-name-${skill.id}`}>
                          {skill.skillName}
                        </h3>
                        {isEditing ? (
                          <div className="space-y-2 mt-2">
                            <Textarea
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              rows={3}
                              placeholder="Notes..."
                              autoFocus
                              data-testid={`input-edit-notes-${skill.id}`}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => updateMutation.mutate({ id: skill.id, notes: editNotes })}>
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
                          skill.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{skill.notes}</p>
                          )
                        )}
                      </div>
                      <div className="flex gap-1">
                        {!isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(skill)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`button-edit-skill-${skill.id}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(skill.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-skill-${skill.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <Card className="mt-6 bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-2">Total Skills</p>
          <p className="text-3xl font-bold font-mono">{skills?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
