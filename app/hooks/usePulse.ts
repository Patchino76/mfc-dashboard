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

export function useLastRecords(
  tag_names: string[],
  refreshInterval: number = 15
) {
  return useQuery<number[]>({
    queryKey: ["simpletrend"],
    queryFn: async () => {
      const response = await axios.get<number[]>(
        "http://localhost:8000/pulse-last",
        {
          params: { tags: tag_names.join(",") },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
  });
}

export function usePulseTrendwithTS(
  queryData: qryProps2,
  refreshInterval: number = 20
) {
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
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
  });
}
