import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface qryProps {
  tag: string;
  start: string;
  end: string;
}
export type DowntimeEntry = [string, string, number];

export function useSST(queryData: qryProps, refreshInterval: number = 20) {
  return useQuery<DowntimeEntry[]>({
    queryKey: ["tsst-dt"],
    queryFn: async () => {
      const { tag, start, end } = queryData;
      const response = await axios.get<DowntimeEntry[]>(
        "http://localhost:8000/sst-downtimes",

        {
          params: { tag, start, end },
        }
      );
      return response.data;
    },
    staleTime: 0,
    refetchInterval: refreshInterval * 1000,
    networkMode: "always",
  });
}
