"use client";
import { Card, Flex, Box, Text, Grid } from "@radix-ui/themes";
import { useTrendPVandSP } from "../hooks/useTrend";
import { useEffect, useRef, useState } from "react";
import TableChart from "./TableChart";

const CardTableChart = () => {
  const { data } = useTrendPVandSP();
  const [dataTable, setDataTable] = useState<(string | number)[][]>();
  useEffect(() => {
    if (data) {
      const dataTable = [
        ["часове", "SP - PV"],
        ["12 - 13", data.sp[0] - data.pv[0]],
        ["13 - 14", data.sp[1] - data.pv[1]],
        ["11 - 12", data.sp[2] - data.pv[2]],
        ["10 - 11", data.sp[3] - data.pv[3]],
        ["09 - 10", data.sp[4] - data.pv[4]],
        ["08 - 09", data.sp[5] - data.pv[5]],
        ["07 - 08", data.sp[6] - data.pv[6]],
        ["06 - 07", data.sp[7] - data.pv[7]],
        ["05 - 06", data.sp[8] - data.pv[8]],
        ["04 - 05", data.sp[9] - data.pv[9]],
        ["03 - 04", data.sp[10] - data.pv[10]],
        ["02 - 03", data.sp[11] - data.pv[11]],
        ["01 - 02", data.sp[12] - data.pv[12]],
        ["00 - 01", data.sp[13] - data.pv[13]],
        ["23 - 00", data.sp[14] - data.pv[14]],
        ["22 - 23", data.sp[15] - data.pv[15]],
        ["21 - 22", data.sp[16] - data.pv[16]],
        ["20 - 21", data.sp[17] - data.pv[17]],
        ["19 - 20", data.sp[18] - data.pv[18]],
        ["18 - 19", data.sp[19] - data.pv[19]],
        ["17 - 18", data.sp[20] - data.pv[20]],
        ["16 - 17", data.sp[21] - data.pv[21]],
        ["15 - 16", data.sp[22] - data.pv[22]],
        ["14 - 15", data.sp[23] - data.pv[23]],
      ];

      setDataTable(dataTable);
    }
  }, [data]);

  return (
    <Card
      style={{
        // width: "300px",
        height: "100%",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <Flex direction="column" gap="1" align={"center"}>
        <Text size="4" weight="bold">
          Извличане
        </Text>
        <Text as="p" size="2" color="gray">
          за последните часове
        </Text>
      </Flex>
      <Flex justify={"center"} align={"center"}>{dataTable && <TableChart dataTable={dataTable} />}</Flex>
    </Card>
  );
};

export default CardTableChart;
