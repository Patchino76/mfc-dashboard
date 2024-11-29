"use client";
import { Card, Flex, Box, Text } from "@radix-ui/themes";
import RadialGauge from "./RadialGauge";
import { useTrend } from "../hooks/useTrend";


const CardGauge = () => {
    const { data } = useTrend();
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
    <Flex direction="column" gap="1" align={"center"} >
      <Text size="4" weight="bold" >
        Извличане
      </Text>
      <Text as="p" size="2" color="gray">
        нещо по-описателно...
      </Text>
    </Flex >
    <Flex justify={"center"} align={"center"}>
        {/* <RadialGaugeContainer /> */}
        <RadialGauge value={data && data.length >0 ? data[0] : 0} />
    </Flex>
  </Card>
)};

export default CardGauge;
