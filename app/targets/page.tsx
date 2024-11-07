"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import {
  useLastRecords,
  usePulsePng,
  usePulseTrendwithTS,
} from "../hooks/usePulse";
import Image from "next/image";
import { useEffect, useState } from "react";
import Trend from "../components/Trend";
import RadialGoogleGauge from "../components/RadialGoogleGauge";
import LinearGaugeWithTargetAndSpAdjuster2 from "../components/LinearGaugeWithTargetAndSpAdjuster2";
import MyMonthPicker from "../components/MyMonthPicker";
import { BarChartRechart } from "../components/BarChartRechart";
import { BarChartRechart2 } from "../components/BarChartRechart2";
import { getDateWithLessHours } from "../utils/dateUtils";

export type ChartRow = (string | number)[];
export type GoogleChartData = [string[], ...ChartRow[]];
interface DataPoint {
  timestamp: string;
  data: { [key: string]: number };
}

export default function TargetsPage() {
  const tags = [
    "RECOVERY_LINE1_CU_LONG",
    "CUFLOTAS2-S7-400PV_CU_LINE_1",
    "CUFLOTAS2-S7-400PV_FE_LINE1",
  ];
  const start = new Date("2024-11-01 00:06:00").toISOString();
  const start8h = getDateWithLessHours(8, new Date());
  const end = new Date().toISOString();

  //HOOKS------------------------------------------------------------------
  const { data: rawData } = usePulseTrendwithTS({ tags, start, end }, 30);
  const { data: lastRecs } = useLastRecords(tags, 20);
  const { data: imageUrl, isLoading, error } = usePulsePng();

  const [pv, setPV] = useState<number>();
  const [googleChart, setGoogleChart] = useState<GoogleChartData>();

  //circular gauge
  const [circGauge1, setCircGauge1] = useState<GoogleChartData>();
  const [circGauge2, setCircGauge2] = useState<GoogleChartData>();

  // ARRAY HELPERS----------------------------------------------------------
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

  // FUCTIONS FOR MAKING TRENDS AND CHARTS---------------------------------
  const makeGoogleTrend = (header: string[], tags: string[], sp?: number) => {
    let rawArray = flattenData(rawData!, tags);
    if (sp) rawArray = rawArray.map((row: ChartRow) => [...row, sp]);
    const chart: GoogleChartData = [header, ...rawArray];
    return chart;
  };

  const makeGoogleGauge = (header: string[], value: number, unit: string) => {
    const gauge: GoogleChartData = [header, [unit, value]];
    return gauge;
  };

  const makeRechartBarchart = (tag: string, hoursBack: number = 8) => {
    let rawArray = flattenData(rawData!.slice(0, hoursBack), tags);
    const index = tags.indexOf(tag);

    const values = rawArray.map((row) => row[index + 1]);
    // console.log(rawArray[index + 1]);
    console.log(values);

    // return chart;
  };

  // USE EFFFECTS----------------------------------------------------------
  useEffect(() => {
    if (!rawData) return;

    // 2 elemet - google trend chart
    const trend = makeGoogleTrend(
      ["Timestamp", "Value", "SP"],
      ["RECOVERY_LINE1_CU_LONG"],
      90
    );
    setGoogleChart(trend as GoogleChartData);

    makeRechartBarchart("RECOVERY_LINE1_CU_LONG");
  }, [rawData]);

  useEffect(() => {
    if (lastRecs) {
      // 1 element - vertical gauge
      setPV(lastRecs[0]);
      // 3 elemet - google gauge 1
      const gauge1 = makeGoogleGauge(["Cu %", "Value"], lastRecs[1], "%");
      setCircGauge1(gauge1 as GoogleChartData);

      // 4 elemet - google gauge 2
      const gauge2 = makeGoogleGauge(["Fe %", "Value"], lastRecs[2], "%");
      setCircGauge2(gauge2 as GoogleChartData);
    }
  }, [lastRecs]);

  const handleMonthSelect = (year: number, month: number) => {
    console.log(`Selected: ${month + 1}/${year}`);
    // Do something with the selected year and month
  };

  return (
    <Grid
      columns="5"
      rows="350px 500px"
      gap={"1"}
      p={"1"}
      style={{ border: "1px solid black" }}
    >
      {/* <div style={{ border: "1px solid red" }}>Item 1</div>
      <div style={{ border: "1px solid red" }}>Item 2</div>
      <div style={{ border: "1px solid red" }}>Item 3</div>
      <div style={{ border: "1px solid red" }}>Item 4</div>
      <div style={{ border: "1px solid red" }}>Item 5</div>
      <div style={{ border: "1px solid red" }}>Item 6</div> */}

      {/* LINEAR GAUGE WIH TARGET */}
      <Box gridColumnStart={"1"} gridRow={"1"}>
        <LinearGaugeWithTargetAndSpAdjuster2
          title="Извличане ред 1"
          description="Реализация на извличането на ред 1."
          target={90}
          actual={pv} //pv
        />
      </Box>

      {/* RADIAL GAUGES */}
      <Box gridColumn={"2"} gridRow={"1"}>
        <Card
          style={{
            width: "100%",
            height: "100%",
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
      <Box gridColumn={"3"} gridRow={"1"}>
        <Card
          style={{
            width: "100%",
            height: "100%",
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

      {/* BAR CHART RECHART */}
      <Box gridRow={"1"} gridColumn={"4"}>
        <BarChartRechart />
      </Box>
      {/* BIG TREND */}
      <Box gridRow={"2"} gridColumnStart={"1"} gridColumnEnd={"4"}>
        <Card
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Flex direction="column" gap="1" align={"center"}>
            <Text size="4" weight="bold">
              Тренд на извличането
            </Text>
          </Flex>

          <Box mt={"0"} height={"100%"}>
            {rawData && <Trend data={googleChart!} />}
          </Box>
        </Card>
      </Box>

      {/* HTML PLOT */}
      <Box gridRow={"2"} gridColumnStart={"4"} gridColumnEnd={"6"}>
        <Card
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Flex direction="column" gap="1" align={"center"}>
            <Text size="4" weight="bold">
              Диаграма на разсейване
            </Text>
          </Flex>
          {/* <HtmlPlot /> */}
          <Flex
            p={"5rem"}
            // m={"10"}
            justify={"center"}
            align={"center"}
            width={"100%"}
            height={"100%"}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Seaborn Plot"
                width={800} // Set the desired width
                height={600} // Set the desired height
                quality={100} // Set the quality (1-100)
                layout="responsive" // Ensure the image is responsive
              />
            )}
          </Flex>
        </Card>
      </Box>
      <Box gridRow={"1"} gridColumn={"5"}>
        <MyMonthPicker onSelect={handleMonthSelect} />
      </Box>
    </Grid>
  );
}
