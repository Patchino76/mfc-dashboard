"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import { useTrendPVandSP } from "../hooks/useTrend";
import DiffGauge, { DiffdataProps } from "./DiffGauge";
import { useEffect, useRef, useState } from "react";
import { ThickArrowUpIcon, ThickArrowDownIcon } from "@radix-ui/react-icons";

const CardGauge = () => {
  const { data } = useTrendPVandSP();
  const [chartData, setChartData] = useState<DiffdataProps>();
  const [pvSpDiff, setPvSpDiff] = useState(0);
  useEffect(() => {
    if (data) {
      const dataSP = [
        ["Name", "SP"],
        ["Извличане", data.sp.length > 0 ? data.sp[0] : 0],
      ];
      const dataPV = [
        ["Name", "PV"],
        ["Извличане", data.pv.length > 0 ? data.pv[0] : 0],
      ];

      setChartData({ diffdata: { old: dataSP, new: dataPV } });
      const diff = data.sp.length > 0 ? data.sp[0] - data.pv[0] : 0;
      setPvSpDiff(diff);
      // console.log(chartData)
    }
  }, [data]);

  return (
    <Card
      style={{
        // width: "300px",
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
          Разлика SP - PV = <strong>{pvSpDiff.toFixed(2)}</strong> [%]
        </Text>
      </Flex>
      <Grid width={"250px"} columns={"10"} align={"center"}>
        <Box className="col-span-9">
          {chartData && <DiffGauge diffdata={chartData.diffdata} />}
        </Box>
        <Flex align="center" gap="2" direction={"column"}>
          <ThickArrowUpIcon
            color={pvSpDiff > 0 ? "green" : "gray"}
            style={{ width: "30px", height: "30px" }}
          />
          <ThickArrowDownIcon
            color={pvSpDiff < 0 ? "red" : "gray"}
            style={{ width: "30px", height: "30px" }}
          />
        </Flex>
      </Grid>
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

export default CardGauge;
