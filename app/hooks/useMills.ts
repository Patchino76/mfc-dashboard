import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface MillInfoProps {
  title: string;
  state: boolean;
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
export interface MillsByParameter {
  mill: string;
  value: number;
}

export function useMills(mill: string, refreshInterval: number = 20) {
  return useQuery<MillInfoProps>({
    queryKey: ["ore-by-mill-totals", mill],
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
    queryKey: ["mills-trend-by-tag", mill, tag, trendPoints],
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
    retry: 2,
  });
}

export function useMillsByParameter(
  parameter: string,
  refreshInterval: number = 20
) {
  return useQuery<MillsByParameter[]>({
    queryKey: ["mills-by-parameter", parameter],
    queryFn: async () => {
      const response = await axios.get<MillsByParameter[]>(
        "http://localhost:8000/mills-by-parameter",
        {
          params: { parameter },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
    retry: 2,
  });
}
