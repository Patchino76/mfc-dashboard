"use client";
import { FontSizeIcon } from "@radix-ui/react-icons";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  TooltipProps,
} from "recharts";

export interface DtSstProps {
  sampleData: {
    reason: string;
    mttr: number;
    total: number;
    label: string;
    unit: string;
  }[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const { reason, total, cumulative, label, unit } = payload[0].payload; // Adjust based on your data structure
    // console.log(payload[0].payload);
    return (
      <div className="border border-blue-500 rounded-lg bg-white p-4 shadow-lg">
        <p className="text-blue-500">Категория: {reason}</p>
        <p className="text-purple-500">
          {label} {total} {unit}
        </p>
        <p className="text-orange-500">Натрупване: {cumulative.toFixed(0)} %</p>
      </div>
    );
  }
  return null;
};

const ParetoDtSst = ({ sampleData }: DtSstProps) => {
  // Prepare data for bar and line charts
  const totalEvents = sampleData.reduce((acc, data) => acc + data.total, 0);
  let cumulative = 0;

  const sortedData = sampleData.sort((a, b) => b.total - a.total);
  const processedData = sortedData.map((data) => {
    cumulative += data.total;
    return {
      reason: data.reason,
      total: data.total,
      cumulative: (cumulative / totalEvents) * 100, // Cumulative percentage
      label: data.label,
      unit: data.unit,
    };
  });

  if (!sampleData || sampleData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={700}>
      <ComposedChart
        data={processedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="reason" />
        <YAxis
          yAxisId="left"
          stroke="#8884d8"
          label={{
            value: sampleData[0].label + " " + sampleData[0].unit,
            position: "Left",
            stroke: "#8884d8",
            angle: -90,
            offset: 0,
            style: { fontWeight: "normal", fontSize: "14px" },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#ff7300"
          label={{
            value: "%",
            offset: 10,
            position: "insideRight",
            stroke: "#ff7300",
            style: { fontWeight: "normal", fontSize: "14px" },
          }}
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ bottom: -10 }}
          content={
            <div className="flex justify-center">
              <span>Категории на престои</span>
            </div>
          }
        />
        <Bar dataKey="total" fill="#8884d8" yAxisId="left" />
        <Line
          type="monotone"
          dataKey="cumulative"
          stroke="#ff7300"
          yAxisId="right"
          strokeWidth={2}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ParetoDtSst;
