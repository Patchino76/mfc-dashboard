"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "recharts";

interface DataPoint {
  Reason: string;
  MTTR: number;
  TotalEvents: number;
}

interface JKDProps {
  data: DataPoint[];
}

export function JKD({ data }: JKDProps) {
  const { meanEvents, stdEvents, xMin, xMax, yMin, yMax } = useMemo(() => {
    const totalEvents = data.map((d) => d.TotalEvents);
    const meanEvents =
      totalEvents.reduce((a, b) => a + b, 0) / totalEvents.length;
    const stdEvents = Math.sqrt(
      totalEvents.reduce((sq, n) => sq + Math.pow(n - meanEvents, 2), 0) /
        totalEvents.length
    );

    const xValues = data.map((d) => d.MTTR);
    const yValues = data.map((d) => d.TotalEvents);
    const paddingX = 0.2;
    const paddingY = 5;
    const xMin = Math.min(...xValues) - paddingX;
    const xMax = Math.max(...xValues) + paddingX;
    const yMin = Math.min(...yValues) - paddingY;
    const yMax = Math.max(...yValues) + paddingY;

    return { meanEvents, stdEvents, xMin, xMax, yMin, yMax };
  }, [data]);
  const range = [
    Math.min(...data.map((d) => d.TotalEvents)) * 20,
    Math.max(...data.map((d) => d.TotalEvents)) * 20,
  ];
  return (
    // <Card className="w-full max-w-4xl">
    //   <CardHeader>
    //     <CardTitle>Диаграма - Jack-Knife</CardTitle>
    //     <CardDescription>Анализ на престоите по причини</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    <ResponsiveContainer width="100%" height={500}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis
          type="number"
          dataKey="MTTR"
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
          dataKey="TotalEvents"
          name="Total Events"
          domain={[yMin, yMax]}
          label={{
            value: "Брой на престои",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <ZAxis type="number" dataKey={"TotalEvents"} range={range} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
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
            name={entry.Reason}
            data={[entry]}
            fill={`hsl(${(index * 360) / data.length}, 70%, 50%)`}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
    //   </CardContent>
    // </Card>
  );
}
