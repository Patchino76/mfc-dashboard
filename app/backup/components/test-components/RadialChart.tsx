"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartConfig = {
  value: {
    label: "Value",
  },
  units: {
    label: "Units",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RadialChart({
  value,
  units,
  maxValue,
}: {
  value: number;
  units: string;
  maxValue: number;
}) {
  const chartData = [
    {
      units: `${value} ${units}`,
      visitors: value,
      fill: "var(--color-safari)",
    },
  ];

  // Calculate the dynamic end angle
  const startAngle = 90;
  const baseEndAngle = 450; // 360 degrees span
  const dynamicEndAngle =
    startAngle + ((baseEndAngle - startAngle) * value) / maxValue;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
      style={{ width: "300px", height: "300px" }}
    >
      <RadialBarChart
        data={chartData}
        startAngle={startAngle}
        endAngle={dynamicEndAngle}
        innerRadius={80}
        outerRadius={140}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar
          dataKey="visitors"
          background
          fill="fill-blue-500 !important"
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-blue-500 !important" // Set the color of the text to blue
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold text-blue-500 !important"
                    >
                      {chartData[0].visitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-blue-500 !important"
                    >
                      {units} {/* Display the correct units */}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
