"use client";
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CalendarArrowsProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const CalendarArrows: React.FC<CalendarArrowsProps> = ({
  date,
  onDateChange,
}) => {
  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    if (!isAfterToday(newDate)) {
      onDateChange(newDate);
    }
  };

  const isAfterToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePreviousDay}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && onDateChange(newDate)}
            disabled={(date) => isAfterToday(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextDay}
        disabled={isAfterToday(date)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CalendarArrows;
