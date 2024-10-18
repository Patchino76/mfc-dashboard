"use client";
import { Card, Flex, Box, Text } from "@radix-ui/themes";
import { useTrendPVandSP } from "../hooks/useTrend";
import DiffGauge, { DiffdataProps } from "./DiffGauge";
import { useEffect, useRef, useState } from "react";
import { ThickArrowUpIcon, ThickArrowDownIcon } from "@radix-ui/react-icons";

const CardGauge = () => {
  const { data } = useTrendPVandSP();

  const [diffdata, setDiffdata] = useState<DiffdataProps>({ old: [], new: [] });
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
      setDiffdata({ old: dataSP, new: dataPV });
    }
  }, [data]);

  return (
    <Card
      style={{
        width: "300px",
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
          нещо по-описателно...
        </Text>
      </Flex>
      <Box width={"250px"} pt={"0"} mt={"0"} className="bg-white">
        <DiffGauge {...diffdata} />
      </Box>
      <Flex direction="row" gap="6" mt={"1"} justify={"center"}>
        <Flex align="center" gap="2">
            <ThickArrowUpIcon />
          <Box width="30px" height="15px" className="bg-blue-600" />
          <ThickArrowDownIcon />
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
