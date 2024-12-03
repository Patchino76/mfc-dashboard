import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface MillInfoProps {
  title: string;
  state: string;
  shift1?: number;
  shift2?: number;
  shift3?: number;
  total?: number;
  ore: number;
}

export interface TrendDataPoint {
  timestamp: string;
  value: number;
}

export function useMills(mill: string, refreshInterval: number = 20) {
  return useQuery<MillInfoProps>({
    queryKey: ["ore-by-mill-totals"],
    queryFn: async () => {
      const response = await axios.get<MillInfoProps>(
        "http://localhost:8000/ore-by-mill",
        {
          params: { mill },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
  });
}

export function useMillsTrendByTag(
  mill: string,
  tag: string,
  trendPoints: number = 500, // No. raw points resampled to 1h freq
  refreshInterval: number = 20
) {
  return useQuery<TrendDataPoint[]>({
    queryKey: ["mills-trend-by-tag", mill, tag],
    queryFn: async () => {
      const response = await axios.get<TrendDataPoint[]>(
        "http://localhost:8000/mills-trend-by-tag",
        {
          params: { mill, tag, trendPoints },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
  });
}
