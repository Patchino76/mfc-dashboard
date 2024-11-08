"use client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import CardGauge from "../components/CardGauge";
import CardDiffGauge from "../components/CardDiffGauge";
import CardAreaChart from "../components/CardAreaChart";
import CardDiffChart from "../components/CardDiffChart";
import CardRadialGogoogleGauge from "../components/CardRadialGogoogleGauge";

export default function DashboardPage() {
  return (
    <Grid columns="6" m={"3"} gap={"2"} justify={"center"}>
      <Box>
        <CardGauge />
      </Box>
      <Box className="col-span-2">
        <CardRadialGogoogleGauge />
      </Box>
      <Box className="col-span-3">
        <CardAreaChart />
      </Box>
      <Box>
        <CardDiffGauge />
      </Box>

      <Box className="col-span-2">{/* <CardTableChart /> */}</Box>

      <Box className="col-span-3">
        <CardDiffChart />
      </Box>
    </Grid>

    // </Flex>
  );
}
