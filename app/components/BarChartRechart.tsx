"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, Flex, Text } from "@radix-ui/themes";

const chartData = [
  { hour: "14", pv: 0.016 },
  { hour: "15", pv: 0.03 },
  { hour: "16", pv: 0.023 },
  { hour: "17", pv: 0.033 },
  { hour: "18", pv: 0.02 },
  { hour: "19", pv: 0.024 },
];

export function BarChartRechart() {
  const chartConfig = {
    pv: {
      label: "pv",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Flex direction="column" gap="1" align={"center"}>
        <Text size="4" weight="bold">
          Скрап Cu - последни 8 часа
        </Text>
      </Flex>
      <Flex gap="1" align={"center"}>
        <ChartContainer className="h-[280px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="pv" fill="brown" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </Flex>
    </Card>
  );
}
