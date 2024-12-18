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
} from "recharts";

interface ParetoDtSstProps {
  sampleData: { Reason: string; MTTR: number; TotalEvents: number }[];
}

const ParetoDtSst = ({ sampleData }: ParetoDtSstProps) => {
  // Prepare data for bar and line charts
  const totalEvents = sampleData.reduce(
    (acc, data) => acc + data.TotalEvents,
    0
  );
  let cumulative = 0;

  const processedData = sampleData.map((data) => {
    cumulative += data.TotalEvents;
    return {
      reason: data.Reason,
      totalEvents: data.TotalEvents,
      cumulative: (cumulative / totalEvents) * 100, // Cumulative percentage
    };
  });

  if (!sampleData || sampleData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart
        data={processedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="reason" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalEvents" fill="#8884d8" />
        <Line type="monotone" dataKey="cumulative" stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ParetoDtSst;
