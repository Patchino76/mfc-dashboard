import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface qryProps {
  tags: string[];
  start: string;
  end: string;
}
export interface qryPropsReg {
  tags_regression: string[];
  start: string;
  end: string;
}
export interface qryPropsKde {
  tag_kde: string;
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

export function usePulseReg(
  queryData: qryPropsReg,
  refreshInterval: number = 23
) {
  return useQuery({
    queryKey: ["png-image"],
    queryFn: async () => {
      const { tags_regression, start, end } = queryData;
      const response = await axios.get(
        "http://localhost:8000/reg",

        {
          params: { tags: tags_regression.join(","), start, end },
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

export function usePulseKde(
  queryData: qryPropsKde,
  sp: number,
  refreshInterval: number = 23
) {
  return useQuery({
    queryKey: ["png-kde-density"],
    queryFn: async () => {
      const { tag_kde, start, end } = queryData;
      const response = await axios.get(
        "http://localhost:8000/kde",

        {
          params: { tags: tag_kde, start, end, sp },
          responseType: "blob",
        }
      );
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    },

    staleTime: 10,
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
  });
}
