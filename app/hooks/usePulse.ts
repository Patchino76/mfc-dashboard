import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface qryProps {
  tags: string[];
  num_records: number;
}

export function usePulseTrend(queryData: qryProps) {
  return useQuery<number[][]>({
    queryKey: ["simpletrend"],
    queryFn: async () => {
        const { tags, num_records } = queryData;
        const response = await axios.get<number[][]>('http://localhost:8000/pulse', {
            params: { tags, num_records },
          });
        return response.data;
    },
    staleTime: 0,
    refetchInterval: 5000,
    networkMode: "always",
  });
}


