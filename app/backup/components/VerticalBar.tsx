"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface VerticalBarProps {
  title?: string;
  min?: number;
  max?: number;
  value: number;
  height?: number;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  target?: number;
  showTargetValue?: boolean;
  targetColor?: string;
  className?: string;
}

export function VerticalBar({
  title,
  min = 0,
  max = 100,
  value,
  height = 200,
  showValue = true,
  valuePrefix = "",
  valueSuffix = "",
  target,
  showTargetValue = true,
  targetColor = "hsl(var(--primary))",
  className,
}: VerticalBarProps) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  const targetPosition = target !== undefined 
    ? ((Math.min(Math.max(target, min), max) - min) / (max - min)) * 100
    : null;

  return (
    <Card className={cn("w-[120px]", className)}>
      <CardHeader className="space-y-0 p-4">
        {title && (
          <>
            <CardTitle className="text-sm text-center">{title}</CardTitle>
            <Separator className="my-2" />
          </>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col items-center gap-2">
          <div className="relative" style={{ height }}>
            <Progress
              value={percentage}
              max={100}
              className="h-full w-8 [&>div]:transition-all [&>div]:duration-500"
              orientation="vertical"
            />
            {showValue && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium">
                {valuePrefix}{clampedValue}{valueSuffix}
              </span>
            )}
            {targetPosition !== null && (
              <div 
                className="absolute w-12 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  bottom: `${targetPosition}%`,
                  transform: 'translateX(-50%) translateY(50%)',
                }}
              >
                <Separator 
                  className="w-full border-dashed border-2" 
                  style={{ borderColor: targetColor }}
                />
                {showTargetValue && (
                  <span 
                    className="absolute right-0 translate-x-[calc(100%+0.5rem)] text-sm whitespace-nowrap"
                    style={{ color: targetColor }}
                  >
                    Target: {valuePrefix}{target}{valueSuffix}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}