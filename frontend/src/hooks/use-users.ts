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

const userRoles = {
  ADMIN: 'Administrador',
  RESELLER: 'Revendedor',
  ASSISTANT: 'Assistente',
  UNASSIGNED: 'Não Atribuído'
}

export function useDeleteUser(queryClient: QueryClient) {
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
      toast.success(`Usuário excluído com sucesso`)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Erro ao excluir usuário')
    }
  })
}

export function useCreateUser(queryClient: QueryClient) {
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
      toast.success(`Usuário ${data.email.value} criado com sucesso`)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Erro ao criar usuário')
    }
  })
}

export function useUpdateUserRole(queryClient: QueryClient) {
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
        `Papel do usuário ${data.name.value} ${data.surname.value} atualizado para ${userRoles[data.role]}`
      )
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Erro ao atualizar o papel do usuário')
    }
  })
}

export function useUpdateUserStatus(queryClient: QueryClient) {
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
        `Status do usuário ${data.id} atualizado para ${data.status}`
      )
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Erro ao atualizar o status do usuário')
    }
  })
}

export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await apiFetch<GetUsersResponse>(apiPaths.users.base, {}, true)
    },
    staleTime: 2 * 60 * 1000
  })
}

export function useGetUserProducts(userId: string) {
  return useQuery({
    queryKey: ['user-products', userId],
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
