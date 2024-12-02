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
