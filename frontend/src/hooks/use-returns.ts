import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import {
  DeleteReturn,
  GetAllReturns,
  GetOneReturn,
  PostReturn,
  UpdateReturn,
  UpdateReturnStatus,
  UpdateReturnStatusDto
} from '@/lib/api-types'
import { apiPaths } from '@/lib/api-paths'
import { toast } from 'sonner'
import { components } from '@/types/openapi'

export type GetAllReturnsResponse =
  GetAllReturns['responses']['200']['content']['application/json']

export type GetOneReturnResponse =
  GetOneReturn['responses']['200']['content']['application/json']

export type CreateReturnDto = components['schemas']['CreateReturnDto']

type CreateReturnResponse =
  PostReturn['responses']['201']['content']['application/json']

type DeleteReturnResponse = DeleteReturn['responses']['204']['content']

export type UpdateReturnDto =
  UpdateReturn['requestBody']['content']['application/json']

type UpdateReturnResponse =
  UpdateReturn['responses']['200']['content']['application/json']

export type UpdateReturnStatusResponse =
  UpdateReturnStatus['responses']['200']['content']

export function useGetReturns() {
  return useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      return await apiFetch<GetAllReturnsResponse>(
        apiPaths.returns.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateReturn(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (newReturn: CreateReturnDto) => {
      return await apiFetch<CreateReturnResponse>(
        apiPaths.returns.base,
        {
          body: JSON.stringify(newReturn)
        },
        true,
        'POST'
      )
    },
    onSuccess: () => {
      toast.success('Devolução criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['returns'] })
    },
    onError: (error) => {
      toast.error(`Falha ao criar devolução: ${error.message}`)
    }
  })
}

export function useDeleteReturn(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (returnId: string) => {
      return await apiFetch<DeleteReturnResponse>(
        `${apiPaths.returns.base}/${returnId}`,
        {},
        true,
        'DELETE'
      )
    },
    onSuccess: () => {
      toast.success('Devolução excluída com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['returns'] })
    },
    onError: (error) => {
      toast.error(`Falha ao excluir devolução: ${error.message}`)
    }
  })
}

export function useUpdateReturn(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateReturnDto }) => {
      return await apiFetch<UpdateReturnResponse>(
        `${apiPaths.returns.byId(id)}`,
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success('Devolução atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['returns'] })
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar devolução: ${error.message}`)
    }
  })
}

export function useUpdateReturnStatus(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({
      id,
      dto
    }: {
      id: string
      dto: UpdateReturnStatusDto
    }) => {
      return await apiFetch<UpdateReturnStatusResponse>(
        `${apiPaths.returns.status(id)}`,
        {
          body: JSON.stringify({ status: dto })
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success('Devolução atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['returns'] })
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar devolução: ${error.message}`)
    }
  })
}
