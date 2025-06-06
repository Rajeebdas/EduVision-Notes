import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Share2, 
  Archive, 
  Bookmark,
  Filter,
  Zap,
  Clock
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onCreateNote?: () => void;
  onImportNotes?: () => void;
  onExportNotes?: () => void;
}

export function QuickActions({ onCreateNote, onImportNotes, onExportNotes }: QuickActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTemplateMutation = useMutation({
    mutationFn: async (template: string) => {
      const templates = {
        meeting: {
          title: "Meeting Notes - " + new Date().toLocaleDateString(),
          content: `# Meeting Notes

## Date: ${new Date().toLocaleDateString()}
## Attendees:
- 

## Agenda:
1. 
2. 
3. 

## Action Items:
- [ ] 
- [ ] 
- [ ] 

## Next Steps:
`
        },
        daily: {
          title: "Daily Journal - " + new Date().toLocaleDateString(),
          content: `# Daily Journal

## Date: ${new Date().toLocaleDateString()}

### What went well today:
- 

### Challenges:
- 

### Tomorrow's priorities:
1. 
2. 
3. 

### Gratitude:
- 
`
        },
        todo: {
          title: "Task List - " + new Date().toLocaleDateString(),
          content: `# Task List

## Priority Tasks
- [ ] 
- [ ] 
- [ ] 

## Regular Tasks
- [ ] 
- [ ] 
- [ ] 

## Notes:
`
        }
      };

      const templateData = templates[template as keyof typeof templates];
      if (!templateData) throw new Error("Template not found");

      const response = await apiRequest("POST", "/api/notes", templateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Template created",
        description: "New note created from template",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    },
  });

  const quickActions = [
    {
      icon: Plus,
      label: "New Note",
      description: "Start writing",
      color: "text-blue-600",
      action: onCreateNote
    },
    {
      icon: Zap,
      label: "Meeting Notes",
      description: "Template",
      color: "text-purple-600",
      action: () => createTemplateMutation.mutate("meeting")
    },
    {
      icon: Clock,
      label: "Daily Journal",
      description: "Template",
      color: "text-green-600",
      action: () => createTemplateMutation.mutate("daily")
    },
    {
      icon: Bookmark,
      label: "Task List",
      description: "Template", 
      color: "text-orange-600",
      action: () => createTemplateMutation.mutate("todo")
    }
  ];

  const utilityActions = [
    {
      icon: Search,
      label: "Advanced Search",
      action: () => toast({ title: "Coming soon", description: "Advanced search feature" })
    },
    {
      icon: Download,
      label: "Export Notes",
      action: onExportNotes
    },
    {
      icon: Upload,
      label: "Import Notes", 
      action: onImportNotes
    },
    {
      icon: Share2,
      label: "Share Collection",
      action: () => toast({ title: "Coming soon", description: "Share collection feature" })
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center space-y-1"
                onClick={action.action}
                disabled={createTemplateMutation.isPending}
              >
                <action.icon className={`h-4 w-4 ${action.color}`} />
                <span className="text-xs font-medium">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {utilityActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="w-full justify-start h-auto p-2"
              onClick={action.action}
            >
              <action.icon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}