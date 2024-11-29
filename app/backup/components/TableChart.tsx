"use client";
import React from "react";
import { Chart } from "react-google-charts";
import { GoogleChartData } from "../targets/page";

const options = {
  allowHtml: true,
  showRowNumber: false,
};

const formatters = [
  {
    type: "BarFormat" as const,
    column: 1,
    options: {
      width: 140,
    },
  },
];

const TableChart = ({ dataTable }: { dataTable: GoogleChartData }) => {
  return (
    <Chart
      chartType="Table"
      // width="100%"
      // height="400px"
      data={dataTable}
      options={options}
      formatters={formatters}
    />
  );
};

export default TableChart;
function useTrendPVandSP(): { data: any } {
  throw new Error("Function not implemented.");
}

function useState<T>(): [any, any] {
  throw new Error("Function not implemented.");
}

function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error("Function not implemented.");
}
