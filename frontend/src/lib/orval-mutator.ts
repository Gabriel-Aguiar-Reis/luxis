import { useAuthStore } from '@/stores/use-auth-store'
import { notifySessionExpired } from '@/lib/session-feedback'

export type ErrorType<T> = T & {
  message: string
  status: number
}

// Requests go through this app's own proxy (see /api/backend) so the
// session cookie stays scoped to the frontend's domain instead of the
// backend's, letting middleware read it while keeping it httpOnly.
const API = '/api/backend'
const REQUEST_TIMEOUT_MS = 15000
const RETRYABLE_METHODS = new Set(['GET', 'HEAD'])
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504])
// fetch() throws synchronously if a GET/HEAD request has a body.
const BODYLESS_METHODS = new Set(['GET', 'HEAD'])

function shouldRetry(method: string, status?: number, attempt = 0) {
  if (!RETRYABLE_METHODS.has(method) || attempt >= 2) return false
  if (status === undefined) return true
  return RETRYABLE_STATUS.has(status)
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
  const method = ((options?.method as string) ?? 'GET').toUpperCase()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) ?? {})
  }

  // Some Orval-generated GET calls include a body (the query params are
  // already encoded in the URL), but fetch() throws synchronously if a
  // GET/HEAD request has a body, silently failing before any request is
  // ever sent. Strip it here instead of touching the generated code.
  const { body: _unusedBody, ...restOptions } = options ?? {}
  const bodyForRequest = BODYLESS_METHODS.has(method)
    ? undefined
    : options?.body

  for (let attempt = 0; attempt <= 2; attempt++) {
    // Combine our own timeout with the caller's signal (e.g. react-query's,
    // used to cancel on unmount/refetch) so both can abort the request,
    // while still letting us tell them apart afterwards.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const externalSignal = options?.signal
    const onExternalAbort = () => controller.abort()
    externalSignal?.addEventListener('abort', onExternalAbort)

    try {
      const response = await fetch(`${API}${url}`, {
        ...restOptions,
        method,
        headers,
        body: bodyForRequest,
        credentials: 'include',
        signal: controller.signal
      })

      clearTimeout(timeout)

      let body: unknown
      try {
        body = await response.json()
      } catch {
        body = undefined
      }

      if (!response.ok) {
        if (response.status === 401) {
          useAuthStore.getState().logout()
          notifySessionExpired()
        }

        if (shouldRetry(method, response.status, attempt)) {
          await wait((attempt + 1) * 300)
          continue
        }

        const err = new Error(
          (body as { message?: string })?.message ?? 'Erro inesperado'
        ) as Error & { status: number; data: unknown }
        err.status = response.status
        err.data = body
        throw err
      }

      return {
        data: body,
        status: response.status,
        headers: response.headers
      } as T
    } catch (error) {
      clearTimeout(timeout)

      if (error instanceof Error && (error as any).status) {
        if (!shouldRetry(method, (error as any).status, attempt)) throw error
        await wait((attempt + 1) * 300)
        continue
      }

      if (error instanceof Error && error.name === 'AbortError') {
        // Cancelled by the caller (e.g. react-query on unmount/refetch),
        // not our own timeout: propagate as-is so the caller can recognize
        // and ignore it instead of surfacing a fake error to the UI.
        if (externalSignal?.aborted) {
          throw error
        }

        if (shouldRetry(method, 408, attempt)) {
          await wait((attempt + 1) * 300)
          continue
        }
        const err = Object.assign(new Error('Tempo limite excedido'), {
          status: 408
        })
        throw err
      }

      if (shouldRetry(method, undefined, attempt)) {
        await wait((attempt + 1) * 300)
        continue
      }

      throw error
    } finally {
      externalSignal?.removeEventListener('abort', onExternalAbort)
    }
  }

  throw Object.assign(new Error('Erro inesperado'), { status: 500 })
}
