"use client";

import { Flex } from "@radix-ui/themes";
import LinearGaugeWithTarget from "../components/LinearGaugeWithTarget";
import { useState } from "react";
import { usePulseTrend } from "../hooks/usePulse";

export default function targetsPage() {
  const { data } = usePulseTrend({ tags: "RECOVERY_LINE1_CU_LONG,RECOVERY_LINE2_CU_LONG", num_records: 5 });
  console.log(data);
  return (
    <Flex gap="3" direction="column" mt={"3"}>
      <LinearGaugeWithTarget />
    </Flex>
  );
}
