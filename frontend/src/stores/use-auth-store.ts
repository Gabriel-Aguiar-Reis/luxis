import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import {
  Login,
  ChangePassword,
  ResetPassword,
  UpdateUser,
  Verify
} from '@/lib/api-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type userPayload =
  Verify['responses']['200']['content']['application/json']['user']

type loginDto = Login['requestBody']['content']['application/json']
type verifyDtoReturn = Verify['responses']['200']['content']['application/json']
type updateUserDto = UpdateUser['requestBody']['content']['application/json']
type ResetPasswordDto =
  ResetPassword['requestBody']['content']['application/json']
type ChangePasswordDto =
  ChangePassword['requestBody']['content']['application/json']

type AuthState = {
  user: userPayload | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hydrated: boolean
  login: (dto: loginDto) => Promise<userPayload>
  logout: () => void
  updateUser: (user: updateUserDto) => void
  verify: () => Promise<verifyDtoReturn>
  resetPassword: (dto: ResetPasswordDto) => Promise<void>
  changePassword: (dto: ChangePasswordDto) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hydrated: false,

      login: async (dto: loginDto) => {
        set({ isLoading: true, error: null })
        try {
          await apiFetch<void>(
            apiPaths.auth.login,
            {
              body: JSON.stringify(dto)
            },
            false,
            'POST'
          )

          const session = await apiFetch<verifyDtoReturn>(
            apiPaths.auth.verify,
            {},
            false,
            'POST'
          )

          if (!session.user) {
            throw new Error('Falha na hidratação da sessão')
          }

          set({
            user: session.user,
            isAuthenticated: true,
            isLoading: false
          })

          return session.user
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            isLoading: false,
            isAuthenticated: false,
            user: null
          })

          throw error
        }
      },

      logout: () => {
        void apiFetch<void>(apiPaths.auth.logout, {}, false, 'POST').catch(
          () => {
            return undefined
          }
        )

        set({
          user: null,
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
            user: null
          })
          return Promise.reject(err)
        }
      },
      resetPassword: async (dto: ResetPasswordDto) => {
        set({ isLoading: true, error: null })
        try {
          await apiFetch<void>(
            apiPaths.auth.resetPassword,
            {
              body: JSON.stringify(dto)
            },
            true,
            'POST'
          )
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            isLoading: false
          })
          return Promise.reject(error)
        }
      },
      changePassword: async (dto: ChangePasswordDto) => {
        set({ isLoading: true, error: null })
        try {
          await apiFetch<void>(
            apiPaths.auth.changePassword,
            {
              body: JSON.stringify(dto)
            },
            true,
            'POST'
          )
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            isLoading: false
          })
          return Promise.reject(error)
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
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.user) {
            state.isAuthenticated = true
            state.hydrated = true
          } else {
            state.isAuthenticated = false
            state.user = null
            state.hydrated = true
          }
        }
      }
    }
  )
)
