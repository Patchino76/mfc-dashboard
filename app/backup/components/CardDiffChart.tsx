"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import { useTrendPVandSP } from "../hooks/useTrend";
import DiffGauge, { DiffdataProps } from "./DiffGauge";
import { useEffect, useState } from "react";

const dataOld = [
    ["Name", "Popularity"],
    ["Cesar", 250],
    ["Rachel", 4200],
    ["Patrick", 2900],
    ["Eric", 8200],
  ];
  
  const dataNew = [
    ["Name", "Popularity"],
    ["Cesar", 370],
    ["Rachel", 600],
    ["Patrick", 700],
    ["Eric", 1500],
  ];
  
  export const diffdata2 = {
    old: dataOld,
    new: dataNew,
  };

const CardDiffChart = () => {
  const { data } = useTrendPVandSP();
  const [chartData, setChartData] = useState<DiffdataProps>();
  useEffect(() => {
    if (data) {
      let dataSP: (string | number)[][] = [["часове", "SP"]];
      for (let i = 1; i < 8; i++) {
        dataSP.push([i.toString(), data.sp[i]]);
      }
      let dataPV: (string | number)[][] = [["часове", "PV"]];
      for (let i = 1; i < 8; i++) {
        dataPV.push([i.toString(), data.pv[i]]);
      }

      setChartData({ diffdata: { old: dataSP, new: dataPV } });
    }
  }, [data]);

  useEffect(() => {
    if (chartData) {
      console.log(chartData.diffdata);
    }
  }, [chartData]);
console.log(diffdata2);
 

  return (
    <Card
      style={{
        // width: "600px",
        height: "100%",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <Flex direction="column" gap="1" align={"center"}>
        <Text size="4" weight="bold">
          Извличане
        </Text>

      </Flex>
      {/* <Grid width={"250px"} columns={"10"} align={"center"}> */}
        <Box >
          {/* {chartData && <DiffGauge diffdata={diffdata2} />} */}
          {chartData && <DiffGauge diffdata={chartData.diffdata} />}
        </Box>
      {/* </Grid> */}
      <Flex direction="row" gap="6" mt={"1"} justify={"center"}>
        <Flex align="center" gap="2">
          <Box width="30px" height="15px" className="bg-blue-600" />

          <Text size="2">Измерване</Text>
        </Flex>
        <Flex align="center" gap="2">
          <Box width="30px" height="15px" className="bg-gray-300" />
          <Text size="2">Цел</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CardDiffChart;
