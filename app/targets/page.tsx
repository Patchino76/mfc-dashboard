"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import { responseProps, usePulseTrendwithTS } from "../hooks/usePulse";
import LinearGaugeWithTargetAndSpAdjuster from "../components/LinearGaugeWithTargetAndSpAdjuster";
import { useEffect, useState } from "react";
import Trend from "../components/Trend";
import RadialGoogleGauge from "../components/RadialGoogleGauge";

export type ChartRow = [string, number];
export type ChartData = [string[], ...ChartRow[]];

export default function TargetsPage() {
  const tags = [
    "RECOVERY_LINE1_CU_LONG",
    "CUFLOTAS2-S7-400PV_CU_LINE_1",
    "CUFLOTAS2-S7-400PV_FE_LINE1",
  ];
  const num_records = 100;

  const { data: trendData } = usePulseTrendwithTS({ tags, num_records });
  const [pv, setPV] = useState<number>();
  const [trend, setTrend] = useState<ChartData>();

  //circular gauge
  const [curcularGaugeData, setCircularGaugeData] =
    useState<(string | number)[][]>();

  const makeGoogleTrend = (rawData: responseProps[]) => {
    //chart data
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
    if (trendData) {
      console.log(trendData);
      //set the trend
      const values = trendData.filter((item) => item.tagname === tags[0]); //filter data by tagname for the trend
      setPV(values[0].value); //set the pv
      makeGoogleTrend(values);

      //set the gauges
      const val1 = trendData.filter((item) => item.tagname === tags[1])[0]
        .value;
      const val2 = trendData.filter((item) => item.tagname === tags[2])[0]
        .value;
      let data: (string | number)[][] = [["Label", "Value"]];
      data.push(["Скрап Cu", val1]);
      // data.push(["Скрап Fe", val2]);
      setCircularGaugeData(data);
    }
  }, [trendData]);

  return (
    <Grid columns="5" rows={"2"} m={"10"} gap={"3"} p={"2"}>
      {/* LINEAR GAUGE WIH TARGET */}
      <Box gridColumnStart={"1"}>
        <LinearGaugeWithTargetAndSpAdjuster
          title="Извличане ред 1"
          description="Реализация на извличането на ред 1."
          target={90}
          actual={pv} //pv
        />
      </Box>

      {/* BIG TREND */}
      <Box gridColumnStart={"2"} gridColumnEnd={"6"}>
        <Card
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Text size="4" weight="bold">
            Тренд на извличането
          </Text>
          {/* <Text as="p" size="2" color="gray">
            за периода: 2022-01-01 - 2022-01-07
          </Text> */}
          <Box mt={"0"} height={"100%"}>
            {trendData && <Trend data={trend!} />}
          </Box>
        </Card>
      </Box>

      {/* RADIAL GAUGES */}
      <Box>
        <Card
          style={{
            width: "100%",
            height: "60%",
          }}
        >
          <Flex direction="column" gap="1" align={"center"}>
            <Text size="4" weight="bold">
              Скрап
            </Text>
            <Text as="p" size="2" color="gray">
              моментна стойност [%]
            </Text>
          </Flex>
          <Flex justify={"center"} align={"center"}>
            {trendData && (
              <RadialGoogleGauge
                data={curcularGaugeData!}
                min={0}
                max={0.05}
                greenFrom={0}
                greenTo={0.03}
                yellowFrom={0.03}
                yellowTo={0.04}
                redFrom={0.04}
                redTo={0.05}
              />
            )}
          </Flex>
        </Card>
      </Box>
    </Grid>
  );
}
