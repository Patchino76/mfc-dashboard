"use client";
import React, { useState } from "react";
import { useMills, useMillsTrendByTag } from "../hooks/useMills";
import MillInfo from "./MillInfo";
import { Grid } from "@radix-ui/themes";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

const mills = Array.from(
  { length: 12 },
  (_, i) => `Mill${String(i + 1).padStart(2, "0")}`
);

const MillsInfoPage = () => {
  const [isCheckedGraph, setIsCheckedGraph] = useState(false);

  return (
    <div className="relative">
      <div className="fixed right-4 top-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Опции</SheetTitle>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={isCheckedGraph}
                  onCheckedChange={setIsCheckedGraph}
                />
                <label htmlFor="airplane-mode">тренд / уред</label>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
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
    </div>
  );
};

export default MillsInfoPage;
