import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { AuthSessionSync } from '@/components/auth/auth-session-sync'

const { notifySessionExpiredMock, replaceMock, storeState } = vi.hoisted(
  () => ({
    notifySessionExpiredMock: vi.fn(),
    replaceMock: vi.fn(),
    storeState: {
      hydrated: true,
      isAuthenticated: false,
      logout: vi.fn(),
      user: null as {
        role: 'ADMIN' | 'RESELLER'
        status: 'ACTIVE' | 'PENDING' | 'INACTIVE'
      } | null,
      verify: vi.fn()
    }
  })
)

vi.mock('@/lib/i18n/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock
  })
}))

vi.mock('@/stores/use-auth-store', () => ({
  useAuthStore: () => storeState
}))

vi.mock('@/lib/session-feedback', () => ({
  notifySessionExpired: notifySessionExpiredMock
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('AuthSessionSync', () => {
  beforeEach(() => {
    replaceMock.mockReset()
    notifySessionExpiredMock.mockReset()
    storeState.logout.mockReset()
    storeState.verify.mockReset()
    storeState.hydrated = true
    storeState.isAuthenticated = false
    storeState.user = null
  })

  it('nao verifica sessao antes da hidratacao', () => {
    storeState.hydrated = false

    render(<AuthSessionSync expectedRole="ADMIN" redirectTo="/admin-login" />)

    expect(storeState.verify).not.toHaveBeenCalled()
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('redireciona e mostra toast quando a sessao expira', async () => {
    storeState.isAuthenticated = true
    storeState.user = null
    storeState.verify.mockRejectedValueOnce(new Error('unauthorized'))

    render(<AuthSessionSync expectedRole="ADMIN" redirectTo="/admin-login" />)

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/admin-login')
    })

    expect(notifySessionExpiredMock).toHaveBeenCalled()
  })

  it('nao redireciona quando a sessao valida corresponde ao papel esperado', async () => {
    storeState.verify.mockResolvedValueOnce({
      user: {
        role: 'RESELLER',
        status: 'ACTIVE'
      }
    })

    render(<AuthSessionSync expectedRole="RESELLER" redirectTo="/login" />)

    await waitFor(() => {
      expect(storeState.verify).toHaveBeenCalled()
    })

    expect(replaceMock).not.toHaveBeenCalled()
    expect(notifySessionExpiredMock).not.toHaveBeenCalled()
  })
})
