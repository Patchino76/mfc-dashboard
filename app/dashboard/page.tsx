'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export default function Page() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['lastValue'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/last_value')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    refetchInterval: 1000, // Refetch every 1000ms (1 second)
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Last Value</h1>
        <p className="text-4xl font-semibold">{data}</p>
      </div>
    </div>
  )
}