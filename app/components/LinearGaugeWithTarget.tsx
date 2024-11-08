"use client";
import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { SetpointAdjuster } from "./SetpointAdjuster3";

const LinearGaugeWithTarget = ({
  actual = 95.1,
  target = 60,
  min = 40,
  max = 100,
}: {
  actual?: number;
  target?: number;
  min?: number;
  max?: number;
}) => {
  const data = [{ name: "Actual", value: actual }];
  const [spValue, setSpValue] = React.useState(target);

  return (
    <Card className="w-full max-w-sm m-3">
      <CardHeader>
        <CardTitle className="flex justify-center">Извличане</CardTitle>
        <CardDescription className="flex justify-center">
          Действително спрямо цел
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Value",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[300px] w-full"
        >
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
          >
            <XAxis type="category" dataKey="name" hide />
            <YAxis
              type="number"
              domain={[min, max]}
              tickFormatter={(tick) => `${tick}%`}
            />
            <ReferenceLine
              y={spValue}
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                position: "left",
                value: `SP: ${spValue.toFixed(1)}%`,
                fill: "hsl(var(--destructive))",
                fontSize: 12,
                dx: 60,
                dy: -10,
              }}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={45}>
              <Cell className="fill-blue-500" />
              <LabelList
                dataKey="value"
                position="center"
                content={({ x, y, width, value }) => {
                  const xPos = Number(x) + Number(width) - 3;
                  const yPos = Number(y) + 10;
                  return (
                    <text
                      x={xPos}
                      y={yPos}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="fill-white font-bold"
                    >
                      {value}%
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center">
        <SetpointAdjuster
          value={spValue}
          onChange={setSpValue}
          step={0.1}
          min={min}
          max={max}
          unit="%"
        />
      </CardFooter>
    </Card>
  );
};

export default LinearGaugeWithTarget;
