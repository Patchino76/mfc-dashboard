"use client";
import GaugeComponent from "react-gauge-component";
import dynamic from "next/dynamic";

import React from "react";

const RadialGauge = ({val} : {val: number})  => {
  return (
    <div>
      <GaugeComponent
        arc={{
          subArcs: [
            {
              limit: 20,
              color: "#EA4228",
              showTick: true,
            },
            {
              limit: 40,
              color: "#F58B19",
              showTick: true,
            },
            {
              limit: 60,
              color: "#F5CD19",
              showTick: true,
            },
            {
              limit: 100,
              color: "#5BE12C",
              showTick: true,
            },
          ],
        }}
        value={val}
      />
    </div>
  );
};

export default RadialGauge;
