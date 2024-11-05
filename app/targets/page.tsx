"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import {
  DataRecord,
  responseProps,
  usePulseTrendwithTS,
} from "../hooks/usePulse";
import LinearGaugeWithTargetAndSpAdjuster from "../components/LinearGaugeWithTargetAndSpAdjuster";
import { use, useEffect, useState } from "react";
import Trend from "../components/Trend";
import RadialGoogleGauge from "../components/RadialGoogleGauge";
import HtmlPlot from "../components/HtmlPlot";

export type ChartRow = (string | number)[];
export type GoogleChartData = [string[], ...ChartRow[]];
interface DataPoint {
  timestamp: string;
  data: { [key: string]: number };
}

interface DataPoint {
  timestamp: string;
  [key: string]: number | string;
}

export default function TargetsPage() {
  const tags = [
    "RECOVERY_LINE1_CU_LONG",
    "CUFLOTAS2-S7-400PV_CU_LINE_1",
    "CUFLOTAS2-S7-400PV_FE_LINE1",
  ];
  const start = new Date("2024-11-01 00:06:00").toISOString();
  const end = new Date().toISOString();

  const { data: rawData } = usePulseTrendwithTS({ tags, start, end });
  const [pv, setPV] = useState<number>();
  const [googleChart, setGoogleChart] = useState<GoogleChartData>();

  //circular gauge
  const [circGauge1, setCircGauge1] = useState<GoogleChartData>();
  const [circGauge2, setCircGauge2] = useState<GoogleChartData>();

  function flattenData(array: DataPoint[], tags: string[]): ChartRow[] {
    //make flat array [ts, val1, val2, ...]
    return array.map((item) => {
      const values = tags.map((tag) => {
        const value = item.data[tag];
        // console.log(`Tag: ${tag}, Value: ${value}`); // Debugging line
        return value;
      });
      return [item.timestamp, ...values];
    });
  }

  const makeGoogleTrend = (
    header: string[],
    tags: string[],
    rowCounts: number = 1
  ) => {
    const rawArray = flattenData(rawData!, tags);
    const chart: GoogleChartData = [header, ...rawArray];

    const rez = rowCounts === 0 ? chart : chart.slice(0, 2);
    console.log(rez);
    return rez;
  };

  useEffect(() => {
<<<<<<< HEAD
    if (trendData) {
      const processData = (data: DataRecord) => {
        return Object.entries(data).map(([timestamp, values]) => ({
          timestamp,
          ...values,
        }));
      };

      const processedData: DataPoint[] = processData(trendData);
      const keys = tags;

      const filteredData = processedData.map((record) => [
        record.timestamp,
        ...keys.map((key) => record[key] as number), // Extract values for each key
      ]);

      console.log(filteredData);
      //set the trend
      const values = processedData.filter((item) => item.tagname === tags[0]); //filter data by tagname for the trend
      setPV(filteredData[0][1] as number); //set the pv
      makeGoogleTrend(filteredData);
=======
    if (!rawData) return;
>>>>>>> 4aae00da0b7487d44ccb24931b9ea3d586640dde

    // const tags = ["RECOVERY_LINE1_CU_LONG", "CUFLOTAS2-S7-400PV_CU_LINE_1"];
    const rawArray = flattenData(rawData, tags);

    // 1 element - vertical gauge
    setPV(rawArray[0][1] as number);
    // 2 elemet - google trend chart
    const trend = makeGoogleTrend(
      ["Timestamp", "Value"],
      ["RECOVERY_LINE1_CU_LONG"],
      0
    );
    setGoogleChart(trend as GoogleChartData);
    // 3 elemet - google gauge 1
    const gauge1 = makeGoogleTrend(
      ["Cu %", "Value"],
      ["CUFLOTAS2-S7-400PV_CU_LINE_1"],
      1
    );
    setCircGauge1(gauge1 as GoogleChartData);
    // 4 elemet - google gauge 2
    const gauge2 = makeGoogleTrend(
      ["Fe %", "Value"],
      ["CUFLOTAS2-S7-400PV_FE_LINE1"],
      1
    );
    setCircGauge2(gauge2 as GoogleChartData);

    // );
  }, [rawData]);

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
            {rawData && <Trend data={googleChart!} />}
          </Box>
        </Card>
      </Box>

      {/* RADIAL GAUGES */}
      <Box gridColumn={"1"} gridRow={"2"}>
        <Card
          style={{
            width: "100%",
            height: "60%",
          }}
        >
          <Flex direction="column" gap="1" align={"center"}>
            <Text size="4" weight="bold">
              Скрап Cu
            </Text>
            <Text as="p" size="2" color="gray">
              моментна стойност [%]
            </Text>
          </Flex>
          <Flex justify={"center"} align={"center"}>
            {rawData && (
              <RadialGoogleGauge
                data={circGauge1!}
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
      <Box gridColumn={"2"} gridRow={"2"}>
        <Card
          style={{
            width: "100%",
            height: "60%",
          }}
        >
          <Flex direction="column" gap="1" align={"center"}>
            <Text size="4" weight="bold">
              Скрап Fe
            </Text>
            <Text as="p" size="2" color="gray">
              моментна стойност [%]
            </Text>
          </Flex>
          <Flex justify={"center"} align={"center"}>
            {rawData && (
              <RadialGoogleGauge
                data={circGauge2!}
                min={0}
                max={10}
                greenFrom={0}
                greenTo={3}
                yellowFrom={3}
                yellowTo={5}
                redFrom={5}
                redTo={10}
              />
            )}
          </Flex>
        </Card>
      </Box>
      <Box gridColumn={"3"} gridRow={"2"}>
        <HtmlPlot />
      </Box>
    </Grid>
  );
}
