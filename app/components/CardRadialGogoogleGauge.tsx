import React, { useEffect, useState } from "react";
import { useTrendPVandSP } from "../hooks/useTrend";
import RadialGoogleGauge from "./RadialGoogleGauge";
import { Box, Card, Flex, Text } from "@radix-ui/themes";

const CardRadialGogoogleGauge = () => {
  const { data } = useTrendPVandSP();
  const [gaugeData, setGaugeData] = useState<(string | number)[][]>();
  useEffect(() => {
    if (data) {
      let tmp: (string | number)[][] = [["Label", "Value"]];
      tmp.push(["Извличане", data.sp[0] - 20]);
      tmp.push(["Концентрат", data.sp[1] - 40]);
      tmp.push(["Скрап", data.sp[2] - 70]);
      setGaugeData(tmp);
    }
  }, [data]);

  useEffect(() => {
    if (gaugeData) {
      console.log(gaugeData);
    }
  }, [gaugeData]);
  return (
    <Card
      style={{
        width: "100%",
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
      <Flex justify={"center"} align={"center"} mt={"6"}>
        {data && <RadialGoogleGauge data={gaugeData!} />}
      </Flex>
    </Card>
  );
};

export default CardRadialGogoogleGauge;
