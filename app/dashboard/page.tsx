import { Box, Flex, Grid } from "@radix-ui/themes";
import CardGauge from "../components/CardGauge";
import CardDiffGauge from "../components/CardDiffGauge";

export default function DashboardPage() {
  return (
    <Flex gap="3"  justify={"center"} align={"center"} mt={"3"} direction={"column"}>
      <Box>
        <CardGauge />
      </Box>
      <Box>
        <CardDiffGauge />
      </Box>
    </Flex>
  );
}
