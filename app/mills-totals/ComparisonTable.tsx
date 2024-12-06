"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, MinusIcon } from "lucide-react";
import { MillsByParameter } from "../hooks/useMills";

export default function ComparisonTable({
  previousData,
  currentData,
}: {
  previousData: MillsByParameter[];
  currentData: MillsByParameter[];
}) {
  const getComparisonData = (
    previous: MillsByParameter,
    current: MillsByParameter
  ) => {
    const difference = current.value - previous.value;
    const percentChange = ((difference / previous.value) * 100).toFixed(2);
    return { difference, percentChange };
  };

  const getColorClass = (difference: number, previousValue: number) => {
    const percentChange = (difference / previousValue) * 100;

    if (difference === 0) return "bg-gray-100";

    const getIntensity = (percent: number) => {
      const absDiff = Math.abs(percent);
      if (absDiff < 1) return "50";
      if (absDiff < 2) return "100";
      if (absDiff < 3) return "200";
      if (absDiff < 4) return "300";
      if (absDiff < 5) return "400";
      if (absDiff < 6) return "500";
      if (absDiff < 7) return "600";
      if (absDiff < 8) return "700";
      if (absDiff < 9) return "800";
      return "900";
    };

    const color = percentChange > 0 ? "lime" : "red";
    const intensity = getIntensity(percentChange);
    return `bg-${color}-${intensity}`;
  };

  const getArrowIcon = (difference: number) => {
    if (difference > 0) {
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    } else if (difference < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <MinusIcon className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Агрегат</TableHead>
          <TableHead className="text-right">пред. ден</TableHead>
          <TableHead className="text-right">текущ ден</TableHead>
          <TableHead className="text-right">промяна t</TableHead>
          <TableHead className="text-right">промяна %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {previousData.map((prevMill, index) => {
          const currentMill = currentData[index];
          const { difference, percentChange } = getComparisonData(
            prevMill,
            currentMill
          );
          const colorClass = getColorClass(difference, prevMill.value);

          return (
            <TableRow key={prevMill.mill}>
              <TableCell
                className={`font-medium ${
                  prevMill.mill === "Общо" ? "font-bold" : ""
                }`}
              >
                {prevMill.mill}
              </TableCell>
              <TableCell
                className={`text-right ${
                  prevMill.mill === "Общо" ? "font-bold" : ""
                }`}
              >
                {prevMill.value.toFixed(0)}
              </TableCell>
              <TableCell
                className={`text-right ${colorClass} ${
                  prevMill.mill === "Общо" ? "font-bold" : ""
                }`}
              >
                {currentMill.value.toFixed(0)}
              </TableCell>
              <TableCell
                className={`text-right ${colorClass} ${
                  prevMill.mill === "Общо" ? "font-bold" : ""
                }`}
              >
                <div className="flex items-center justify-end space-x-1">
                  {getArrowIcon(difference)}
                  <span>{Math.abs(difference).toFixed(1)}</span>
                </div>
              </TableCell>
              <TableCell
                className={`text-right ${colorClass} ${
                  prevMill.mill === "Общо" ? "font-bold" : ""
                }`}
              >
                {percentChange}%
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
