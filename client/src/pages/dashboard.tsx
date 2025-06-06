import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { NotesList } from "@/components/dashboard/notes-list";
import { NoteEditor } from "@/components/dashboard/note-editor";
import { useQuery } from "@tanstack/react-query";
import type { Note } from "@/lib/types";

export default function Dashboard() {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favorites" | "recent">("all");

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes", { search: searchQuery, favorites: filter === "favorites" }],
  });

  const selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar filter={filter} onFilterChange={setFilter} notes={notes} />
        
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
            onNoteChange={() => {
              // Refresh notes list when note changes
            }}
          />
        </div>
      </div>
    </div>
  );
}
