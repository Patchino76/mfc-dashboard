"use client";
import { Chart } from "react-google-charts";
import { ChartData } from "../targets/page";

const Trend = ({ data }: { data: ChartData }) => {
  // console.log(data);
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  const options = {
    // title: "тренд концентрат",
    hAxis: {
      // title: "Дата",
      titleTextStyle: { color: "#333" },
      // format: "MMM dd, yyyy",
      gridlines: { count: 5, color: "#ccc" },
      // ticks: 5,
    },
    vAxis: {
      title: "%",
      minValue: 85,
      maxValue: 95,
      gridlines: { color: "#ccc", count: 5 },
    },
    chartArea: { width: "85%", height: "70%", top: "5%" },
    curveType: "function",
    // colors: ["blue"],
    legend: { position: "none" }, // Hide the legend
    series: [{ color: "blue" }],
    lineWidth: 2,
    intervals: { style: "area" },
    // gridlines: { color: "red", count: -1 },
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

export default Trend;
