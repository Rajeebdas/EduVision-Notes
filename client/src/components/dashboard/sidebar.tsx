import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Heart, Clock, Trash2, Plus } from "lucide-react";
import type { Note } from "@/lib/types";

interface SidebarProps {
  filter: "all" | "favorites" | "recent";
  onFilterChange: (filter: "all" | "favorites" | "recent") => void;
  notes: Note[];
}

export function Sidebar({ filter, onFilterChange, notes }: SidebarProps) {
  const allNotesCount = notes.length;
  const favoritesCount = notes.filter(note => note.isFavorite).length;
  const trashCount = 0; // TODO: Implement trash functionality

  const tags = [
    { name: "Personal", color: "bg-blue-500", count: 5 },
    { name: "Work", color: "bg-green-500", count: 8 },
    { name: "Ideas", color: "bg-purple-500", count: 3 },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        {/* Quick Actions */}
        <div className="space-y-2 mb-6">
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
          
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
          >
            <Trash2 className="mr-3 h-4 w-4" />
            <span>Trash</span>
            <Badge variant="secondary" className="ml-auto">
              {trashCount}
            </Badge>
          </Button>
        </div>

        {/* Tags/Categories */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
              Tags
            </h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1">
            {tags.map((tag) => (
              <Button
                key={tag.name}
                variant="ghost"
                className="w-full justify-start px-2 py-1 h-auto"
              >
                <div className={`w-3 h-3 rounded-full ${tag.color} mr-2`} />
                <span className="text-sm">{tag.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {tag.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
