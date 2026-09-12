import { useAuthStore } from '@/stores/use-auth-store'
import { notifySessionExpired } from '@/lib/session-feedback'

export class ApiError extends Error {
  status: number
  data: any
  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

// Requests go through this app's own proxy (see /api/backend) so the
// session cookie stays scoped to the frontend's domain instead of the
// backend's, letting middleware read it while keeping it httpOnly.
const API = '/api/backend'
const REQUEST_TIMEOUT_MS = 15000
const RETRYABLE_METHODS = new Set(['GET', 'HEAD'])
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504])
const BODYLESS_METHODS = new Set(['GET', 'HEAD'])

function buildHeaders(options: RequestInit): Record<string, string> {
  let headers: Record<string, string> = {}

  if (
    options.body !== undefined &&
    options.body !== null &&
    options.body !== ''
  ) {
    headers['Content-Type'] = 'application/json'
  }

  if (
    options.headers &&
    typeof options.headers === 'object' &&
    !Array.isArray(options.headers)
  ) {
    headers = { ...headers, ...(options.headers as Record<string, string>) }
  }

  return headers
}

function shouldRetry(method: string, status?: number, attempt = 0) {
  if (!RETRYABLE_METHODS.has(method) || attempt >= 2) {
    return false
  }

  if (status === undefined) {
    return true
  }

  return RETRYABLE_STATUS.has(status)
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export type ApiResponse<T> = {
  data: T
  status: number
  headers: Headers
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  requireAuth = false,
  method?: string
): Promise<ApiResponse<T>> {
  const requestMethod = (method ?? options.method ?? 'GET').toUpperCase()
  const headers = buildHeaders(options)
  const { body: _unusedBody, ...restOptions } = options
  const body = BODYLESS_METHODS.has(requestMethod) ? undefined : options.body

  for (let attempt = 0; attempt <= 2; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const externalSignal = options.signal
    const onExternalAbort = () => controller.abort()
    externalSignal?.addEventListener('abort', onExternalAbort)

    try {
      const response = await fetch(`${API}${url}`, {
        ...restOptions,
        method: requestMethod,
        headers,
        body,
        credentials: options.credentials ?? 'include',
        signal: controller.signal
      })

      clearTimeout(timeout)

      let data
      try {
        data = await response.json()
      } catch {
        data = undefined
      }

      if (!response.ok) {
        if (response.status === 401 && requireAuth) {
          useAuthStore.getState().logout()
          notifySessionExpired()
        }

        if (shouldRetry(requestMethod, response.status, attempt)) {
          await wait((attempt + 1) * 300)
          continue
        }

        throw new ApiError(
          data?.message || 'Erro inesperado',
          response.status,
          data
        )
      }

      return {
        data: data as T,
        status: response.status,
        headers: response.headers
      }
    } catch (error) {
      clearTimeout(timeout)

      if (
        error instanceof ApiError &&
        !shouldRetry(requestMethod, error.status, attempt)
      ) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        if (externalSignal?.aborted) {
          throw error
        }

        if (shouldRetry(requestMethod, 408, attempt)) {
          await wait((attempt + 1) * 300)
          continue
        }

        throw new ApiError('Tempo limite da requisição excedido', 408)
      }

      if (shouldRetry(requestMethod, undefined, attempt)) {
        await wait((attempt + 1) * 300)
        continue
      }

      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError('Falha de conexão com a API', 0, error)
    } finally {
      externalSignal?.removeEventListener('abort', onExternalAbort)
    }
  }

  throw new ApiError('Erro inesperado', 500)
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  requireAuth = false,
  method?: string
): Promise<T> {
  const response = await apiRequest<T>(url, options, requireAuth, method)
  return response.data
}
