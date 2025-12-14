import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Award, ExternalLink, Calendar } from "lucide-react";
import type { Certificate } from "@shared/schema";
import { format } from "date-fns";

export default function Certificates() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates", profile],
  });

  const addMutation = useMutation({
    mutationFn: async (data: { title: string; issuer: string; date: string; fileUrl?: string }) => {
      return apiRequest("POST", "/api/certificates", { ...data, profile });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates", profile] });
      setShowForm(false);
      setTitle("");
      setIssuer("");
      setDate("");
      setFileUrl("");
      toast({ title: "Certificate added" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates", profile] });
      toast({ title: "Certificate deleted" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && issuer.trim() && date) {
      addMutation.mutate({
        title: title.trim(),
        issuer: issuer.trim(),
        date,
        fileUrl: fileUrl.trim() || undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Certificates</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
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
            <Award className="h-6 w-6" />
            Certificates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your certifications and achievements
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-certificate">
          <Plus className="h-4 w-4 mr-1" />
          Add Certificate
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Certificate title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-cert-title"
                />
                <Input
                  placeholder="Issuing organization"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  data-testid="input-cert-issuer"
                />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  data-testid="input-cert-date"
                />
                <Input
                  placeholder="Certificate URL (optional)"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  data-testid="input-cert-url"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending} data-testid="button-save-certificate">
                  Add Certificate
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {certificates?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No certificates yet. Add your first certificate!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates?.map((cert) => (
            <Card key={cert.id} data-testid={`card-certificate-${cert.id}`} className="group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate" data-testid={`text-cert-title-${cert.id}`}>
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(cert.date), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {cert.fileUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        data-testid={`button-view-cert-${cert.id}`}
                      >
                        <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(cert.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-delete-cert-${cert.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
