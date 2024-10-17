"use client";
import React from "react";
import RadialGauge from "./RadialGauge";
import { useTrend } from "../hooks/useTrend";

const RadialGaugeContainer = () => {
  const { data } = useTrend();
  console.log(data);
  return <RadialGauge value={data && data.length >0 ? data[0] : 50} />;
};

export default RadialGaugeContainer;
