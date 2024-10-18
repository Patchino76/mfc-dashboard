'use client';
import React from 'react'
import { Chart } from "react-google-charts";

const dataOld = [
  ["Name", "Целта"],
  ["Извличане", 90],
];

const dataNew = [
  ["Name", "Цел"],
  ["Извличане", 80],
];


export const diffdata = {
  old: dataOld,
  new: dataNew,
};

const DiffGaugeChart = () => {
  return (
<Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      diffdata={diffdata}
    />
  )
}

export default DiffGaugeChart
