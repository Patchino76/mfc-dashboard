"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Flex, Text } from "@radix-ui/themes";

export function BarChartRechartSm({
  chartData,
  min = 0,
  max = 1,
}: {
  chartData: { hour: string; pv: number }[];
  min?: number;
  max?: number;
}) {
  const chartConfig = {
    pv: {
      label: "pv",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const formatDecimal = (value: number) => value.toFixed(3);
  return (
    <>
      <Flex direction="column" gap="1" align={"center"}>
        <Text size="2" weight="bold">
          последни 8 часа
        </Text>
      </Flex>

      <Flex gap="1" align={"center"} mt={"0.5rem"}>
        <ChartContainer className="h-[100px] w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 2)}
            />
            <YAxis domain={[min, max]} hide={true} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={formatDecimal}
            />

            <Bar dataKey="pv" fill="brown" radius={8} minPointSize={0.03}>
              {/* <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={formatDecimal}
              /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </Flex>
    </>
  );
}
