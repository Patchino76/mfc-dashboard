"use client";
import { Chart } from "react-google-charts";



const AreaChart = ({ data }: { data: (string | number)[][] }) => {
  const options = {
    title: "тренд концентрат",
    hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 50 },
    chartArea: { width: "80%", height: "80%" },
    curveType: "function",
    colors: ['blue', 'gray'],
  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="100%"
      data={data}
      options={options}
    />
  );
};

export default AreaChart;
