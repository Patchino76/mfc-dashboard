"use client";
import { Card, Flex, Box, Text } from "@radix-ui/themes";
import RadialGauge from "./RadialGauge";
import { useTrend } from "../hooks/useTrend";


const CardGauge = () => {
    const { data } = useTrend();
    return (
    

  <Card 
    style={{
      width: "300px",
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
    <Box height={"250px"} width={"250px"} pt={"2"} mt={"2"}
      className="bg-white"
    >
        {/* <RadialGaugeContainer /> */}
        <RadialGauge value={data && data.length >0 ? data[0] : 0} />
    </Box>
    {/* <Flex direction="column" gap="1" mt={"2"}>
      <Flex align="center" gap="2" >
        <Box width="30px" height="15px" className="bg-blue-600" />
        <Text size="2">Показание</Text>
      </Flex>
      <Flex align="center" gap="2">
        <Box width="30px" height="15px" className="bg-gray-600" />
        <Text size="2">Цел</Text>
      </Flex>
    </Flex> */}
  </Card>
)};

export default CardGauge;
