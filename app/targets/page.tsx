"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import { responseProps, usePulseTrendwithTS } from "../hooks/usePulse";
import LinearGaugeWithTargetAndSpAdjuster from "../components/LinearGaugeWithTargetAndSpAdjuster";
import { useEffect, useState } from "react";
import Trend from "../components/Trend";

export type ChartRow = [string, number];
export type ChartData = [string[], ...ChartRow[]];

export default function TargetsPage() {
  const tagName = "RECOVERY_LINE2_CU_LONG";

  const { data } = usePulseTrendwithTS({
    tags: ["RECOVERY_LINE1_CU_LONG", "RECOVERY_LINE2_CU_LONG"],
    num_records: 100,
  });
  const [pv, setPV] = useState<number>();
  const [trend, setTrend] = useState<ChartData>();

  const makeGoogleTrend = (rawData: responseProps[]) => {
    const header: string[] = ["Timestamp", "Value"];
    const chartData: ChartRow[] = rawData.map((item) => [
      item.timestamp,
      item.value,
    ]);
    const chart: ChartData = [header, ...chartData];
    setTrend(chart);
    console.log(chart);
  };

  useEffect(() => {
    if (data) {
      const values = data.filter((item) => item.tagname === tagName); //filter data by tagname
      setPV(values[0].value); //set the pv
      console.log(values);
      makeGoogleTrend(values);
    }
  }, [data]);

  return (
    <Grid columns="5" rows={"1"} m={"3"} gap={"3"}>
      <Box mt={"3"}>
        <LinearGaugeWithTargetAndSpAdjuster
          title="Извличане ред 1"
          description="Реализация на извличането на ред 1."
          target={90}
          actual={pv} //pv
        />
      </Box>

      <Box mt={"3"} className="col-span-4 row-span-0">
        <Card
          style={{
            // width: "100%",
            height: "100%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            overflow: "hidden",
          }}
        >
          <Text size="4" weight="bold">
            Тренд на извличането
          </Text>
          <Text as="p" size="2" color="gray">
            за периода: 2022-01-01 - 2022-01-07
          </Text>
          <Box mt={"3"} height={"100%"}>
            {data && <Trend data={trend!} />}
          </Box>
        </Card>
      </Box>
    </Grid>
  );
}
