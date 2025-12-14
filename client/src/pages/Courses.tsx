import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, GraduationCap, Edit2, Check, X } from "lucide-react";
import type { Course } from "@shared/schema";

export default function Courses() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [platform, setPlatform] = useState("");
  const [totalContent, setTotalContent] = useState("100");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCompleted, setEditCompleted] = useState("");

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses", profile],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { courseName: string; platform: string; totalContent: number }) => {
      return apiRequest("POST", "/api/courses", { ...data, profile, completedContent: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", profile] });
      setShowForm(false);
      setCourseName("");
      setPlatform("");
      setTotalContent("100");
      toast({ title: "Course added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, completedContent }: { id: string; completedContent: number }) => {
      return apiRequest("PATCH", `/api/courses/${id}`, { completedContent });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", profile] });
      setEditingId(null);
      toast({ title: "Progress updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", profile] });
      toast({ title: "Course deleted" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseName.trim() && platform.trim()) {
      addMutation.mutate({
        courseName: courseName.trim(),
        platform: platform.trim(),
        totalContent: parseInt(totalContent) || 100,
      });
    }
  };

  const startEditing = (course: Course) => {
    setEditingId(course.id);
    setEditCompleted(course.completedContent.toString());
  };

  const saveEditing = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, completedContent: parseInt(editCompleted) || 0 });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Courses</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
            <GraduationCap className="h-6 w-6" />
            Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your learning progress
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-course">
          <Plus className="h-4 w-4 mr-1" />
          Add Course
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  data-testid="input-course-name"
                />
                <Input
                  placeholder="Platform (e.g., Udemy)"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  data-testid="input-platform"
                />
                <Input
                  type="number"
                  placeholder="Total content (lectures/hours)"
                  value={totalContent}
                  onChange={(e) => setTotalContent(e.target.value)}
                  data-testid="input-total-content"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-save-course">
                  Add Course
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {courses?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No courses yet. Add your first course!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses?.map((course) => {
            const percentage = Math.round((course.completedContent / course.totalContent) * 100);
            const isEditing = editingId === course.id;

            return (
              <Card key={course.id} data-testid={`card-course-${course.id}`} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-medium" data-testid={`text-course-name-${course.id}`}>
                        {course.courseName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{course.platform}</p>
                    </div>
                    <div className="flex gap-1">
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(course)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-edit-course-${course.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(course.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-course-${course.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={percentage} className="h-2" />
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editCompleted}
                          onChange={(e) => setEditCompleted(e.target.value)}
                          className="w-24 h-8"
                          autoFocus
                          data-testid={`input-completed-${course.id}`}
                        />
                        <span className="text-sm text-muted-foreground">/ {course.totalContent}</span>
                        <Button size="icon" variant="ghost" onClick={saveEditing} className="h-8 w-8">
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {course.completedContent} / {course.totalContent} completed
                        </span>
                        <span className="font-mono font-medium">{percentage}%</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
