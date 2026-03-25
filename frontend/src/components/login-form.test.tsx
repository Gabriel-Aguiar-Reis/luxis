import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginForm } from '@/components/login-form'
import { AdminLoginForm } from '@/components/admin-login-form'

const { loginMock, logoutMock, pushMock, toastErrorMock, toastSuccessMock } =
  vi.hoisted(() => ({
    loginMock: vi.fn(),
    logoutMock: vi.fn(),
    pushMock: vi.fn(),
    toastErrorMock: vi.fn(),
    toastSuccessMock: vi.fn()
  }))

vi.mock('@/stores/use-auth-store', () => ({
  useAuthStore: () => ({
    login: loginMock,
    logout: logoutMock
  })
}))

vi.mock('@/lib/i18n/navigation', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      title: 'Login',
      description: 'Entre na sua conta',
      email: 'Email',
      password: 'Senha',
      forgotPassword: 'Esqueceu sua senha?',
      authError: 'Acesso negado',
      inactiveAccount: 'Conta inativa',
      successMessage: 'Login realizado com sucesso',
      loading: 'Entrando...',
      button: 'Acessar',
      resellerOnlyBadge: 'Acesso exclusivo para revendedores',
      dontHaveAccount: 'Você não possui uma conta?',
      signUp: 'Registrar-se',
      emailInvalid: 'Email inválido',
      passwordPlaceholder: 'Password@123',
      passwordMinLength: 'A senha deve ter pelo menos 6 caracteres',
      showPassword: 'Mostrar Senha',
      restrictedArea: 'Área admin',
      restrictedAreaHref: 'Ir para revendedor',
      restrictedAreaReseller: 'Área revendedor',
      restrictedAreaHrefReseller: 'Ir para admin'
    }

    return messages[key] ?? key
  }
}))

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock
  }
}))

function fillAndSubmit() {
  fireEvent.change(screen.getAllByLabelText('Email')[0], {
    target: { value: 'user@luxis.com' }
  })
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: 'Password@123' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Acessar' }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    loginMock.mockReset()
    logoutMock.mockReset()
    pushMock.mockReset()
    toastErrorMock.mockReset()
    toastSuccessMock.mockReset()
  })

  it('redireciona revendedor ativo para minha area', async () => {
    loginMock.mockResolvedValueOnce({
      role: 'RESELLER',
      status: 'ACTIVE'
    })

    render(<LoginForm />)
    fillAndSubmit()

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/my-space')
    })

    expect(toastSuccessMock).toHaveBeenCalledWith('Login realizado com sucesso')
    expect(logoutMock).not.toHaveBeenCalled()
  })

  it('faz logout e bloqueia papel incorreto no login de revendedor', async () => {
    loginMock.mockResolvedValueOnce({
      role: 'ADMIN',
      status: 'ACTIVE'
    })

    render(<LoginForm />)
    fillAndSubmit()

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled()
    })

    expect(toastErrorMock).toHaveBeenCalledWith(
      'Acesso negado. Este login é exclusivo para revendedores.'
    )
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('faz logout e bloqueia conta inativa no login de revendedor', async () => {
    loginMock.mockResolvedValueOnce({
      role: 'RESELLER',
      status: 'INACTIVE'
    })

    render(<LoginForm />)
    fillAndSubmit()

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled()
    })

    expect(toastErrorMock).toHaveBeenCalledWith('Conta inativa')
    expect(pushMock).not.toHaveBeenCalled()
  })
})

describe('AdminLoginForm', () => {
  beforeEach(() => {
    loginMock.mockReset()
    logoutMock.mockReset()
    pushMock.mockReset()
    toastErrorMock.mockReset()
    toastSuccessMock.mockReset()
  })

  it('redireciona admin ativo para home', async () => {
    loginMock.mockResolvedValueOnce({
      role: 'ADMIN',
      status: 'ACTIVE'
    })

    render(<AdminLoginForm />)
    fillAndSubmit()

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/home')
    })

    expect(toastSuccessMock).toHaveBeenCalledWith('Login realizado com sucesso')
    expect(logoutMock).not.toHaveBeenCalled()
  })

  it('faz logout e bloqueia papel incorreto no login admin', async () => {
    loginMock.mockResolvedValueOnce({
      role: 'RESELLER',
      status: 'ACTIVE'
    })

    render(<AdminLoginForm />)
    fillAndSubmit()

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled()
    })

    expect(toastErrorMock).toHaveBeenCalledWith('Acesso negado')
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('faz logout e bloqueia conta inativa no login admin', async () => {
    loginMock.mockResolvedValueOnce({
      role: 'ADMIN',
      status: 'INACTIVE'
    })

    render(<AdminLoginForm />)
    fillAndSubmit()

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled()
    })

    expect(toastErrorMock).toHaveBeenCalledWith('Conta inativa')
    expect(pushMock).not.toHaveBeenCalled()
  })
})
