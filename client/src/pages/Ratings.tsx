import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Edit2, Check, X } from "lucide-react";
import type { CpRating } from "@shared/schema";
import { format } from "date-fns";

const platforms = [
  { name: "Codeforces", color: "text-red-500", bgColor: "bg-red-500/10" },
  { name: "LeetCode", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { name: "CodeChef", color: "text-orange-500", bgColor: "bg-orange-500/10" },
];

export default function Ratings() {
  const { toast } = useToast();
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: ratings, isLoading } = useQuery<CpRating[]>({
    queryKey: ["/api/ratings"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ platform, rating }: { platform: string; rating: number }) => {
      return apiRequest("POST", "/api/ratings", { platform, rating });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ratings"] });
      setEditingPlatform(null);
      toast({ title: "Rating updated" });
    },
  });

  const getRating = (platform: string) => {
    return ratings?.find((r) => r.platform === platform);
  };

  const startEditing = (platform: string) => {
    const current = getRating(platform);
    setEditingPlatform(platform);
    setEditValue(current?.rating?.toString() || "0");
  };

  const saveEditing = () => {
    if (editingPlatform) {
      updateMutation.mutate({
        platform: editingPlatform,
        rating: parseInt(editValue) || 0,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Ratings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Star className="h-6 w-6" />
          Platform Ratings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your competitive programming ratings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const rating = getRating(platform.name);
          const isEditing = editingPlatform === platform.name;

          return (
            <Card key={platform.name} data-testid={`rating-card-${platform.name}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-md text-sm font-medium ${platform.bgColor} ${platform.color}`}>
                    {platform.name}
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(platform.name)}
                      data-testid={`button-edit-${platform.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="text-2xl font-bold font-mono text-center"
                      autoFocus
                      data-testid={`input-rating-${platform.name}`}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={saveEditing}
                        disabled={updateMutation.isPending}
                        className="flex-1"
                        data-testid={`button-save-${platform.name}`}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPlatform(null)}
                        className="flex-1"
                        data-testid={`button-cancel-${platform.name}`}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl font-bold font-mono" data-testid={`text-rating-${platform.name}`}>
                      {rating?.rating || 0}
                    </p>
                    {rating?.updatedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Updated {format(new Date(rating.updatedAt), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
