import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { Login, UpdateUser, Verify } from '@/lib/api-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type userPayload =
  Verify['responses']['200']['content']['application/json']['user']

type verifyDtoReturn = Verify['responses']['200']['content']['application/json']
type updateUserDto = UpdateUser['requestBody']['content']['application/json']

type LoginDto = Login['requestBody']['content']['application/json']
type LoginReturn = Login['responses']['200']['content']['application/json']
type AuthState = {
  user: userPayload | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hydrated: boolean
  login: (dto: LoginDto) => Promise<void>
  logout: () => void
  updateUser: (user: updateUserDto) => void
  verify: () => Promise<verifyDtoReturn>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hydrated: false,

      login: async (dto: LoginDto) => {
        set({ isLoading: true, error: null })
        try {
          const data = await apiFetch<LoginReturn>(
            apiPaths.auth.login,
            {
              body: JSON.stringify(dto)
            },
            false,
            'POST'
          )
          set({
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null
          })
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false
        })
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (!currentUser) return

        set({
          user: {
            ...currentUser,
            ...userData
          }
        })
      },

      verify: async () => {
        const accessToken = get().accessToken
        if (!accessToken) {
          get().logout()
          set({
            isLoading: false,
            error: 'Token de acesso ausente',
            isAuthenticated: false
          })
          return Promise.reject(new Error('Token de acesso ausente'))
        }
        set({ isLoading: true, error: null })
        try {
          const res = await apiFetch<verifyDtoReturn>(
            apiPaths.auth.verify,
            {},
            true,
            'POST'
          )
          if (!res.user) {
            set({ isAuthenticated: false, user: null, isLoading: false })
            return Promise.reject(new Error('Falha na verificação do token'))
          }
          set({ user: res.user, isAuthenticated: true, isLoading: false })
          return res
        } catch (err) {
          get().logout()
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Erro desconhecido',
            isAuthenticated: false,
            user: null,
            accessToken: null
          })
          return Promise.reject(err)
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              email: state.user.email,
              role: state.user.role,
              status: state.user.status,
              name: state.user.name
            }
          : null,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state?.user) {
          return {
            ...state,
            isAuthenticated: true,
            hydrated: true
          }
        } else {
          return {
            ...state,
            isAuthenticated: false,
            accessToken: null,
            user: null,
            hydrated: true
          }
        }
      }
    }
  )
)
