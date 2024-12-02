"use client";
import React from "react";
import { generateFakeData } from "../utils/generate-mill-data";
import { useMills } from "../hooks/useMills";
import MillInfo from "../components/MillInfo";

const MillsInfoPage = () => {
  const { data } = useMills("Mill01");
  const { loadArray } = generateFakeData();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>{data && <MillInfo millProps={data} oreTrend={loadArray} />}</div>
  );
};

export default MillsInfoPage;
