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
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MillInfoProps, TrendDataPoint } from "../hooks/useMills";

const MillsInfo = ({
  millProps,
  oreTrend,
}: {
  millProps: MillInfoProps;
  oreTrend: TrendDataPoint[];
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-lg text-center">{millProps.title}</CardTitle>
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
              <TableCell className="font-medium">{millProps.state}</TableCell>
            </TableRow>
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
        <ResponsiveContainer width="100%" height={200}>
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
              formatter={(value: number) => [`${value.toFixed(1)} t/h`, "Rate"]}
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
      </CardContent>
    </Card>
  );
};

export default MillsInfo;
