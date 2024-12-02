import React from "react";
import MillInfo from "../components/MillInfo";
import { generateFakeData } from "../utils/generate-mill-data";

const millData = generateFakeData();

const MillsInfoPage = () => {
  return (
    <div>
      <MillInfo {...millData} />
    </div>
  );
};

export default MillsInfoPage;
