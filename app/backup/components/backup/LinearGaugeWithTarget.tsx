'use client'
import React from 'react'
import { Bar, BarChart, Cell, LabelList, ReferenceLine, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"


const LinearGaugeWithTarget = ({ actual = 95, target = 90, max = 100 }: { actual?: number; target?: number; max?: number }) => {
    const data = [{ value: actual }]
  
    return (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Performance Gauge</CardTitle>
            <CardDescription>Actual vs Target Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Value",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px] w-full"
            >
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
              >
                <XAxis type="number" domain={[0, max]} hide />
                <YAxis type="category" dataKey="name" hide />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  <Cell fill="var(--color-value)" />
                  <LabelList
                    dataKey="value"
                    position="center"
                    content={({ value }) => (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-primary-foreground font-bold"
                      >
                        {value}%
                      </text>
                    )}
                  />
                </Bar>
                <ReferenceLine
                  x={target}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    position: 'right',
                    value: `Target: ${target}%`,
                    fill: 'hsl(var(--destructive))',
                    fontSize: 12
                  }}
                />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>{max}%</span>
            </div>
          </CardContent>
        </Card>
      )
}

export default LinearGaugeWithTarget
