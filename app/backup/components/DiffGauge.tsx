"use client";
import React from "react";
import { Chart } from "react-google-charts";

export interface DiffdataProps {
  diffdata: {
    old: (string | number)[][];
    new: (string | number)[][];
  };
}
const DiffGaugeChart = ({diffdata} : DiffdataProps) => {
  var options = {
    title: "",
    legend: { position: "none" },
    colors: ['blue','green'],
  };
  return (
    <Chart
      chartType="ColumnChart"
      options={options}
      width="100%"
      height="400px"
      diffdata={diffdata}
    />
  );
};

export default DiffGaugeChart;
