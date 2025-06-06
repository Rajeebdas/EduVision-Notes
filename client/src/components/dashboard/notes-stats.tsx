import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, FileText, Heart, Clock, Target } from "lucide-react";
import type { Note } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface NotesStatsProps {
  notes: Note[];
}

export function NotesStats({ notes }: NotesStatsProps) {
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  const recentNotes = notes.filter(note => {
    const noteDate = new Date(note.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate > weekAgo;
  }).length;

  const averageWordsPerNote = notes.length > 0 
    ? Math.round(notes.reduce((acc, note) => acc + note.content.split(' ').length, 0) / notes.length)
    : 0;

  const longestStreak = calculateWritingStreak(notes);
  const completionRate = totalNotes > 0 ? Math.round((notes.filter(note => note.content.length > 50).length / totalNotes) * 100) : 0;

  const stats = [
    {
      title: "Total Notes",
      value: totalNotes,
      icon: FileText,
      color: "text-blue-600",
      description: "All time"
    },
    {
      title: "Favorites",
      value: favoriteNotes,
      icon: Heart,
      color: "text-red-500",
      description: `${totalNotes > 0 ? Math.round((favoriteNotes / totalNotes) * 100) : 0}% of total`
    },
    {
      title: "This Week",
      value: recentNotes,
      icon: Clock,
      color: "text-green-600",
      description: "Recent activity"
    },
    {
      title: "Avg. Words",
      value: averageWordsPerNote,
      icon: TrendingUp,
      color: "text-purple-600",
      description: "Per note"
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Writing Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.title} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Content Completion
              </span>
              <span className="text-xs text-muted-foreground">
                {completionRate}%
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          {longestStreak > 1 && (
            <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
              <Target className="h-4 w-4 text-primary" />
              <div className="text-xs">
                <span className="font-medium">{longestStreak} day streak!</span>
                <span className="text-muted-foreground ml-1">Keep it up</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function calculateWritingStreak(notes: Note[]): number {
  if (notes.length === 0) return 0;

  const sortedDates = notes
    .map(note => new Date(note.createdAt).toDateString())
    .filter((date, index, array) => array.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    const previous = new Date(sortedDates[i - 1]);
    const diffInDays = Math.abs((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) {
      currentStreak++;
      streak = Math.max(streak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return streak;
}