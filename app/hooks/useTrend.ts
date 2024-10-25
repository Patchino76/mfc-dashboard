import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface TrendResponseSpPv {
  pv: number[];
  sp: number[];
}

export function useTrend() {
  return useQuery<number[]>({
    queryKey: ["simpletrend"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/trend");
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 2000,
    networkMode: "always",
  });
}

export function useTrendPVandSP() {
  return useQuery<TrendResponseSpPv>({
    queryKey: ["trendpvandsp"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/trend_pv_sp");
      return response.data;
    },
    staleTime: 0,
    refetchInterval: 10000,
    networkMode: "always",
  });
}
