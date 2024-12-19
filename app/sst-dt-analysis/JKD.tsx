"use client";

import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { DtSstProps } from "./ParetoDtSst";

interface DataPoint {
  reason: string;
  mttr: number;
  totalEvents: number;
}

interface JKDProps {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const { reason, mttr, total, label, unit } = payload[0].payload; // Adjust based on your data structure
    return (
      <div className="border border-blue-500 rounded-lg bg-white p-4 shadow-lg">
        <p className="text-blue-500">Категория: {reason}</p>
        <p className="text-purple-500">
          {label} {total} {unit}
        </p>
        <p className="text-orange-500">MTTR: {mttr.toFixed(1)} часа</p>
      </div>
    );
  }
  return null;
};

export function JKD({ sampleData }: DtSstProps) {
  const { meanMttr, meanEvents, stdEvents, xMin, xMax, yMin, yMax } =
    useMemo(() => {
      const total = sampleData.map((d) => d.total);
      const meanMttr =
        sampleData.reduce((sum, d) => sum + d.mttr, 0) / sampleData.length;
      const meanEvents = total.reduce((a, b) => a + b, 0) / total.length;
      const stdEvents = Math.sqrt(
        total.reduce((sq, n) => sq + Math.pow(n - meanEvents, 2), 0) /
          total.length
      );

      const xValues = sampleData.map((d) => d.mttr);
      const yValues = sampleData.map((d) => d.total);
      const paddingX = 0.2;
      const paddingY = 5;
      const xMin = Math.min(...xValues) - paddingX;
      const xMax = Math.max(...xValues) + paddingX;
      const yMin = Math.min(...yValues) - paddingY;
      const yMax = Math.max(...yValues) + paddingY;

      return { meanMttr, meanEvents, stdEvents, xMin, xMax, yMin, yMax };
    }, [sampleData]);
  const range = [
    Math.min(...sampleData.map((d) => d.total)) * 40,
    Math.max(...sampleData.map((d) => d.total)) * 40,
  ];
  return (
    <ResponsiveContainer width="100%" height={700}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis
          type="number"
          dataKey="mttr"
          name="MTTR"
          domain={[xMin, xMax]}
          label={{
            value: "Средно време на отстранване (MTTR) в часове",
            position: "bottom",
            offset: 0,
          }}
        />
        <YAxis
          type="number"
          dataKey="total"
          name="Брой събития"
          domain={[yMin, yMax]}
          label={{
            value: sampleData[0].label + " " + sampleData[0].unit,
            angle: -90,
            position: "insideLeft",
          }}
        />
        <ZAxis type="number" dataKey={"total"} range={range} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ bottom: -10 }} />
        <ReferenceLine
          x={meanMttr}
          label={{
            // value: "Праг на действие",
            position: "top",
            offset: 5,
          }}
          stroke="blue"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={meanEvents + stdEvents}
          label={{
            // value: "Праг на действие",
            position: "top",
            offset: 5,
          }}
          stroke="red"
          strokeDasharray="3 3"
        />
        {sampleData.map((entry, index) => (
          <Scatter
            key={index}
            name={entry.reason}
            data={[entry]}
            fill={`hsl(${(index * 360) / sampleData.length}, 70%, 50%)`}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
