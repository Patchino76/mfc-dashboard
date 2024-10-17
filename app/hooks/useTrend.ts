import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Response = {
    trend: number[]
}

export function useTrend() {
  return useQuery<number[]>({
    queryKey: ['lastValue'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/trend')
      return response.data
    },
    staleTime: 0, 
    refetchInterval: 2000, 
    networkMode: 'always'
  })
}