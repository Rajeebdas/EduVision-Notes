import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Share, 
  Trash2, 
  Bold, 
  Italic, 
  Underline, 
  Heading, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code,
  Eye,
  Plus
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/lib/types";

interface NoteEditorProps {
  note: Note | null;
  onNoteChange?: () => void;
}

export function NoteEditor({ note, onNoteChange }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update local state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
      setLastSaved(new Date(note.updatedAt));
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setLastSaved(null);
    }
  }, [note]);

  const updateNoteMutation = useMutation({
    mutationFn: async (updates: { title?: string; content?: string; tags?: string[] }) => {
      if (!note) return;
      const response = await apiRequest("PUT", `/api/notes/${note.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setLastSaved(new Date());
      onNoteChange?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!note) return;
      const response = await apiRequest("POST", `/api/notes/${note.id}/favorite`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Success",
        description: note?.isFavorite ? "Removed from favorites" : "Added to favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async () => {
      if (!note) return;
      await apiRequest("DELETE", `/api/notes/${note.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!note) return;
    
    const timeoutId = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        updateNoteMutation.mutate({ title, content, tags });
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, content, note]);

  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSaved.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Saved just now";
    if (diffInMinutes < 60) return `Saved ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `Saved ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col bg-card">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Select a note to edit</h3>
            <p className="text-sm">Choose a note from the list to start editing</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-card">
      {/* Editor Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavoriteMutation.mutate()}
              className={note.isFavorite ? "text-red-500" : "text-muted-foreground"}
            >
              <Heart className="h-5 w-5" fill={note.isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => deleteNoteMutation.mutate()}
              className="text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{formatLastSaved()}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Note Title */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0"
          placeholder="Untitled Note"
        />
        
        {/* Tags */}
        <div className="flex items-center space-x-2 mt-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="border-dashed"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Tag
          </Button>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="border-b border-border p-3">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Underline className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heading className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-2"></div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Link className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Code className="h-4 w-4" />
          </Button>
          
          <div className="ml-auto">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="min-h-[calc(100vh-300px)] border-none shadow-none resize-none focus-visible:ring-0 text-base leading-relaxed"
        />
      </div>
    </div>
  );
}
