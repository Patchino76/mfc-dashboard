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
import MyMonthPicker from "../components/MyMonthPicker";
import { getDateWithLessHours } from "../utils/dateUtils";
import { BarChartRechartSm } from "../components/BarChartRechartSm";
import TableChart from "../components/TableChart";
import LinearGaugeWithTargetAndSpAdjuster from "../components/LinearGaugeWithTargetAndSpAdjuster";
import useSetPoint from "../hooks/store";

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
  // const start = new Date("2024-11-01 00:06:00").toISOString();
  const start8h = getDateWithLessHours(8, new Date());
  const currentDate = new Date();
  const pastDate = new Date(currentDate.setDate(currentDate.getDate() - 10));

  //STATES----------------------------------------------------------------
  const [pv, setPV] = useState<number>();
  // const [sp, setSP] = useState<number>(87.6);
  const [start, setStart] = useState<string>(pastDate.toISOString());
  const [end, setEnd] = useState<string>(currentDate.toISOString());

  //HOOKS------------------------------------------------------------------
  const { data: rawData, isLoading: isLoadingRaw } = usePulseTrendwithTS(
    { tags, start, end },
    30
  );
  const { data: lastRecs } = useLastRecords(tags, 20);
  const { data: imageUrl, isLoading, error } = usePulsePng();
  const { setPoint } = useSetPoint();

  const [googleChart, setGoogleChart] = useState<GoogleChartData>();
  const [googleTable, setGoogleTable] = useState<GoogleChartData>();
  const [barChartSm1, setBarChartSm1] =
    useState<{ hour: string; pv: number }[]>();
  const [barChartSm2, setBarChartSm2] =
    useState<{ hour: string; pv: number }[]>();

  //circular gauge
  const [circGauge1, setCircGauge1] = useState<GoogleChartData>();
  const [circGauge2, setCircGauge2] = useState<GoogleChartData>();

  // ARRAY HELPERS----------------------------------------------------------
  function flattenData(array: DataPoint[], tags: string[]): ChartRow[] {
    //make flat array [ts, val1, val2, ...]
    return array.map((item) => {
      const values = tags.map((tag) => {
        const value = item.data[tag];
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

  const makeGoogleTable = (header: string[], tags: string[]) => {
    let rawArray = flattenData(rawData!, tags).slice(0, 10);
    const result = rawArray.map((row) => {
      const timestamp = row[0] as string; // Type assertion to string
      const value = row[1] as number; // Type assertion to number
      const time = timestamp.split(" ")[1]; // Extract hh
      const newValue = setPoint - value; // Subtract value from given number
      return [time, newValue];
    });
    const table: GoogleChartData = [header, ...result];
    return table;
  };

  const makeRechartChart = (tags: string[]) => {
    let rawArray = flattenData(rawData!, tags).slice(0, 8);
    const result = rawArray.map((row) => {
      const timestamp = row[0] as string; // Type assertion to string
      const value = row[1] as number; // Type assertion to number
      const hour = timestamp.split(" ")[1].slice(0, 2); // Extract hh:mm
      const pv = value; // Subtract value from given number
      return { hour, pv };
    });
    // console.log("bar", result);
    return result;
  };
  const makeGoogleGauge = (header: string[], value: number, unit: string) => {
    const gauge: GoogleChartData = [header, [unit, value]];
    return gauge;
  };

  // USE EFFFECTS----------------------------------------------------------
  useEffect(() => {
    if (!rawData) return;

    // 2 elemet - google trend chart
    const trend = makeGoogleTrend(
      ["Timestamp", "Value", "SP"],
      ["RECOVERY_LINE1_CU_LONG"],
      setPoint
    );
    setGoogleChart(trend as GoogleChartData);

    const table = makeGoogleTable(
      ["часове", "SP - PV"],
      ["RECOVERY_LINE1_CU_LONG"]
    );
    setGoogleTable(table as GoogleChartData);

    const barchart1 = makeRechartChart(["CUFLOTAS2-S7-400PV_CU_LINE_1"]);
    setBarChartSm1(barchart1);
    // console.log("1", barchart1);
    const barchart2 = makeRechartChart(["CUFLOTAS2-S7-400PV_FE_LINE1"]);
    setBarChartSm2(barchart2);

    // console.log("2", barchart2);
  }, [rawData, setPoint, start]);

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
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    console.log(`Selected: ${startOfMonth} - ${endOfMonth}`);
    setStart(startOfMonth.toISOString());
    setEnd(endOfMonth.toISOString());
  };

  return (
    <>
      {isLoadingRaw && <div>Loading...</div>}
      <Grid
        columns="5"
        rows="350px 500px"
        gap={"1"}
        p={"1"}
        // style={{ border: "1px solid black" }}
      >
        {/* <div style={{ border: "1px solid red" }}>Item 1</div>
      <div style={{ border: "1px solid red" }}>Item 2</div>
      <div style={{ border: "1px solid red" }}>Item 3</div>
      <div style={{ border: "1px solid red" }}>Item 4</div>
      <div style={{ border: "1px solid red" }}>Item 5</div>
      <div style={{ border: "1px solid red" }}>Item 6</div> */}

        {/* LINEAR GAUGE WIH TARGET */}
        <Box gridColumnStart={"1"} gridRow={"1"}>
          <LinearGaugeWithTargetAndSpAdjuster
            title="Извличане ред 1"
            description="Реализация на извличането на ред 1."
            target={90}
            actual={pv} //pv
          />
        </Box>
        {/* TABLE CHART ------------------------------------------------------*/}
        <Box gridColumn={"2"} gridRow={"1"}>
          <Card
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Flex direction="column" align={"center"}>
              <Text size="4" weight="bold">
                Извличане по часове назад
              </Text>
              <Text as="p" size="2" color="gray">
                разлика между задание и изпълнение [%]
              </Text>
            </Flex>
            <Flex
              direction={"column"}
              justify={"center"}
              align={"center"}
              mt={"0.5rem"}
            >
              {rawData && <TableChart dataTable={googleTable!} />}
            </Flex>
          </Card>
        </Box>

        {/* RADIAL GAUGES ---------------------------------------------------- */}
        <Box gridColumn={"3"} gridRow={"1"}>
          <Card
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Flex direction="column" align={"center"}>
              <Text size="4" weight="bold">
                Скрап Cu
              </Text>
              <Text as="p" size="2" color="gray">
                моментна стойност [%]
              </Text>
            </Flex>
            <Flex direction={"column"} justify={"center"} align={"center"}>
              <Box
                width={"50%"}
                height={"50%"}
                style={{ position: "relative" }}
              >
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
              </Box>
              <Box mt={"0.5rem"}>
                <BarChartRechartSm
                  chartData={barChartSm1!}
                  min={0.026}
                  max={0.03}
                />
              </Box>
            </Flex>
          </Card>
        </Box>
        <Box gridColumn={"4"} gridRow={"1"}>
          <Card
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Flex direction="column" align={"center"}>
              <Text size="4" weight="bold">
                Скрап Fe
              </Text>
              <Text as="p" size="2" color="gray">
                моментна стойност [%]
              </Text>
            </Flex>
            <Flex direction={"column"} justify={"center"} align={"center"}>
              <Box
                width={"50%"}
                height={"50%"}
                style={{ position: "relative" }}
              >
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
              </Box>

              <Box mt={"0.5rem"}>
                <BarChartRechartSm chartData={barChartSm2!} min={1.8} max={2} />
              </Box>
            </Flex>
          </Card>
        </Box>

        {/* BIG TREND ---------------------------------------------------------*/}
        <Box gridRow={"2"} gridColumnStart={"1"} gridColumnEnd={"4"}>
          <Card
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Flex direction="row" gap="1" align="center" justify="between">
              <Box width={"10rem"} />
              <Text size="4" weight="bold">
                Тренд на извличането
              </Text>
              <Box>
                <MyMonthPicker onSelect={handleMonthSelect} />
              </Box>
            </Flex>

            <Box mt={"0"} height={"100%"}>
              {rawData && <Trend data={googleChart!} />}
            </Box>
          </Card>
        </Box>

        {/* HTML PLOT ---------------------------------------------------------*/}
        <Box gridRow={"2"} gridColumnStart={"4"} gridColumnEnd={"6"}>
          <Card
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Flex direction="row" gap="1" align="center" justify="center">
              <Text size="4" weight="bold">
                Диаграма на разсейване
              </Text>
            </Flex>
            {/* <HtmlPlot /> */}
            <Flex
              p={"7rem"}
              // m={"10"}
              justify={"center"}
              align={"center"}
              width={"100%"}
              height={"100%"}
            >
              {imageUrl && (
                <Image
                  // className="p-10"
                  src={imageUrl}
                  alt="Seaborn Plot"
                  layout="responsive"
                  width={320}
                  height={200}
                  quality={100}
                />
              )}
            </Flex>
          </Card>
        </Box>
      </Grid>
    </>
  );
}
