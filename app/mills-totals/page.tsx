"use client";
import React from "react";
import MillsTotals from "../components/MillsTotals";
import { useMillsByParameter } from "../hooks/useMills";

// const machineData = [
//   { mill: "Machine 1", value: 120 },
//   { mill: "Machine 2", value: 150 },
//   { mill: "Machine 3", value: 200 },
//   { mill: "Machine 4", value: 180 },
//   { mill: "Machine 5", value: 90 },
//   { mill: "Machine 6", value: 220 },
//   { mill: "Machine 7", value: 140 },
//   { mill: "Machine 8", value: 170 },
//   { mill: "Machine 9", value: 130 },
//   { mill: "Machine 10", value: 160 },
//   { mill: "Machine 11", value: 110 },
//   { mill: "Machine 12", value: 190 },
// ];

const MillsTotalsPage = () => {
  const { data: machineData } = useMillsByParameter("ore");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 p-8">
      {machineData && <MillsTotals data={machineData} />}
    </div>
  );
};

export default MillsTotalsPage;
