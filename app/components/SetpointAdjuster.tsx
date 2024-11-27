"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useSetPoint from "../hooks/store";

interface SetpointAdjusterProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  unit?: string;
}

export function SetpointAdjuster({
  value,
  onChange,
  step = 0.1,
  min = 0,
  max = 100,
  className,
  unit,
}: SetpointAdjusterProps) {
  const [localValue, setLocalValue] = useState(value.toFixed(1));
  const { setPoint, increase, decrease } = useSetPoint();

  const adjustValue = (adjustment: number) => {
    const newValue = Math.min(max, Math.max(min, value + adjustment));
    onChange(newValue);
    setLocalValue(newValue.toFixed(1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseFloat(localValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setLocalValue(value.toString());
    }
  };

  return (
    <div className={cn("flex gap-2 w-fit h-12 items-center", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => adjustValue(-step)}
        className="w-12 px-0"
      >
        <ChevronDown className="h-6 w-6" />
      </Button>

      <div className="relative  flex items-center justify-center">
        <Input
          type="text"
<<<<<<< HEAD
          value={setPoint.toFixed(1)}
          onChange={(e) => setSetPoint(parseFloat(e.target.value))}
          onBlur={() => setSetPoint(setPoint)}
          className="w-20 text-center pr-8 h-9"
=======
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-28 text-center pr-8 h-9"
>>>>>>> parent of 33c15b0 (finished integration of zustand store for the sp of targets)
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => adjustValue(step)}
        className="w-12 px-0"
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
    </div>
  );
}
