"use client";
import { Flex } from "@radix-ui/themes";
import RadialGauge from "./components/RadialGaugeSimple";
import { useEffect, useState } from "react";
import RadialGauge2 from "./components/RadialGauge";

export default function Home() {
  const [value, setValue] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(() => {
        // Generate a random value between 0 and 100
        const newValue = Math.floor(Math.random() * 101);
        return newValue;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex className="w-1/2 h-1/2">
      {/* <RadialGauge2 val={value} /> */}
    </Flex>
  );
}
