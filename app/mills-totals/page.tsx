"use client";
import React, { useState } from "react";
import MillsTotals from "../components/MillsTotals";
import ShiftsPieChartSector from "./ShiftsPieChartSector";
import { useMillsByParameter } from "../hooks/useMills";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarArrows from "./CalendarArrows";
import ComparisonTable from "./ComparisonTable";
import { ShiftsPieChartSimple } from "./ShiftsPieChartSimple";

const parameters = [
  { id: "shift1", label: "Смяна 1" },
  { id: "shift2", label: "Смяна 2" },
  { id: "shift3", label: "Смяна 3" },
  { id: "total", label: "Тотал" },
  { id: "ore", label: "Руда" },
];

// Sample shift data for testing
// const fakeShiftData = [
//   { shift: "Смяна 1", value: 1250 },
//   { shift: "Смяна 2", value: 980 },
//   { shift: "Смяна 3", value: 1100 },
// ];

const MillsTotalsPage = () => {
  const [selectedParameter, setSelectedParameter] = useState("ore");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);

  // Format dates at UTC midnight
  const currentDateStr = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];
  const previousDateStr = new Date(
    previousDate.getTime() - previousDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  const { data: currentData } = useMillsByParameter(
    selectedParameter,
    currentDateStr
  );
  const { data: previousData } = useMillsByParameter(
    selectedParameter,
    previousDateStr
  );

  const getShiftsAggregates = () => {
    const { data: shift1 } = useMillsByParameter("shift1", currentDateStr);
    const { data: shift2 } = useMillsByParameter("shift2", currentDateStr);
    const { data: shift3 } = useMillsByParameter("shift3", currentDateStr);

    const shift1Total = shift1?.reduce((sum, item) => sum + item.value, 0) ?? 0;
    const shift2Total = shift2?.reduce((sum, item) => sum + item.value, 0) ?? 0;
    const shift3Total = shift3?.reduce((sum, item) => sum + item.value, 0) ?? 0;

    return [
      { shift: "Смяна 1", value: shift1Total },
      { shift: "Смяна 2", value: shift2Total },
      { shift: "Смяна 3", value: shift3Total },
    ];
  };
  const shiftsAggregates = getShiftsAggregates();
  // console.log(shiftsAggregates);
  // console.log("fake", fakeShiftData);

  // Add totals to both datasets
  const addTotalsRow = (data: typeof currentData) => {
    if (!data) return null;
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    return [...data, { mill: "Общо", value: totalValue }];
  };

  const currentWithTotals = addTotalsRow(currentData);
  const previousWithTotals = addTotalsRow(previousData);

  return (
    <div className="h-fit p-3 flex flex-col gap-3">
      <div className="flex flex-row gap-3">
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

        {previousWithTotals && currentWithTotals && (
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>
                {parameters.find((p) => p.id === selectedParameter)?.label} -
                сравнителна таблица за {currentDateStr}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <ComparisonTable
                previousData={previousWithTotals}
                currentData={currentWithTotals}
              />
              {selectedParameter.startsWith("shift") ? (
                <ShiftsPieChartSector
                  data={shiftsAggregates}
                  selectedShift={selectedParameter}
                />
              ) : (
                <ShiftsPieChartSimple
                  data={shiftsAggregates}
                  selectedShift={selectedParameter}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MillsTotalsPage;
