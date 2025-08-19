import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import {
  DeleteOwnershipTransfer,
  GetAllOwnershipTransfers,
  PostOwnershipTransfer,
  UpdateOwnershipTransfer,
  UpdateOwnershipTransferStatus,
  UpdateOwnershipTransferStatusDto
} from '@/lib/api-types'
import { apiPaths } from '@/lib/api-paths'
import { toast } from 'sonner'
import { components } from '@/types/openapi'

type GetAllTransfersResponse =
  GetAllOwnershipTransfers['responses']['200']['content']['application/json']

export type CreateTransferDto =
  components['schemas']['CreateOwnershipTransferDto']

type CreateTransferResponse =
  PostOwnershipTransfer['responses']['201']['content']['application/json']

type DeleteTransferResponse =
  DeleteOwnershipTransfer['responses']['204']['content']

export type UpdateTransferDto =
  UpdateOwnershipTransfer['requestBody']['content']['application/json']

type UpdateTransferResponse =
  UpdateOwnershipTransfer['responses']['200']['content']['application/json']

export type UpdateTransferStatusDto = UpdateOwnershipTransferStatusDto

export type UpdateTransferStatusResponse =
  UpdateOwnershipTransferStatus['responses']['200']['content']

export function useGetTransfers() {
  return useQuery({
    queryKey: ['transfers'],
    queryFn: async () => {
      return await apiFetch<GetAllTransfersResponse>(
        apiPaths.ownershipTransfers.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateTransfer(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (newTransfer: CreateTransferDto) => {
      return await apiFetch<CreateTransferResponse>(
        apiPaths.ownershipTransfers.base,
        {
          body: JSON.stringify(newTransfer)
        },
        true,
        'POST'
      )
    },
    onSuccess: () => {
      toast.success('Transferência criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
    },
    onError: (error) => {
      toast.error(`Falha ao criar transferência: ${error.message}`)
    }
  })
}

export function useDeleteTransfer(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (transferId: string) => {
      return await apiFetch<DeleteTransferResponse>(
        `${apiPaths.ownershipTransfers.base}/${transferId}`,
        {},
        true,
        'DELETE'
      )
    },
    onSuccess: () => {
      toast.success('Transferência excluída com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
    },
    onError: (error) => {
      toast.error(`Falha ao excluir transferência: ${error.message}`)
    }
  })
}

export function useUpdateTransfer(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateTransferDto }) => {
      return await apiFetch<UpdateTransferResponse>(
        `${apiPaths.ownershipTransfers.byId(id)}`,
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success('Transferência atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar transferência: ${error.message}`)
    }
  })
}

export function useUpdateTransferStatus(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({
      id,
      dto
    }: {
      id: string
      dto: UpdateOwnershipTransferStatusDto
    }) => {
      return await apiFetch<UpdateTransferStatusResponse>(
        `${apiPaths.ownershipTransfers.status(id)}`,
        {
          body: JSON.stringify({ status: dto })
        },
        true,
        'PATCH'
      )
    },
    onSuccess: () => {
      toast.success('Transferência atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar transferência: ${error.message}`)
    }
  })
}
