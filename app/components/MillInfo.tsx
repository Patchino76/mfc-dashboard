"use client";
import AnimatedGif from "@/app/components/AnimatedGif";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MillInfoProps {
  title: string;
  millState: string;
  shift1: number;
  shift2: number;
  shift3: number;
  load: number;
  loadArray: number[];
}

const MillsInfo = ({
  title,
  millState,
  shift1,
  shift2,
  shift3,
  load,
  loadArray,
}: MillInfoProps) => {
  const chartData = loadArray.map((value, index) => ({
    name: index,
    load: value,
  }));
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatedGif
          gifSrc="/images/mill_running.gif"
          jpgSrc="/images/mill_stopped.jpg"
        />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Mill State</TableCell>
              <TableCell className="font-bold">{millState}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Shift 1</TableCell>
              <TableCell>{shift1}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Shift 2</TableCell>
              <TableCell>{shift2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Shift 3</TableCell>
              <TableCell>{shift3}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Current Load</TableCell>
              <TableCell>{load}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={false} />
              <YAxis width={30} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="load"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MillsInfo;
