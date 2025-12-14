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
import { Plus, Trash2, CheckSquare } from "lucide-react";
import type { Todo } from "@shared/schema";

export default function TodoList() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [newTodo, setNewTodo] = useState("");

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["/api/todos", profile],
  });

  const addMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/todos", { content, profile });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos", profile] });
      setNewTodo("");
      toast({ title: "Task added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add task", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return apiRequest("PATCH", `/api/todos/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos", profile] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos", profile] });
      toast({ title: "Task deleted" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addMutation.mutate(newTodo.trim());
    }
  };

  const completedCount = todos?.filter((t) => t.completed).length || 0;
  const totalCount = todos?.length || 0;

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">TODO List</h1>
        <Card>
          <CardContent className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            TODO List
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profile === "piyush" ? "Piyush's" : "Shruti's"} tasks
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono" data-testid="text-todo-count">
            {completedCount}/{totalCount}
          </p>
          <p className="text-xs text-muted-foreground">completed</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              data-testid="input-new-todo"
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!newTodo.trim() || addMutation.isPending}
              data-testid="button-add-todo"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </form>
        </CardHeader>
        <CardContent className="space-y-1 max-h-[60vh] overflow-y-auto">
          {todos?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No tasks yet. Add your first task above!</p>
            </div>
          )}
          {todos?.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 py-3 px-3 rounded-md hover-elevate group"
              data-testid={`todo-item-${todo.id}`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={(checked) =>
                  toggleMutation.mutate({
                    id: todo.id,
                    completed: checked as boolean,
                  })
                }
                data-testid={`checkbox-todo-${todo.id}`}
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.content}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-delete-todo-${todo.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
