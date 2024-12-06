"use client";
import React, { useState } from "react";
import MillsTotals from "../components/MillsTotals";
import { useMillsByParameter } from "../hooks/useMills";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarArrows from "./CalendarArrows";
import ComparisonTable from "./ComparisonTable";

const parameters = [
  { id: "shift1", label: "Смяна 1" },
  { id: "shift2", label: "Смяна 2" },
  { id: "shift3", label: "Смяна 3" },
  { id: "total", label: "Тотал" },
  { id: "ore", label: "Руда" },
];

const MillsTotalsPage = () => {
  const [selectedParameter, setSelectedParameter] = useState("ore");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);

  // Format dates at UTC midnight
  const currentDateStr = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];
  const previousDateStr = new Date(previousDate.getTime() - (previousDate.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];

  const { data: currentData } = useMillsByParameter(
    selectedParameter,
    currentDateStr
  );
  const { data: previousData } = useMillsByParameter(
    selectedParameter,
    previousDateStr
  );

  return (
    <div className="h-fit p-3 flex flex-row gap-3">
      <Card className="w-[60%] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-0">
          <CardTitle className="text-2xl font-medium">
            Справки мелнично
          </CardTitle>
          <CalendarArrows date={currentDate} onDateChange={setCurrentDate} />
        </CardHeader>
        <CardContent className="flex-1 pt-3">
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
              <TabsContent className="pt-3" key={param.id} value={param.id}>
                {currentData && <MillsTotals data={currentData} />}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {previousData && currentData && (
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Разлики</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ComparisonTable
              previousData={previousData}
              currentData={currentData}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MillsTotalsPage;
