"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

type MachineData = {
  mill: string;
  value: number;
};

interface MillsPerformanceChartProps {
  data: MachineData[];
  title?: string;
}

const blueColorPalette = [
  "#E6F3FF",
  "#CCE7FF",
  "#99CEFF",
  "#66B5FF",
  "#339CFF",
  "#0083FF",
  "#0066CC",
  "#004C99",
  "#003366",
  "#001F3F",
  "#001433",
  "#000A1A",
];

const MillsTotals = ({
  data,
  title = "Преработка на мелнични агрегати",
}: MillsPerformanceChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-medium text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 40,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="mill"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="hsl(var(--foreground))"
                  formatter={(value: number) => value.toFixed(0)}
                />
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={blueColorPalette[index % blueColorPalette.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MillsTotals;
