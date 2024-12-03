"use client";
import React from "react";
import { useMills, useMillsTrendByTag } from "../hooks/useMills";
import MillInfo from "../components/MillInfo";
import { Grid } from "@radix-ui/themes";

const mills = Array.from(
  { length: 12 },
  (_, i) => `Mill${String(i + 1).padStart(2, "0")}`
);

const MillsInfoPage = () => {
  return (
    <Grid
      columns={{
        initial: "1", // 1 column on smallest screens
        sm: "2", // 2 columns on small screens
        md: "4", // 3 columns on medium and larger screens
      }}
      gap="4"
      width="auto"
      mt={"3"}
    >
      {mills.map((mill) => {
        const { data } = useMills(mill);
        const { data: loadArray } = useMillsTrendByTag(mill, "ore", 500);

        if (!data || !loadArray) {
          return (
            <div key={mill} className="animate-pulse">
              <div className="h-[400px] bg-gray-200 rounded-lg"></div>
            </div>
          );
        }

        return (
          <div key={mill}>
            <MillInfo millProps={data} oreTrend={loadArray} />
          </div>
        );
      })}
    </Grid>
  );
};

export default MillsInfoPage;
