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
import { MillInfoProps } from "../hooks/useMills";

const MillsInfo = ({
  millProps,
  oreTrend,
}: {
  millProps: MillInfoProps;
  oreTrend: number[];
}) => {
  const chartData = oreTrend.map((value, index) => ({
    name: index,
    load: value,
  }));
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{millProps.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatedGif
          gifSrc="/images/mill_running.gif"
          jpgSrc="/images/mill_stopped.jpg"
        />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Състояние</TableCell>
              <TableCell className="font-bold">{millProps.state}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Смяна 1</TableCell>
              <TableCell>{millProps.shift1}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Смяна 2</TableCell>
              <TableCell>{millProps.shift2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Смяна 3</TableCell>
              <TableCell>{millProps.shift3}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Тотал</TableCell>
              <TableCell>{millProps.total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Лента</TableCell>
              <TableCell>{millProps.ore}</TableCell>
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
