import { Box, Flex, Grid } from "@radix-ui/themes";
import DiffGaugeChart from "../components/DiffGaugeChart";
import RadialGaugeContainer from "../components/RadialGaugeContainer";
import CardGauge from "../components/CardGauge";

export default function DashboardPage() {
  return (
    <Grid gap="2" columns="3" width={"50%"} justify={"center"} align={"center"}>
      <Box className="col-span-1" width={"100%"}>
        <RadialGaugeContainer />
      </Box>
      <Flex width={"50%"} direction={"column"}>
        <DiffGaugeChart />
        <Grid
          gap="4"
          columns="2"
          width={"100%"}
          justify={"center"}
          align={"center"}
        >
          <p >Извличане</p>
          <p>Целта</p>
        </Grid>
      </Flex>
      <CardGauge />
    </Grid>
  );
}
