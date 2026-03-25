import {
  useGetAllUsers as useGetAllUsersRaw,
  useGetAllPendingUsers as useGetAllPendingUsersRaw,
  useGetUserProducts as useGetUserProductsRaw,
  useCreateUser as useCreateUserRaw,
  useDeleteUser as useDeleteUserRaw,
  useUpdateUserRole as useUpdateUserRoleRaw,
  useUpdateUserStatus as useUpdateUserStatusRaw
} from '@/api/users/users'
import type {
  User,
  UserProductDto,
  CreateUserDto as OrvalCreateUserDto,
  UpdateUserRoleDto as OrvalUpdateUserRoleDto,
  UpdateUserStatusDto as OrvalUpdateUserStatusDto,
  Role,
  UserStatus
} from '@/api/model'
import { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type CreateUserDto = OrvalCreateUserDto
export type CreateUserResponse = User
export type GetUsersResponse = User[]
export type UpdateUserRoleResponse = User
export type UpdateUserStatusResponse = User
export type GetUserProductsResponse = UserProductDto[]

export type UpdateUserRoleDto = {
  userId: string
  role: Role
  status?: UserStatus
}

export function useDeleteUser(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')

  const mutation = useDeleteUserRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('deleteSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      },
      onError: () => {
        toast.error(t('deleteError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: (userId: string) => mutation.mutate({ id: userId }),
    mutateAsync: (userId: string) => mutation.mutateAsync({ id: userId })
  }
}

export function useCreateUser(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')

  const mutation = useCreateUserRaw({
    mutation: {
      onSuccess: (response) => {
        toast.success(
          t('createSuccess', { email: (response as any)?.data?.email?.value })
        )
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      },
      onError: () => {
        toast.error(t('createError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: (
      data: CreateUserDto,
      options?: { onSuccess?: () => void; onError?: () => void }
    ) => mutation.mutate({ data }, options as any),
    mutateAsync: (data: CreateUserDto) => mutation.mutateAsync({ data })
  }
}

export function useUpdateUserRole(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')
  const userRoles = {
    ADMIN: t('roles.ADMIN'),
    RESELLER: t('roles.RESELLER'),
    ASSISTANT: t('roles.ASSISTANT'),
    UNASSIGNED: t('roles.UNASSIGNED')
  }

  const mutation = useUpdateUserRoleRaw({
    mutation: {
      onSuccess: (response) => {
        const data = (response as any)?.data
        toast.success(
          t('updateRoleSuccess', {
            name: data?.name?.value,
            surname: data?.surname?.value,
            role: userRoles[data?.role as keyof typeof userRoles]
          })
        )
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.pending() })
      },
      onError: () => {
        toast.error(t('updateRoleError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ userId, role, status }: UpdateUserRoleDto) =>
      mutation.mutate({ id: userId, data: { role, status } }),
    mutateAsync: ({ userId, role, status }: UpdateUserRoleDto) =>
      mutation.mutateAsync({ id: userId, data: { role, status } })
  }
}

export function useUpdateUserStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.users')

  const mutation = useUpdateUserStatusRaw({
    mutation: {
      onSuccess: (response) => {
        const data = (response as any)?.data
        toast.success(
          t('updateStatusSuccess', { id: data?.id, status: data?.status })
        )
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
        queryClient.invalidateQueries({ queryKey: queryKeys.users.pending() })
      },
      onError: () => {
        toast.error(t('updateStatusError'))
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ userId, status }: { userId: string; status: UserStatus }) =>
      mutation.mutate({ id: userId, data: { status } }),
    mutateAsync: ({ userId, status }: { userId: string; status: UserStatus }) =>
      mutation.mutateAsync({ id: userId, data: { status } })
  }
}

export function useGetUsers() {
  const result = useGetAllUsersRaw({
    query: { queryKey: queryKeys.users.all(), staleTime: 2 * 60 * 1000 }
  })
  return { ...result, data: (result.data as any)?.data as User[] | undefined }
}

export function useGetPendingUsers() {
  const result = useGetAllPendingUsersRaw({
    query: { queryKey: queryKeys.users.pending(), staleTime: 2 * 60 * 1000 }
  })
  return { ...result, data: (result.data as any)?.data as User[] | undefined }
}

export function useGetUserProducts(userId: string) {
  const result = useGetUserProductsRaw(userId, {
    query: {
      queryKey: queryKeys.users.products(userId),
      enabled: !!userId,
      staleTime: 60 * 1000
    }
  })
  return {
    ...result,
    data: (result.data as any)?.data as UserProductDto[] | undefined
  }
}
