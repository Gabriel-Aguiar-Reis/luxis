import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ResellerSidebar } from '@/components/reseller-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

const { logoutMock, pushMock, toastSuccessMock } = vi.hoisted(() => ({
  logoutMock: vi.fn(),
  pushMock: vi.fn(),
  toastSuccessMock: vi.fn()
}))

vi.mock('@/stores/use-auth-store', () => ({
  useAuthStore: () => ({
    logout: logoutMock
  })
}))

vi.mock('@/lib/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  usePathname: () => '/my-space',
  useRouter: () => ({
    push: pushMock
  })
}))

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const messages: Record<string, Record<string, string>> = {
      Common: {
        Dashboard: 'Dashboard',
        ResellerArea: 'Revenda',
        Settings: 'Configurações',
        Logout: 'Sair',
        LogoutSuccess: 'Logout realizado com sucesso'
      },
      Inventory: { title: 'Meu Estoque' },
      Customers: { title: 'Clientes' },
      Sales: { title: 'Minhas Vendas' },
      Returns: { title: 'Devoluções' },
      Transfers: { title: 'Trocas' },
      Shipments: { title: 'Romaneios' }
    }

    return messages[namespace]?.[key] ?? key
  }
}))

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock
  }
}))

describe('ResellerSidebar', () => {
  beforeEach(() => {
    logoutMock.mockReset()
    pushMock.mockReset()
    toastSuccessMock.mockReset()

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    })
  })

  it('realiza logout e redireciona para o login', () => {
    render(
      <SidebarProvider>
        <ResellerSidebar />
      </SidebarProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(logoutMock).toHaveBeenCalled()
    expect(toastSuccessMock).toHaveBeenCalledWith(
      'Logout realizado com sucesso'
    )
    expect(pushMock).toHaveBeenCalledWith('/login')
  })
})
