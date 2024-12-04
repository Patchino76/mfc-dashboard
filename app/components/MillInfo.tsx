"use client";
import AnimatedGif from "@/app/components/AnimatedGif";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { MillInfoProps, TrendDataPoint } from "../hooks/useMills";
import { SemiCircleGauge } from "./CardSemiCircleGauge";
import { SemiCircleGaugeProps } from "./SemiCircleGauge";
import { SemiCircleOreGauge } from "../mills/SemiCircleOreGauge";

const MillsInfo = ({
  millProps,
  oreTrend,
}: {
  millProps: MillInfoProps;
  oreTrend: TrendDataPoint[];
}) => {
  const [gaugeData, setGaugeData] = useState<SemiCircleGaugeProps>({
    PV: 0,
    SP: 0,
    unit: "t/h",
    min: 0,
    max: 100,
    low: 0,
    high: 100,
  });

  useEffect(() => {
    // Update the gauge data based on the ore trend data
    if (oreTrend.length > 0) {
      const lastData = oreTrend[oreTrend.length - 1];
      const minValue = Math.min(...oreTrend.map((point) => point.value));
      const maxValue = Math.max(...oreTrend.map((point) => point.value));
      const range = maxValue - minValue;
      const padding = range * 0.3; // 10% padding

      setGaugeData({
        PV: lastData.value,
        SP: (maxValue + minValue) / 2,
        unit: "t/h",
        min: Math.max(0, minValue - padding),
        max: maxValue + padding,
        low: minValue,
        high: maxValue,
      });
    }
  }, [oreTrend]);

  const [showGraph, setShowGraph] = useState(true);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2 text-center flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{millProps.title}</CardTitle>
        <Switch
          checked={showGraph}
          onCheckedChange={setShowGraph}
          className="scale-75"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatedGif
          state={millProps.state}
          gifSrc="/images/mill_running.gif"
          jpgSrc="/images/mill_stopped.jpg"
        />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Смяна 1</TableCell>
              <TableCell>{millProps.shift1}</TableCell>
              <TableCell className="font-medium">t</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Смяна 2</TableCell>
              <TableCell>{millProps.shift2}</TableCell>
              <TableCell className="font-medium">t</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Смяна 3</TableCell>
              <TableCell>{millProps.shift3}</TableCell>
              <TableCell className="font-medium">t</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Тотал</TableCell>
              <TableCell>{millProps.total}</TableCell>
              <TableCell className="font-medium">t</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Лента</TableCell>
              <TableCell>{millProps.ore}</TableCell>
              <TableCell className="font-medium">t/h</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="w-full" style={{ height: 200 }}>
          {showGraph ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oreTrend}>
                <XAxis dataKey="timestamp" hide={true} />
                <YAxis
                  domain={[
                    (dataMin: number) => Math.floor(dataMin * 0.95),
                    (dataMax: number) => Math.ceil(dataMax * 1.05),
                  ]}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip
                  labelFormatter={(label) => {
                    return `Time: ${label}`;
                  }}
                  formatter={(value: number) => [
                    `${value.toFixed(1)} t/h`,
                    "Rate",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full p-8">
              <SemiCircleOreGauge {...gaugeData} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MillsInfo;
