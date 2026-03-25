import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import {
  GetAllUsers,
  GetUserProducts,
  PostUser,
  UpdateUserRole,
  UpdateUserStatus,
  UserRole,
  UserStatus
} from '@/lib/api-types'
import {
  useQueryClient,
  useMutation,
  useQuery,
  QueryClient
} from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type CreateUserDto =
  PostUser['requestBody']['content']['application/json']
export type CreateUserResponse =
  PostUser['responses']['201']['content']['application/json']
export type GetUsersResponse =
  GetAllUsers['responses']['200']['content']['application/json']
export type UpdateUserRoleResponse =
  UpdateUserRole['responses']['200']['content']['application/json']
export type UpdateUserStatusResponse =
  UpdateUserStatus['responses']['200']['content']['application/json']

export type GetUserProductsResponse =
  GetUserProducts['responses']['200']['content']['application/json']

export type UpdateUserRoleDto = {
  userId: string
  role: UserRole
  status?: UserStatus
}

export function useDeleteUser(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')

  return useMutation({
    mutationFn: async (userId: string) => {
      await apiFetch(
        apiPaths.users.byId(userId),
        {
          method: 'DELETE'
        },
        true
      )
    },
    onSuccess: () => {
      toast.success(t('deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
    onError: () => {
      toast.error(t('deleteError'))
    }
  })
}

export function useCreateUser(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')

  return useMutation({
    mutationFn: async (user: CreateUserDto) => {
      return await apiFetch<CreateUserResponse>(
        apiPaths.users.signup,
        {
          body: JSON.stringify(user)
        },
        false,
        'POST'
      )
    },
    onSuccess: (data) => {
      toast.success(t('createSuccess', { email: data.email.value }))
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
    onError: () => {
      toast.error(t('createError'))
    }
  })
}

export function useUpdateUserRole(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')
  const userRoles = {
    ADMIN: t('roles.ADMIN'),
    RESELLER: t('roles.RESELLER'),
    ASSISTANT: t('roles.ASSISTANT'),
    UNASSIGNED: t('roles.UNASSIGNED')
  }

  return useMutation({
    mutationFn: async ({ userId, role, status }: UpdateUserRoleDto) => {
      return await apiFetch<UpdateUserRoleResponse>(
        apiPaths.users.role(userId),
        {
          body: JSON.stringify({ role, status })
        },
        true,
        'PATCH'
      )
    },
    onSuccess: (data) => {
      toast.success(
        t('updateRoleSuccess', {
          name: data.name.value,
          surname: data.surname.value,
          role: userRoles[data.role]
        })
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.pending() })
    },
    onError: () => {
      toast.error(t('updateRoleError'))
    }
  })
}

export function useUpdateUserStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')

  return useMutation({
    mutationFn: async ({
      userId,
      status
    }: {
      userId: string
      status: UserStatus
    }) => {
      return await apiFetch<UpdateUserStatusResponse>(
        apiPaths.users.status(userId),
        {
          body: JSON.stringify({ status })
        },
        true,
        'PATCH'
      )
    },
    onSuccess: (data) => {
      toast.success(
        t('updateStatusSuccess', { id: data.id, status: data.status })
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.pending() })
    },
    onError: () => {
      toast.error(t('updateStatusError'))
    }
  })
}

export function useGetUsers() {
  return useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: async () => {
      return await apiFetch<GetUsersResponse>(apiPaths.users.base, {}, true)
    },
    staleTime: 2 * 60 * 1000
  })
}

export function useGetPendingUsers() {
  return useQuery({
    queryKey: queryKeys.users.pending(),
    queryFn: async () => {
      return await apiFetch<GetUsersResponse>(apiPaths.users.pending, {}, true)
    },
    staleTime: 2 * 60 * 1000
  })
}

export function useGetUserProducts(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.products(userId),
    queryFn: async () => {
      return await apiFetch<GetUserProductsResponse>(
        apiPaths.users.products(userId),
        {},
        true
      )
    },
    enabled: !!userId,
    staleTime: 60 * 1000
  })
}
