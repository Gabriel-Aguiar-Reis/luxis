import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch, ApiError } from '@/lib/api-client'
import { resetSessionFeedbackState } from '@/lib/session-feedback'

const { logoutMock, notifySessionExpiredMock } = vi.hoisted(() => ({
  logoutMock: vi.fn(),
  notifySessionExpiredMock: vi.fn()
}))

vi.mock('@/stores/use-auth-store', () => ({
  useAuthStore: {
    getState: () => ({
      logout: logoutMock
    })
  }
}))

vi.mock('@/lib/session-feedback', async () => {
  const actual = await vi.importActual<typeof import('@/lib/session-feedback')>(
    '@/lib/session-feedback'
  )

  return {
    ...actual,
    notifySessionExpired: notifySessionExpiredMock
  }
})

describe('apiFetch', () => {
  beforeEach(() => {
    logoutMock.mockReset()
    notifySessionExpiredMock.mockReset()
    resetSessionFeedbackState()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('faz logout e notifica expiracao em 401 autenticado', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' })
    } as Response)

    await expect(
      apiFetch('/protected', {}, true, 'POST')
    ).rejects.toBeInstanceOf(ApiError)

    expect(logoutMock).toHaveBeenCalled()
    expect(notifySessionExpiredMock).toHaveBeenCalled()
  })

  it('nao notifica expiracao quando a requisicao nao exige autenticacao', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' })
    } as Response)

    await expect(apiFetch('/public', {}, false, 'POST')).rejects.toBeInstanceOf(
      ApiError
    )

    expect(logoutMock).not.toHaveBeenCalled()
    expect(notifySessionExpiredMock).not.toHaveBeenCalled()
  })
})
