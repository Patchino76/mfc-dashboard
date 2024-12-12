"use client";

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

interface ShiftsPieChartProps {
  data: { shift: string; value: number }[];
  selectedParam: string;
}

export default function ShiftsPieChartSimple({
  data,
  selectedParam,
}: ShiftsPieChartProps) {
  const id = "shifts-pie";
  const updatedShiftsData = [
    {
      shift: "shift1",
      value: data[0]?.value || 0,
      fill: "var(--color-shift1)",
      label: "Смяна 1",
    },
    {
      shift: "shift2",
      value: data[1]?.value || 0,
      fill: "var(--color-shift2)",
      label: "Смяна 2",
    },
    {
      shift: "shift3",
      value: data[2]?.value || 0,
      fill: "var(--color-shift3)",
      label: "Смяна 3",
    },
  ];

  return (
    <div data-chart={id} className="flex flex-col items-left ">
      <style>{styles}</style>
      <div className="">
        <PieChart width={170} height={200}>
          <Pie
            data={updatedShiftsData} // Use updatedShiftsData here
            dataKey="value"
            nameKey="shift"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const activeData =
                    data[0]?.value + data[1]?.value + data[2]?.value || 0; // Example for accessing value
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {activeData.toFixed(0)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Тотал
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
}
