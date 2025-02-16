import { useQuery } from '@tanstack/react-query'

interface ExampleResponse {
  message: string
}

export function useExample() {
  return useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      const response = await fetch('/api/example')
      if (!response.ok) {
        throw new Error('데이터 조회 실패')
      }
      return response.json() as Promise<ExampleResponse>
    },
  })
} 