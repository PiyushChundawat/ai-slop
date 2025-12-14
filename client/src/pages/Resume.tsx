import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Save } from "lucide-react";
import type { ResumeSection } from "@shared/schema";

const sectionTypes = [
  { key: "experience", label: "Work Experience" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "achievements", label: "Achievements" },
];

export default function Resume() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("experience");
  const [contents, setContents] = useState<Record<string, string>>({});

  const { data: sections, isLoading } = useQuery<ResumeSection[]>({
    queryKey: ["/api/resume"],
  });

  const saveMutation = useMutation({
    mutationFn: async ({ sectionType, content }: { sectionType: string; content: string }) => {
      return apiRequest("POST", "/api/resume", { sectionType, content, sortOrder: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resume"] });
      toast({ title: "Section saved" });
    },
  });

  const getContent = (sectionType: string) => {
    if (contents[sectionType] !== undefined) {
      return contents[sectionType];
    }
    return sections?.find((s) => s.sectionType === sectionType)?.content || "";
  };

  const handleContentChange = (sectionType: string, value: string) => {
    setContents((prev) => ({ ...prev, [sectionType]: value }));
  };

  const handleSave = (sectionType: string) => {
    const content = getContent(sectionType);
    saveMutation.mutate({ sectionType, content });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Resume</h1>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Resume Builder
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your resume sections
        </p>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-3">
            <TabsList className="w-full justify-start">
              {sectionTypes.map((section) => (
                <TabsTrigger
                  key={section.key}
                  value={section.key}
                  data-testid={`tab-${section.key}`}
                >
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>
          <CardContent>
            {sectionTypes.map((section) => (
              <TabsContent key={section.key} value={section.key} className="space-y-4">
                <Textarea
                  value={getContent(section.key)}
                  onChange={(e) => handleContentChange(section.key, e.target.value)}
                  placeholder={`Enter your ${section.label.toLowerCase()} here...`}
                  rows={12}
                  className="font-mono text-sm"
                  data-testid={`textarea-${section.key}`}
                />
                <Button
                  onClick={() => handleSave(section.key)}
                  disabled={saveMutation.isPending}
                  data-testid={`button-save-${section.key}`}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save {section.label}
                </Button>
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
