"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import { useTrendPVandSP } from "../hooks/useTrend";
import { useEffect, useState } from "react";
import AreaChart from "./AreaChart";

const CardAreaChart = () => {
  const { data } = useTrendPVandSP();
  const [chartData, setChartData] = useState<(string | number)[][]>();
  useEffect(() => {
    if (data) {
      let tmp: (string | number)[][] = [["часове", "SP", "PV"]];
      for (let i = 0; i < data.sp.length; i++) {
        tmp.push([i, data.sp[i], data.pv[i]]);
      }
      setChartData(tmp);
    }
  }, [data]);
  
  useEffect(() => {
    if (chartData) {
      }
  }, [chartData]);
  
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
        <Text as="p" size="2" color="gray">
          за последните часове
        </Text>
      </Flex>
      <Flex justify={"center"} align={"center"}>{data && <AreaChart data ={chartData!} />}</Flex>
    </Card>
  );
};

export default CardAreaChart;
