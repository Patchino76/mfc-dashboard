"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface ProcessTrendProps {
  data: any[];
  parameters: {
    name: string;
    min: number;
    max: number;
    unit: string;
  }[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

export default function ProcessTrend({ data, parameters }: ProcessTrendProps) {
  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        No historical data available. Start the optimization to collect data.
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => format(timestamp, 'HH:mm:ss')}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(timestamp) => format(timestamp, 'HH:mm:ss')}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Legend />
          {parameters.map((param, index) => (
            <Line
              key={param.name}
              type="monotone"
              dataKey={param.name}
              stroke={COLORS[index % COLORS.length]}
              dot={false}
              name={`${param.name} (${param.unit})`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}