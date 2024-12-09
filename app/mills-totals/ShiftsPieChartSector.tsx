"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

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

export default function ShiftsPieChartSector({
  data,
  selectedShift,
}: ShiftsPieChartProps) {
  const id = "shifts-pie";

  // Update the shifts data with actual values
  const updatedShiftsData = React.useMemo(() => {
    return shiftsData.map((shiftItem) => ({
      ...shiftItem,
      value: data.find((d) => d.shift === shiftItem.label)?.value || 0,
    }));
  }, [data]);

  const activeIndex = React.useMemo(
    () => updatedShiftsData.findIndex((item) => item.shift === selectedShift),
    [selectedShift, updatedShiftsData]
  );

  return (
    <div data-chart={id} className="flex flex-col items-left ">
      <style>{styles}</style>
      <div className="text-left mb-1">
        <p className="text-sm text-muted-foreground">Преработка по смени [t]</p>
      </div>
      <div className="">
        <PieChart width={170} height={200}>
          <Pie
            data={updatedShiftsData}
            dataKey="value"
            nameKey="shift"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            strokeWidth={5}
            activeIndex={activeIndex}
            activeShape={({
              cx,
              cy,
              innerRadius,
              outerRadius,
              startAngle,
              endAngle,
              fill,
            }: PieSectorDataItem) => (
              <g>
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={innerRadius}
                  outerRadius={Number(outerRadius) + 4}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                />
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={Number(outerRadius) + 8}
                  outerRadius={Number(outerRadius) + 12}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                />
              </g>
            )}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const activeData = updatedShiftsData[activeIndex];
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
                        {activeData.value.toFixed(0)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {activeData.label}
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
