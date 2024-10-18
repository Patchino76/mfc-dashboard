"use client";
import GaugeComponent from "react-gauge-component";
import dynamic from "next/dynamic";

import React from "react";

const RadialGauge = ({ value }: { value: number }) => {
  return (
    <div>
<GaugeComponent 
  value={value}
  type="radial"
  labels={{
    tickLabels: {
      type: "inner",
      ticks: [
        { value: 20 },
        { value: 40 },
        { value: 60 },
        { value: 80 },
        { value: 100 }
      ]
    }
  }}
  arc={{
    colorArray: ['#5BE12C','#EA4228'],
    subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
    padding: 0.02,
    width: 0.3
  }}
  pointer={{
    elastic: false,
    animationDelay: 1
  }}
/>
    </div>
  );
};

export default RadialGauge;
