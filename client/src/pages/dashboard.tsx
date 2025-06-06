import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { NotesList } from "@/components/dashboard/notes-list";
import { NoteEditor } from "@/components/dashboard/note-editor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/lib/types";

export default function Dashboard() {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "recent">("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes", { search: searchQuery, favorites: filter === "favorites" }],
  });

  const createNoteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/notes", {
        title: "Untitled Note",
        content: "",
        tags: [],
      });
      return response.json();
    },
    onSuccess: (newNote: Note) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setSelectedNoteId(newNote.id);
      toast({
        title: "New note created",
        description: "Start writing your thoughts",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    },
  });

  const selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) || null : null;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + N for new note
      if ((event.metaKey || event.ctrlKey) && event.key === 'n' && !event.shiftKey) {
        event.preventDefault();
        createNoteMutation.mutate();
      }
      // Cmd/Ctrl + K for search focus
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }
      // Escape to clear search
      if (event.key === 'Escape' && searchQuery) {
        setSearchQuery("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [createNoteMutation, searchQuery]);

  const handleCreateNote = () => {
    createNoteMutation.mutate();
  };

  const handleNoteChange = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar 
          filter={filter} 
          onFilterChange={setFilter} 
          notes={notes}
          onCreateNote={handleCreateNote}
        />
        
        <div className="flex flex-1">
          <NotesList
            notes={notes}
            isLoading={isLoading}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            filter={filter}
          />
          
          <NoteEditor
            note={selectedNote}
            onNoteChange={handleNoteChange}
          />
        </div>
      </div>
    </div>
  );
}
