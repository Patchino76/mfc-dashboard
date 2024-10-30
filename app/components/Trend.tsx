"use client";
import { Chart } from "react-google-charts";
import { ChartData } from "../targets/page";

const Trend = ({ data }: { data: ChartData }) => {
  console.log(data);
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  const options = {
    title: "тренд концентрат",
    hAxis: {
      title: "Дата",
      titleTextStyle: { color: "#333" },
      format: "MMM dd, yyyy",
      gridlines: { count: 3 },
      ticks: data
        .map((point, index) => (index % 10 === 0 ? new Date(point[0]) : null)) // Increase the interval to show every 10th timestamp
        .filter((tick) => tick !== null),
    },
    vAxis: { minValue: 80, maxValue: 100 },
    chartArea: { width: "90%", height: "60%" },
    curveType: "function",
    colors: ["blue"],
    legend: { position: "none" }, // Hide the legend
    intervals: { style: "area" },
    gridlines: { color: "#ccc", count: -1 },
  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="100%"
      data={data}
      options={options}
      formatters={[
        {
          column: 0,
          type: "DateFormat",
          options: {
            timeZone: 0,
          },
        },
      ]}
    />
  );
};

export default Trend;
