"use client";
import React, { useState } from "react";
import MillsTotals from "../components/MillsTotals";
import { useMillsByParameter } from "../hooks/useMills";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SemiCircleGauge } from "../components/SemiCircleGauge";

const parameters = [
  { id: "shift1", label: "Смяна 1" },
  { id: "shift2", label: "Смяна 2" },
  { id: "shift3", label: "Смяна 3" },
  { id: "total", label: "Тотал" },
  { id: "ore", label: "Руда" },
];

const MillsTotalsPage = () => {
  const [selectedParameter, setSelectedParameter] = useState("ore");
  const { data: machineData } = useMillsByParameter(selectedParameter);

  return (
    <div className="min-h-screen p-4 space-y-4">
      <Card className="w-full">
        <CardContent className="p-6">
          <Tabs
            defaultValue="ore"
            className="w-full"
            onValueChange={setSelectedParameter}
          >
            <TabsList className="grid w-full grid-cols-5">
              {parameters.map((param) => (
                <TabsTrigger
                  key={param.id}
                  value={param.id}
                  className="text-lg font-medium transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-blue-800 data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-blue-700"
                >
                  {param.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {parameters.map((param) => (
              <TabsContent key={param.id} value={param.id}>
                {machineData && <MillsTotals data={machineData} />}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-row justify-around gap-4  w-fill">
        {/* <SemiCircleGauge
          PV={75}
          SP={80}
          unit="°C"
          min={0}
          max={100}
          low={20}
          high={90}
        />
        <SemiCircleGauge
          PV={65}
          SP={70}
          unit="°C"
          min={0}
          max={100}
          low={30}
          high={85}
        />
        <SemiCircleGauge
          PV={85}
          SP={82}
          unit="°C"
          min={0}
          max={100}
          low={25}
          high={95}
        />
        <SemiCircleGauge
          PV={55}
          SP={60}
          unit="°C"
          min={0}
          max={100}
          low={15}
          high={80}
        /> */}
      </div>
    </div>
  );
};

export default MillsTotalsPage;
