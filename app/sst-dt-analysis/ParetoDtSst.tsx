"use client";
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

interface ParetoDtSstProps {
  sampleData: { reason: string; mttr: number; totalEvents: number }[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    const { reason, totalEvents, cumulative } = payload[0].payload; // Adjust based on your data structure
    return (
      <div className="border border-blue-500 rounded-lg bg-white p-4 shadow-lg">
        <p className="text-blue-500">Причина: {reason}</p>
        <p className="text-purple-500">Събития: {totalEvents} бр.</p>
        <p className="text-orange-500">Натрупване: {cumulative.toFixed(0)} %</p>
      </div>
    );
  }
  return null;
};

const ParetoDtSst = ({ sampleData }: ParetoDtSstProps) => {
  // Prepare data for bar and line charts
  const totalEvents = sampleData.reduce(
    (acc, data) => acc + data.totalEvents,
    0
  );
  let cumulative = 0;

  const sortedData = sampleData.sort((a, b) => b.totalEvents - a.totalEvents);
  const processedData = sortedData.map((data) => {
    cumulative += data.totalEvents;
    return {
      reason: data.reason,
      totalEvents: data.totalEvents,
      cumulative: (cumulative / totalEvents) * 100, // Cumulative percentage
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
        <YAxis yAxisId="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#ff7300" />

        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ bottom: -10 }} />
        <Bar dataKey="totalEvents" fill="#8884d8" yAxisId="left" />
        <Line
          type="monotone"
          dataKey="cumulative"
          stroke="#ff7300"
          yAxisId="right"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ParetoDtSst;
