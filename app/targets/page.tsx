"use client";

import { Flex } from "@radix-ui/themes";
import LinearGaugeWithTarget from "../components/LinearGaugeWithTarget";
import LinearGaugeWithTarget2 from "../components/LinearGaugeWithTarget2";
import { SetpointAdjuster } from "../components/SetpointAdjuster";
import { useState } from "react";
import LinearGaugeWithTarget3 from "../components/LinearGaugeWithTarget3";

export default function targetsPage() {
  const [temperature, setTemperature] = useState(22.5);
  return (
    <Flex gap="3" direction="column" mt={"3"}>
      <LinearGaugeWithTarget3 />
      {/* <SetpointAdjuster
            value={temperature}
            onChange={setTemperature}
            step={0.5}
            min={15}
            max={30}
            unit="°C"
          /> */}
    </Flex>
  );
}
