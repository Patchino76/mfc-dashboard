"use client";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { SetpointAdjuster } from "./SetpointAdjuster";
import { Card, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import useSetPoint from "../hooks/store";

const LinearGaugeWithTargetAndSpAdjuster = ({
  title = "....",
  description = "....",
  actual = 95.0,
  target = 60,
  min = 80,
  max = 95,
  unit = "%",
}: {
  title?: string;
  description?: string;
  actual?: number;
  target?: number;
  min?: number;
  max?: number;
  sp_step?: number;
  unit?: string;
}) => {
  const data = [{ name: "Actual", value: actual.toFixed(1) }];
  const { setPoint } = useSetPoint();

  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Flex direction="column" gap="1" align={"center"}>
        <Text size="4" weight="bold">
          Извличане
        </Text>
        {/* <Text as="p" size="2" color="gray">
          моментна стойност [%]
        </Text> */}
      </Flex>

      <Flex gap="1" align={"center"} height={"260px"}>
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
              y={setPoint}
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                position: "left",
                value: `SP: ${setPoint.toFixed(1)}%`,
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
                      {value?.toString()}%
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </Flex>

      <Flex direction="column" gap="1" align={"center"}>
        <SetpointAdjuster min={min} max={max} unit={unit} />
      </Flex>
    </Card>
  );
};

export default LinearGaugeWithTargetAndSpAdjuster;
