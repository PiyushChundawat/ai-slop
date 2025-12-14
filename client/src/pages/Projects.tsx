import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, FolderOpen, Edit2, Check, X } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Projects() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", profile],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { projectName: string; description?: string; notes?: string }) => {
      return apiRequest("POST", "/api/projects", { ...data, profile });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", profile] });
      setShowForm(false);
      setProjectName("");
      setDescription("");
      setNotes("");
      toast({ title: "Project added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest("PATCH", `/api/projects/${id}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", profile] });
      setEditingId(null);
      toast({ title: "Notes updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", profile] });
      toast({ title: "Project deleted" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      addMutation.mutate({
        projectName: projectName.trim(),
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditNotes(project.notes || "");
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Projects</h1>
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
            <FolderOpen className="h-6 w-6" />
            Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Document and track your projects
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-project">
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                data-testid="input-project-name"
              />
              <Textarea
                placeholder="Project description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                data-testid="input-project-description"
              />
              <Textarea
                placeholder="Notes, technologies used, learnings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                data-testid="input-project-notes"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-save-project">
                  Add Project
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {projects?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No projects added yet. Add your first project!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects?.map((project) => {
            const isEditing = editingId === project.id;

            return (
              <Card key={project.id} data-testid={`card-project-${project.id}`} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium" data-testid={`text-project-name-${project.id}`}>
                        {project.projectName}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(project)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-edit-project-${project.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(project.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-project-${project.id}`}
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
                        data-testid={`input-edit-notes-${project.id}`}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateMutation.mutate({ id: project.id, notes: editNotes })}>
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
                    project.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm">{project.notes}</p>
                      </div>
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
          <p className="text-sm font-medium mb-2">Total Projects</p>
          <p className="text-3xl font-bold font-mono">{projects?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
