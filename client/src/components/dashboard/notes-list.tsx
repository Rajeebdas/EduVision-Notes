import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Search, SortDesc, Filter, Paperclip } from "lucide-react";
import type { Note } from "@/lib/types";

interface NotesListProps {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId: number | null;
  onSelectNote: (noteId: number) => void;
  filter: "all" | "favorites" | "recent";
}

export function NotesList({ 
  notes, 
  isLoading, 
  selectedNoteId, 
  onSelectNote, 
  filter 
}: NotesListProps) {
  const getFilterTitle = () => {
    switch (filter) {
      case "favorites":
        return "Favorites";
      case "recent":
        return "Recent";
      default:
        return "All Notes";
    }
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="w-80 bg-card border-r border-border p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">{getFilterTitle()}</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <SortDesc className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search for mobile */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {notes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium mb-2">No notes found</p>
              <p className="text-sm">Create your first note to get started</p>
            </div>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors duration-200 border-l-4 ${
                selectedNoteId === note.id
                  ? "border-primary bg-muted/50"
                  : "border-transparent"
              }`}
              onClick={() => onSelectNote(note.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground truncate flex-1">
                  {note.title || "Untitled Note"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`ml-2 h-6 w-6 ${
                    note.isFavorite ? "text-red-500" : "text-muted-foreground"
                  }`}
                >
                  <Heart className="h-3 w-3" fill={note.isFavorite ? "currentColor" : "none"} />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {truncateContent(note.content)}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
                <div className="flex items-center space-x-2">
                  {note.tags && note.tags.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {note.tags[0]}
                    </Badge>
                  )}
                  {note.content.includes("http") && (
                    <Paperclip className="h-3 w-3" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
