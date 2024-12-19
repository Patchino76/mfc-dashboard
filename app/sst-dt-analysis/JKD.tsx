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
    const { reason, totalEvents } = payload[0].payload; // Adjust based on your data structure
    return (
      <div className="border border-blue-500 rounded-lg bg-white p-4 shadow-lg">
        <p className="text-blue-500">Причина: {reason}</p>
        <p className="text-purple-500">Събития: {totalEvents} бр.</p>
      </div>
    );
  }
  return null;
};

export function JKD({ data }: JKDProps) {
  const { meanEvents, stdEvents, xMin, xMax, yMin, yMax } = useMemo(() => {
    const totalEvents = data.map((d) => d.totalEvents);
    const meanEvents =
      totalEvents.reduce((a, b) => a + b, 0) / totalEvents.length;
    const stdEvents = Math.sqrt(
      totalEvents.reduce((sq, n) => sq + Math.pow(n - meanEvents, 2), 0) /
        totalEvents.length
    );

    const xValues = data.map((d) => d.mttr);
    const yValues = data.map((d) => d.totalEvents);
    const paddingX = 0.2;
    const paddingY = 5;
    const xMin = Math.min(...xValues) - paddingX;
    const xMax = Math.max(...xValues) + paddingX;
    const yMin = Math.min(...yValues) - paddingY;
    const yMax = Math.max(...yValues) + paddingY;

    return { meanEvents, stdEvents, xMin, xMax, yMin, yMax };
  }, [data]);
  const range = [
    Math.min(...data.map((d) => d.totalEvents)) * 20,
    Math.max(...data.map((d) => d.totalEvents)) * 20,
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
            value: "Средно време на възстановяване (MTTR) [часове]",
            position: "bottom",
            offset: 0,
          }}
        />
        <YAxis
          type="number"
          dataKey="totalEvents"
          name="Брой събития"
          domain={[yMin, yMax]}
          label={{
            value: "Брой на престои",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <ZAxis type="number" dataKey={"totalEvents"} range={range} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ bottom: 1 }} />
        <ReferenceLine
          y={meanEvents + stdEvents}
          label={{
            value: "Праг на действие",
            position: "top",
            offset: 5,
          }}
          stroke="red"
          strokeDasharray="3 3"
        />
        {data.map((entry, index) => (
          <Scatter
            key={index}
            name={entry.reason}
            data={[entry]}
            fill={`hsl(${(index * 360) / data.length}, 70%, 50%)`}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
