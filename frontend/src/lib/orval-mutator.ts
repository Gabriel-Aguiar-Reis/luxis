import { useAuthStore } from '@/stores/use-auth-store'
import { notifySessionExpired } from '@/lib/session-feedback'
import { ApiError, apiRequest } from '@/lib/api-client'

export type ErrorType<T> = T & {
  message: string
  status: number
}

/**
 * Mutador customizado do Orval.
 * Retorna o formato { data, status, headers } esperado pelos tipos gerados.
 * Usa cookies para autenticação (credentials: 'include').
 */
export const customInstance = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    return (await apiRequest<unknown>(url, options, false)) as T
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      useAuthStore.getState().logout()
      notifySessionExpired()
    }

    throw error
  }
}
