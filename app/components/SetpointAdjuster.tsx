"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useSetPoint from "../hooks/store";

interface SetpointAdjusterProps {
  min?: number;
  max?: number;
  className?: string;
  unit?: string;
}

export function SetpointAdjuster({
  min = 0,
  max = 100,
  className,
  unit,
}: SetpointAdjusterProps) {
  const { setPoint, setSetPoint, increase, decrease } = useSetPoint();

  return (
    <div className={cn("flex gap-2 w-fit h-12 items-center", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          decrease();
        }}
        className="w-12 px-0"
      >
        <ChevronDown className="h-6 w-6" />
      </Button>

      <div className="relative  flex items-center justify-center">
        <Input
          type="text"
          value={setPoint.toFixed(1)}
          onChange={(e) => setSetPoint(parseFloat(e.target.value))}
          onBlur={() => setSetPoint(setPoint)}
          className="w-28 text-center pr-8 h-9"
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
        onClick={() => increase()}
        className="w-12 px-0"
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
    </div>
  );
}
