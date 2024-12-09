"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

// Define the chart styles
const styles = `
  [data-chart="shifts-pie"] {
    --color-shift1: hsl(var(--chart-1));
    --color-shift2: hsl(var(--chart-2));
    --color-shift3: hsl(var(--chart-3));
  }
`;

interface ShiftData {
  shift: string;
  value: number;
  fill: string;
  label: string;
}

const shiftsData: ShiftData[] = [
  { shift: "shift1", value: 0, fill: "var(--color-shift1)", label: "Смяна 1" },
  { shift: "shift2", value: 0, fill: "var(--color-shift2)", label: "Смяна 2" },
  { shift: "shift3", value: 0, fill: "var(--color-shift3)", label: "Смяна 3" },
];

interface ShiftsPieChartProps {
  data: { shift: string; value: number }[];
  selectedShift: string;
}

export function ShiftsPieChartSimple({ data }: ShiftsPieChartProps) {
  const id = "shifts-pie";
  const chartConfig = {};
  return (
    <div data-chart={id} className="flex flex-col items-left ">
      <style>{styles}</style>
      <div className="text-left mb-1">
        <p className="text-sm text-muted-foreground">Преработка по смени [t]</p>
      </div>
      <div className="">
        <ChartContainer config={chartConfig}>
          <PieChart width={170} height={200}>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="shift"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              fill="hsl(var(--chart-1))"
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
