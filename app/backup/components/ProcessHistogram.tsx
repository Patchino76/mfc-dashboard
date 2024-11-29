"use client";

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ProcessHistogramProps {
  data: any[];
  parameters: {
    name: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    lowLimit: number;
    highLimit: number;
  }[];
}

export default function ProcessHistogram({ data, parameters }: ProcessHistogramProps) {
  const histogramData = useMemo(() => {
    return parameters.map(param => {
      const values = data.map(d => d[param.name]);
      const binCount = 20;
      const binSize = (param.max - param.min) / binCount;
      
      // Create bins
      const bins = Array.from({ length: binCount }, (_, i) => ({
        binStart: param.min + i * binSize,
        binEnd: param.min + (i + 1) * binSize,
        count: 0
      }));

      // Count values in each bin
      values.forEach(value => {
        const binIndex = Math.min(
          Math.floor((value - param.min) / binSize),
          binCount - 1
        );
        if (binIndex >= 0 && binIndex < binCount) {
          bins[binIndex].count++;
        }
      });

      return {
        parameter: param,
        bins: bins.map(bin => ({
          name: `${bin.binStart.toFixed(1)}-${bin.binEnd.toFixed(1)}`,
          value: bin.count,
          binStart: bin.binStart,
          binEnd: bin.binEnd
        }))
      };
    });
  }, [data, parameters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {histogramData.map(({ parameter, bins }) => (
        <div key={parameter.name} className="w-full h-[300px] p-4">
          <div className="text-sm font-medium mb-2 text-center">
            {parameter.name} ({parameter.unit})
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                scale="band"
                tick={{ fontSize: 10 }}
                interval={1}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`Count: ${value}`, 'Frequency']}
                labelFormatter={(label) => `Range: ${label}`}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                opacity={0.8}
              />
              <ReferenceLine
                x={bins.find(bin => bin.binStart <= parameter.lowLimit && bin.binEnd >= parameter.lowLimit)?.name}
                stroke="red"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                x={bins.find(bin => bin.binStart <= parameter.highLimit && bin.binEnd >= parameter.highLimit)?.name}
                stroke="red"
                strokeDasharray="3 3"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
