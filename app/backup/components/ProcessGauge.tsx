"use client";

import { Progress } from "@/components/ui/progress";

interface ProcessGaugeProps {
  value: number;
  min: number;
  max: number;
  title: string;
  unit: string;
  lowLimit: number;
  highLimit: number;
}

export default function ProcessGauge({ value, min, max, title, unit, lowLimit, highLimit }: ProcessGaugeProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const lowLimitPercentage = ((lowLimit - min) / (max - min)) * 100;
  const highLimitPercentage = ((highLimit - min) / (max - min)) * 100;
  
  const isOutOfLimits = value < lowLimit || value > highLimit;

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-center">{title}</h3>
      <div className="w-full flex justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${isOutOfLimits ? 'text-destructive' : ''}`}>
              {value.toFixed(1)}
              <span className="text-sm ml-1">{unit}</span>
            </span>
          </div>
          <div className="absolute bottom-0 w-full">
            <div className="relative">
              <div className="absolute w-px h-3 bg-yellow-500" style={{ left: `${lowLimitPercentage}%`, bottom: '8px' }} />
              <div className="absolute w-px h-3 bg-yellow-500" style={{ left: `${highLimitPercentage}%`, bottom: '8px' }} />
              <Progress
                value={percentage}
                className="h-2"
                indicatorClassName={isOutOfLimits ? 'bg-destructive' : undefined}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}