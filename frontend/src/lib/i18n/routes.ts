import { useCallback } from 'react'

export function useLocalizedRoute() {
  return useCallback((segment: string) => segment, [])
}
