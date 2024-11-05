import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface qryProps1 {
  tags: string[];
  num_records: number;
}
export interface qryProps2 {
  tags: string[];
  start: string;
  end: string;
}

export interface responseProps {
  tag_id: number;
  tagname: string;
  timestamp: string;
  value: number;
}

<<<<<<< HEAD
interface DataPoint {
  [key: string]: number;
}
export type DataRecord = Record<string, DataPoint>;

interface ApiDataPoint {
  timestamp: string;
  data: {
    [key: string]: number;
  };
}
// export type DataRecord = Record<string, DataPoint>;
// export interface TsWithTagVals {
//   timestamp: string;
//   tagvals: DataPoint[];
// }

export function usePulseTrend(queryData: qryProps1) {
  return useQuery<number[][]>({
    queryKey: ["simpletrend"],
    queryFn: async () => {
      const { tags, num_records } = queryData;
      // const tags = ['RECOVERY_LINE1_CU_LONG' , 'RECOVERY_LINE2_CU_LONG'];
      // const num_records = 5;
      const response = await axios.get<number[][]>(
        "http://localhost:8000/pulse",
        {
          params: { tags: tags.join(","), num_records },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 5000,
    networkMode: "always",
  });
}

export function usePulseTrendwithTS(queryData: qryProps2) {
  return useQuery<ApiDataPoint[]>({
    queryKey: ["trend-ts"],
    queryFn: async () => {
      const { tags, start, end } = queryData;
      const response = await axios.get<ApiDataPoint[]>(
        "http://localhost:8000/pulse-ts",
>>>>>>> 4aae00da0b7487d44ccb24931b9ea3d586640dde
        {
          params: { tags: tags.join(","), start, end },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 10000,
    networkMode: "always",
  });
}
