"use client";
import React from "react";
import { useMills, useMillsTrendByTag } from "../hooks/useMills";
import MillInfo from "../components/MillInfo";

const MillsInfoPage = () => {
  const { data } = useMills("Mill01");
  const { data: loadArray } = useMillsTrendByTag("Mill01", "ore", 500);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data && loadArray && <MillInfo millProps={data} oreTrend={loadArray} />}
    </div>
  );
};

export default MillsInfoPage;
