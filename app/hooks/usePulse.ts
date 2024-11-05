import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// export interface qryProps1 {
//   tags: string[];
//   num_records: number;
// }
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

interface ApiDataPoint {
  timestamp: string;
  data: {
    [key: string]: number;
  };
}

export function useLastRecords(tag_names: string[]) {
  return useQuery<number[]>({
    queryKey: ["simpletrend"],
    queryFn: async () => {
      const response = await axios.get<number[]>(
        "http://localhost:8000/pulse-last",
        {
          params: { tags: tag_names.join(",") },
        }
      );
      console.log(response.data);
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 15000,
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
        {
          params: { tags: tags.join(","), start, end },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 20000,
    networkMode: "always",
  });
}
