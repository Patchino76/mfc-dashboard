import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

interface RadialGoogleGaugeProps {
  data: (string | number)[][];
  min?: number;
  max?: number;
  redFrom?: number;
  redTo?: number;
  yellowFrom?: number;
  yellowTo?: number;
  greenFrom?: number;
  greenTo?: number;
  minorTicks?: number;
}

// const RadialGoogleGauge = ({ data }: { data: (string | number)[][] }) => {
const RadialGoogleGauge = ({
  data,
  min = 0,
  max = 100,
  redFrom = 90,
  redTo = 100,
  yellowFrom = 75,
  yellowTo = 90,
  minorTicks = 5,
  greenFrom = 0,
  greenTo = 75,
}: RadialGoogleGaugeProps) => {
  const options = {
    min: min,
    max: max,
    redFrom: redFrom,
    redTo: redTo,
    yellowFrom: yellowFrom,
    yellowTo: yellowTo,
    greenFrom: greenFrom,
    greenTo: greenTo,
    minorTicks: minorTicks,
  };
  return (
    <Chart
      chartType="Gauge"
      // width="100%"
      // height="100%"
      data={data}
      options={options}
    />
  );
};

export default RadialGoogleGauge;
