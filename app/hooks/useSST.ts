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
    queryKey: ["sst-dt", queryData.tag, queryData.start, queryData.end],
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
    // refetchOnWindowFocus: false,
    refetchInterval: refreshInterval * 1000, // Convert seconds to milliseconds
    // networkMode: "always",
  });
}
