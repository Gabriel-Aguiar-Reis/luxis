import { useAuthStore } from '@/stores/use-auth-store'
import { toast } from 'sonner'

export class ApiError extends Error {
  status: number
  data: any
  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  requireAuth = false,
  method?: string
): Promise<T> {
  let headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (
    options.headers &&
    typeof options.headers === 'object' &&
    !Array.isArray(options.headers)
  ) {
    headers = { ...headers, ...(options.headers as Record<string, string>) }
  }

  if (requireAuth) {
    const accessToken = useAuthStore.getState().accessToken
    if (!accessToken) {
      throw new ApiError('Sessão expirada. Faça login novamente.', 401)
    }
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API}${url}`, {
    ...options,
    method: method ?? options.method ?? 'GET',
    headers
  })

  let data
  try {
    data = await response.json()
  } catch {
    data = undefined
  }

  if (!response.ok) {
    toast.error(data?.message || 'Erro inesperado. Tente novamente mais tarde.')
    throw new ApiError(
      data?.message || 'Erro inesperado',
      response.status,
      data
    )
  }

  return data as T
}
