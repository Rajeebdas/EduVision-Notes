import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Heart, Clock, Trash2, Plus } from "lucide-react";
import { CalendarWidget } from "./calendar-widget";
import { NotesStats } from "./notes-stats";
import { QuickActions } from "./quick-actions";
import type { Note } from "@/lib/types";

interface SidebarProps {
  filter: "all" | "favorites" | "recent";
  onFilterChange: (filter: "all" | "favorites" | "recent") => void;
  notes: Note[];
  onCreateNote?: () => void;
}

export function Sidebar({ filter, onFilterChange, notes, onCreateNote }: SidebarProps) {
  const allNotesCount = notes.length;
  const favoritesCount = notes.filter(note => note.isFavorite).length;
  const trashCount = 0; // TODO: Implement trash functionality

  // Calculate tag statistics from actual notes
  const tagStats = notes.reduce((acc, note) => {
    if (note.tags) {
      note.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const tagColors = [
    "bg-purple-500", "bg-blue-500", "bg-green-500", 
    "bg-yellow-500", "bg-red-500"
  ];

  return (
    <aside className="w-80 bg-card border-r border-border overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Quick Navigation */}
        <div className="space-y-2">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onFilterChange("all")}
          >
            <StickyNote className="mr-3 h-4 w-4" />
            <span className="font-medium">All Notes</span>
            <Badge variant="secondary" className="ml-auto">
              {allNotesCount}
            </Badge>
          </Button>
          
          <Button
            variant={filter === "favorites" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onFilterChange("favorites")}
          >
            <Heart className="mr-3 h-4 w-4" />
            <span>Favorites</span>
            <Badge variant="secondary" className="ml-auto">
              {favoritesCount}
            </Badge>
          </Button>
          
          <Button
            variant={filter === "recent" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onFilterChange("recent")}
          >
            <Clock className="mr-3 h-4 w-4" />
            <span>Recent</span>
          </Button>
        </div>

        {/* Quick Actions */}
        <QuickActions onCreateNote={onCreateNote} />

        {/* Calendar Widget */}
        <CalendarWidget />

        {/* Notes Statistics */}
        <NotesStats notes={notes} />

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                Popular Tags
              </h3>
            </div>
            
            <div className="space-y-1">
              {popularTags.map(([tag, count], index) => (
                <Button
                  key={tag}
                  variant="ghost"
                  className="w-full justify-start px-2 py-1 h-auto"
                >
                  <div className={`w-3 h-3 rounded-full ${tagColors[index % tagColors.length]} mr-2`} />
                  <span className="text-sm">{tag}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
