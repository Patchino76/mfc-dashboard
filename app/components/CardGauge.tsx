import { Card, Flex, Box, Text } from "@radix-ui/themes";
import RadialGaugeContainer from "./RadialGaugeContainer";


const CardGauge = () => (
  <Card
    style={{
      width: "300px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
    }}
  >
    <Box>
      <Text size="4" weight="bold" >
        Извличане
      </Text>
      <Text as="p" size="2" color="gray">
        нещо по-описателно...
      </Text>
    </Box>
    <Box height={"250px"}
      width={"250px"}
      className="bg-gray-200 rounded-lg"
    >
        <RadialGaugeContainer />
    </Box>
    <Flex direction="column" gap="1" >
      <Flex align="center" gap="2" >
        <Box width="30px" height="15px" className="bg-blue-600" />
        <Text size="2">Показание</Text>
      </Flex>
      <Flex align="center" gap="2">
        <Box width="30px" height="15px" className="bg-gray-600" />
        <Text size="2">Цел</Text>
      </Flex>
    </Flex>
  </Card>
);

export default CardGauge;
