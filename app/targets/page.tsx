"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import {
  useLastRecords,
  usePulseKde,
  usePulseReg,
  usePulseTrendwithTS,
} from "../hooks/usePulse";
import Image from "next/image";
import { useEffect, useState } from "react";
import Trend from "../components/Trend";
import RadialGoogleGauge from "../components/RadialGoogleGauge";
<<<<<<< HEAD
=======
import LinearGaugeWithTargetAndSpAdjuster2 from "../components/LinearGaugeWithTargetAndSpAdjuster2";
>>>>>>> parent of 33c15b0 (finished integration of zustand store for the sp of targets)
import MyMonthPicker from "../components/MyMonthPicker";
import { getDateWithLessHours } from "../utils/dateUtils";
import { BarChartRechartSm } from "../components/BarChartRechartSm";
import TableChart from "../components/TableChart";

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

  const tags_regression = [
    "RECOVERY_LINE1_CU_LONG",
    "CUFLOTAS2-S7-400PV_CU_LINE_1",
  ];
  const tag_kde = "RECOVERY_LINE1_CU_LONG";
  // const start = new Date("2024-11-01 00:06:00").toISOString();
  const start8h = getDateWithLessHours(8, new Date());
<<<<<<< HEAD
  const currentDate = new Date();
  const pastDate = new Date(currentDate.setDate(currentDate.getDate() - 10));
=======
  const end = new Date().toISOString();

  //HOOKS------------------------------------------------------------------
  const { data: rawData } = usePulseTrendwithTS({ tags, start, end }, 30);
  const { data: lastRecs } = useLastRecords(tags, 20);
  const { data: imageUrl, isLoading, error } = usePulsePng();
>>>>>>> parent of 33c15b0 (finished integration of zustand store for the sp of targets)

  //STATES----------------------------------------------------------------
  const [pv, setPV] = useState<number>();
  const [start, setStart] = useState<string>(pastDate.toISOString());
  const [end, setEnd] = useState<string>(currentDate.toISOString());
  const { setPoint } = useSetPoint();

  //HOOKS------------------------------------------------------------------
  const { data: rawData, isLoading: isLoadingRaw } = usePulseTrendwithTS(
    { tags, start, end },
    30
  );
  const { data: lastRecs } = useLastRecords(tags, 20);
  const {
    data: regUrl,
    isLoading,
    error,
  } = usePulseReg({ tags_regression, start, end }, 10);
  const { data: kdeUrl, isLoading: isLoadingDensityPng } = usePulseKde(
    { tag_kde, start, end },
    setPoint,
    2
  );

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
      const newValue = sp! - value; // Subtract value from given number
      return [time, newValue];
    });

    const table: GoogleChartData = [header, ...result];
    return table;
  };

  const makeRechartChart = (tags: string[]) => {
    let rawArray = flattenData(rawData!, tags).slice(0, 8).reverse();
    const result = rawArray.map((row) => {
      const timestamp = row[0] as string; // Type assertion to string
      const value = row[1] as number; // Type assertion to number
      const hour = timestamp.split(" ")[1].slice(0, 2); // Extract hh:mm
      const pv = value; // Subtract value from given number
      return { hour, pv };
    });
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
      88
    );
    setGoogleChart(trend as GoogleChartData);

    const table = makeGoogleTable(
      ["часове", "SP - PV"],
      ["RECOVERY_LINE1_CU_LONG"]
    );
    setGoogleTable(table as GoogleChartData);

    const barchart1 = makeRechartChart(["CUFLOTAS2-S7-400PV_CU_LINE_1"]);
    setBarChartSm1(barchart1);

    const barchart2 = makeRechartChart(["CUFLOTAS2-S7-400PV_FE_LINE1"]);
    setBarChartSm2(barchart2);
  }, [rawData, setPoint, start]);
=======
  }, [rawData]);
>>>>>>> parent of 33c15b0 (finished integration of zustand store for the sp of targets)

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
<<<<<<< HEAD
        {/* <div style={{ border: "1px solid red" }}>Item 1</div>
      <div style={{ border: "1px solid red" }}>Item 2</div>
      <div style={{ border: "1px solid red" }}>Item 3</div>
      <div style={{ border: "1px solid red" }}>Item 4</div>
      <div style={{ border: "1px solid red" }}>Item 5</div>
      <div style={{ border: "1px solid red" }}>Item 6</div> */}

<<<<<<< HEAD
=======
>>>>>>> ca4c90c55944c6a45a9a69958f5bf43a72ae4210
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
=======
      {/* LINEAR GAUGE WIH TARGET */}
      <Box gridColumnStart={"1"} gridRow={"1"}>
        <LinearGaugeWithTargetAndSpAdjuster2
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
>>>>>>> parent of 33c15b0 (finished integration of zustand store for the sp of targets)
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
                <BarChartRechartSm chartData={barChartSm2!} min={1.6} max={2} />
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

        {/* SCATTER AND REGRESSION PLOT ---------------------------------------------------------*/}
        <Box gridRow={"1"} gridColumn={"5"}>
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
              p={"0rem"}
              // m={"10"}
              justify={"center"}
              align={"center"}
              width={"100%"}
              height={"100%"}
            >
              {regUrl && (
                <Image
                  // className="p-10"
                  src={regUrl}
                  alt="Seaborn Plot"
                  width={320}
                  height={200}
                  quality={100}
                />
              )}
            </Flex>
          </Card>
        </Box>

        {/* KDE DENSITY PLOT ---------------------------------------------------------*/}
        <Box gridRow={"2"} gridColumnStart={"4"} gridColumnEnd={"6"}>
          <Card
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Flex direction="row" gap="1" align="center" justify="center">
              <Text size="4" weight="bold">
                Разпределения на извличането под и над целта (SP)
              </Text>
            </Flex>
            {/* <HtmlPlot /> */}
            <Flex
              p={"0rem"}
              // m={"10"}
              justify={"center"}
              align={"center"}
              width={"100%"}
              height={"100%"}
            >
              {kdeUrl && (
                <Image
                  // className="p-10"
                  src={kdeUrl}
                  alt="Seaborn Plot"
                  width={1200}
                  height={768}
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
