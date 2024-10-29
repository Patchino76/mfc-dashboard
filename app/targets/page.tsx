"use client";

import { Flex } from "@radix-ui/themes";
import LinearGaugeWithTarget from "../components/LinearGaugeWithTarget";
import { useState } from "react";

export default function targetsPage() {
  const [temperature, setTemperature] = useState(22.5);
  return (
    <Flex gap="3" direction="column" mt={"3"}>
      <LinearGaugeWithTarget />
    </Flex>
  );
}
