"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface SemiCircleGaugeProps {
  PV: number;
  SP: number;
  unit: string;
  min: number;
  max: number;
  low: number;
  high: number;
}

export function SemiCircleGauge({
  PV,
  SP: initialSP,
  unit,
  min,
  max,
  low,
  high,
}: SemiCircleGaugeProps) {
  const [lowValue, setLowValue] = useState(low);
  const [highValue, setHighValue] = useState(high);
  const [SP, setSP] = useState(initialSP);

  const width = 300;
  const height = 200;
  const radius = 130;
  const centerX = width / 2;
  const centerY = height - 10;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;

  const valueToAngle = (value: number) => {
    return startAngle + (endAngle - startAngle) * ((value - min) / (max - min));
  };

  const angleToCoordinates = (angle: number, radiusOffset = 0) => {
    const roundTo = (num: number) => Number(num.toFixed(4));
    return {
      x: roundTo(centerX + (radius + radiusOffset) * Math.cos(angle)),
      y: roundTo(centerY + (radius + radiusOffset) * Math.sin(angle)),
    };
  };

  const pvAngle = Number(valueToAngle(PV).toFixed(4));
  const spAngle = Number(valueToAngle(SP).toFixed(4));
  const lowAngle = Number(valueToAngle(lowValue).toFixed(4));
  const highAngle = Number(valueToAngle(highValue).toFixed(4));

  const arcPath = `
    M ${angleToCoordinates(startAngle).x},${angleToCoordinates(startAngle).y}
    A ${radius},${radius} 0 0,1 ${angleToCoordinates(endAngle).x},${
    angleToCoordinates(endAngle).y
  }
  `;

  const ticks = [
    min,
    (3 * min + max) / 4,
    (min + max) / 2,
    (min + 3 * max) / 4,
    max,
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Gauge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient
                id="blueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                <stop offset="100%" stopColor="hsl(214, 80%, 50%)" />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <path
              d={arcPath}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="30"
              strokeLinecap="butt"
            />
            {/* Value arc */}
            <path
              d={`
                M ${angleToCoordinates(startAngle).x},${
                angleToCoordinates(startAngle).y
              }
                A ${radius},${radius} 0 0,1 ${angleToCoordinates(pvAngle).x},${
                angleToCoordinates(pvAngle).y
              }
              `}
              fill="none"
              stroke="url(#blueGradient)"
              strokeWidth="30"
              strokeLinecap="butt"
            />
            {/* SP arc segment */}
            <path
              d={`
                M ${angleToCoordinates(startAngle).x},${
                angleToCoordinates(startAngle).y
              }
                A ${radius},${radius} 0 0,1 ${angleToCoordinates(spAngle).x},${
                angleToCoordinates(spAngle).y
              }
              `}
              fill="none"
              stroke="hsl(var(--destructive)/0.2)"
              strokeWidth="30"
              strokeLinecap="butt"
              className="transition-all duration-300 ease-in-out"
            />
            {/* Circular scale */}
            {ticks.map((tick, index) => {
              const tickAngle = Number(valueToAngle(tick).toFixed(4));
              const innerPoint = angleToCoordinates(tickAngle, -15);
              const outerPoint = angleToCoordinates(tickAngle, 15);
              const labelPoint = angleToCoordinates(tickAngle, 30);
              return (
                <React.Fragment key={index}>
                  <line
                    x1={innerPoint.x}
                    y1={innerPoint.y}
                    x2={outerPoint.x}
                    y2={outerPoint.y}
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2"
                  />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {tick}
                  </text>
                </React.Fragment>
              );
            })}
            {/* SP marker */}
            <g className="transition-transform duration-300 ease-in-out">
              <line
                x1={angleToCoordinates(spAngle, -15).x}
                y1={angleToCoordinates(spAngle, -15).y}
                x2={angleToCoordinates(spAngle, 15).x}
                y2={angleToCoordinates(spAngle, 15).y}
                stroke="hsl(var(--destructive))"
                strokeWidth="4"
                strokeLinecap="round"
                className="transition-all duration-300 ease-in-out"
              />
              <text
                x={angleToCoordinates(spAngle, -25).x}
                y={angleToCoordinates(spAngle, -25).y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-destructive transition-all duration-300 ease-in-out"
              >
                {SP}
              </text>
            </g>
            {/* Low marker */}
            <g className="transition-transform duration-300 ease-in-out">
              <line
                x1={angleToCoordinates(lowAngle, -5).x}
                y1={angleToCoordinates(lowAngle, -5).y}
                x2={angleToCoordinates(lowAngle, 5).x}
                y2={angleToCoordinates(lowAngle, 5).y}
                stroke="hsl(25, 95%, 53%)"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300 ease-in-out"
              />
              <text
                x={angleToCoordinates(lowAngle, -25).x}
                y={angleToCoordinates(lowAngle, -25).y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-orange-500 transition-all duration-300 ease-in-out"
              >
                {lowValue}
              </text>
            </g>
            {/* High marker */}
            <g className="transition-transform duration-300 ease-in-out">
              <line
                x1={angleToCoordinates(highAngle, -5).x}
                y1={angleToCoordinates(highAngle, -5).y}
                x2={angleToCoordinates(highAngle, 5).x}
                y2={angleToCoordinates(highAngle, 5).y}
                stroke="hsl(25, 95%, 53%)"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300 ease-in-out"
              />
              <text
                x={angleToCoordinates(highAngle, -25).x}
                y={angleToCoordinates(highAngle, -25).y}
                textAnchor="middle"
                dominantBaseline="small"
                className="text-xs font-medium fill-orange-500 transition-all duration-300 ease-in-out"
              >
                {highValue}
              </text>
            </g>
            {/* Value text */}
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-4xl font-bold fill-primary"
            >
              {PV}
            </text>
            {/* Unit text */}
            <text
              x={centerX}
              y={centerY - 30}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl fill-muted-foreground"
            >
              {unit}
            </text>
          </svg>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="sp-slider" className="text-sm font-medium">
              SP: {SP}
            </label>
            <Slider
              id="sp-slider"
              min={min}
              max={max}
              step={1}
              value={[SP]}
              onValueChange={([value]) => setSP(value)}
              className="my-2"
            />
          </div>
          <div>
            <label htmlFor="low-slider" className="text-sm font-medium">
              Low: {lowValue}
            </label>
            <Slider
              id="low-slider"
              min={min}
              max={max}
              step={1}
              value={[lowValue]}
              onValueChange={([value]) => setLowValue(value)}
              className="my-2"
            />
          </div>
          <div>
            <label htmlFor="high-slider" className="text-sm font-medium">
              High: {highValue}
            </label>
            <Slider
              id="high-slider"
              min={min}
              max={max}
              step={1}
              value={[highValue]}
              onValueChange={([value]) => setHighValue(value)}
              className="my-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
