"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const months = [
  "Януари",
  "Февруари",
  "Март",
  "Април",
  "Май",
  "Юни",
  "Юли",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
];

interface MonthYearPickerProps {
  onSelect: (year: number, month: number) => void;
}

export default function MonthYearPicker({ onSelect }: MonthYearPickerProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (month: number) => {
    setSelectedMonth(month);
    setIsOpen(false);
    onSelect(selectedYear, month);
  };

  const changeYear = (increment: number) => {
    const newYear = selectedYear + increment;
    if (newYear <= currentYear) {
      setSelectedYear(newYear);
      if (newYear === currentYear && selectedMonth > currentMonth) {
        setSelectedMonth(currentMonth);
      }
    }
  };

  const isMonthDisabled = (month: number) => {
    return selectedYear === currentYear && month > currentMonth;
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {`${months[selectedMonth]} ${selectedYear}`}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-[300px] p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
          sideOffset={5}
        >
          <div className="flex justify-between items-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => changeYear(-1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{selectedYear}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => changeYear(1)}
              className="h-8 w-8 p-0"
              disabled={selectedYear === currentYear}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                onClick={() => handleSelect(index)}
                disabled={isMonthDisabled(index)}
                variant="ghost"
                className={cn(
                  "h-10 px-2 py-1 text-sm font-medium rounded-md transition-colors duration-200",
                  selectedMonth === index && selectedYear === currentYear
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                    : isMonthDisabled(index)
                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {month}
              </Button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
