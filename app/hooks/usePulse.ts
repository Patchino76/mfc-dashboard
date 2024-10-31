import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface qryProps {
  tags: string[];
  num_records: number;
}

export interface responseProps {
  tag_id: number;
  tagname: string;
  timestamp: string;
  value: number;
}

export function usePulseTrend(queryData: qryProps) {
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

export function usePulseTrendwithTS(queryData: qryProps) {
  return useQuery<responseProps[]>({
    queryKey: ["trend-ts"],
    queryFn: async () => {
      const { tags, num_records } = queryData;
      const response = await axios.get<responseProps[]>(
        "http://localhost:8000/pulse-ts",
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
