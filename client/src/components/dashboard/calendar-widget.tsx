import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";

interface CalendarWidgetProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  notesCount?: Record<string, number>;
}

export function CalendarWidget({ selectedDate, onDateSelect, notesCount = {} }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getNotesForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return notesCount[dateKey] || 0;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Calendar</CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={previousMonth}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={nextMonth}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground text-center p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day) => {
            const notesCount = getNotesForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            
            return (
              <Button
                key={day.toISOString()}
                variant={isSelected ? "default" : "ghost"}
                className={`h-8 w-8 p-0 text-xs relative ${
                  !isSameMonth(day, currentMonth) ? 'text-muted-foreground/50' : ''
                } ${isTodayDate ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => onDateSelect?.(day)}
              >
                <span>{format(day, 'd')}</span>
                {notesCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-primary text-primary-foreground"
                  >
                    {notesCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onDateSelect?.(new Date())}
          >
            <CalendarIcon className="h-3 w-3 mr-2" />
            Today's Notes
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Plus className="h-3 w-3 mr-2" />
            Schedule Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}