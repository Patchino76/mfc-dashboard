import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface qryProps {
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
  queryData: qryProps,
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

export function usePulsePng(refreshInterval: number = 23) {
  return useQuery({
    queryKey: ["png-image"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8000/image",

        {
          // params: { tags: tags.join(","), start, end },
          responseType: "blob",
        }
      );
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    },

    staleTime: 0,
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
  });
}
