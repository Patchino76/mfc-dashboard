"use client";

import React, { useState } from "react";
import { SemiCircleGaugeProps } from "../components/SemiCircleGauge";
import { Slider } from "@radix-ui/themes";

export function SemiCircleOreGauge({
  PV,
  SP: initialSP,
  unit,
  min,
  max,
  low,
  high,
}: SemiCircleGaugeProps) {
  const [SP, setSP] = useState(initialSP);

  // Base dimensions that will be used for viewBox
  const baseWidth = 300;
  const baseHeight = 200;
  const baseRadius = 130;
  const baseCenterX = baseWidth / 2;
  const baseCenterY = baseHeight - 10;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;

  const valueToAngle = (value: number) => {
    return startAngle + (endAngle - startAngle) * ((value - min) / (max - min));
  };

  const angleToCoordinates = (angle: number, radiusOffset = 0) => {
    const roundTo = (num: number) => Number(num.toFixed(4));
    return {
      x: roundTo(baseCenterX + (baseRadius + radiusOffset) * Math.cos(angle)),
      y: roundTo(baseCenterY + (baseRadius + radiusOffset) * Math.sin(angle)),
    };
  };

  const pvAngle = Number(valueToAngle(PV).toFixed(4));
  const spAngle = Number(valueToAngle(SP).toFixed(4));
  const lowAngle = Number(valueToAngle(low).toFixed(4));
  const highAngle = Number(valueToAngle(high).toFixed(4));

  const arcPath = `
    M ${angleToCoordinates(startAngle).x},${angleToCoordinates(startAngle).y}
    A ${baseRadius},${baseRadius} 0 0,1 ${angleToCoordinates(endAngle).x},${
    angleToCoordinates(endAngle).y
  }
  `;

  // Only include low and high values for ticks
  const ticks = [low, high];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full aspect-[3/2] relative">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
              <stop offset="100%" stopColor="hsl(214, 80%, 50%)" />
            </linearGradient>
            {/* Gradient for the min-max range */}
            <linearGradient
              id="rangeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="hsl(25, 95%, 53%)"
                stopOpacity="0.2"
              />
              <stop
                offset="100%"
                stopColor="hsl(25, 95%, 53%)"
                stopOpacity="0.2"
              />
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

          <path
            d={`
              M ${angleToCoordinates(startAngle).x},${
              angleToCoordinates(startAngle).y
            }
              A ${baseRadius},${baseRadius} 0 0,1 ${
              angleToCoordinates(pvAngle).x
            },${angleToCoordinates(pvAngle).y}
            `}
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth="30"
            strokeLinecap="butt"
          />

          {/* Ticks and labels */}
          {ticks.map((tick, index) => {
            const tickAngle = Number(valueToAngle(tick).toFixed(4));
            const innerPoint = angleToCoordinates(tickAngle, -15);
            const outerPoint = angleToCoordinates(tickAngle, 15);

            // Different label positions for range values
            const labelPoint = angleToCoordinates(
              tickAngle,
              -30 // Place values inside arc
            );

            return (
              <React.Fragment key={index}>
                <line
                  x1={innerPoint.x}
                  y1={innerPoint.y}
                  x2={outerPoint.x}
                  y2={outerPoint.y}
                  stroke="hsl(25, 95%, 53%)"
                  strokeWidth="1"
                />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-orange-500 font-medium"
                >
                  {tick.toFixed(0)}
                </text>
              </React.Fragment>
            );
          })}

          {/* SP marker */}
          {(() => {
            const tickAngle = Number(valueToAngle(SP).toFixed(4));
            const innerPoint = angleToCoordinates(tickAngle, -15);
            const outerPoint = angleToCoordinates(tickAngle, 15);

            return (
              <line
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="hsl(0, 100%, 45%)"
                strokeWidth="2"
              />
            );
          })()}

          {/* Current value text */}
          <text
            x={baseCenterX}
            y={baseCenterY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-4xl font-bold fill-primary"
          >
            {PV.toFixed(1)}
          </text>
          <text
            x={baseCenterX}
            y={baseCenterY - 40}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xl fill-muted-foreground"
          >
            {unit}
          </text>
        </svg>
      </div>
      <div className="mt-4 w-full">
        <label
          htmlFor="sp-slider"
          className="text-sm font-medium block text-right text-red-600"
        >
          SP: {SP.toFixed(1)}
        </label>
        <Slider
          id="sp-slider"
          min={min}
          max={max}
          step={0.1}
          value={[SP]}
          onValueChange={([value]) => setSP(value)}
          className="my-2"
        />
      </div>
    </div>
  );
}
