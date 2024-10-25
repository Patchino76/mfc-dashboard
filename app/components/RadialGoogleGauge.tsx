import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";


export const options = {
  width: 550,
  height: 250,
  redFrom: 90,
  redTo: 100,
  yellowFrom: 75,
  yellowTo: 90,
  minorTicks: 5,
};

const RadialGoogleGauge = ({data} : {data: (string | number)[][]})  => {
  return (
    <Chart
      chartType="Gauge"
      // width="100%"
      // height="100%"
      data={data}
      options={options}
    />
  );
}

export default RadialGoogleGauge
