import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import {
  GetAllShipments,
  GetOneShipment,
  PostShipment,
  Shipment,
  UpdateShipment,
  UpdateShipmentStatus
} from '@/lib/api-types'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export type GetAllShipmentsResponse =
  GetAllShipments['responses']['200']['content']['application/json']

export type GetOneShipmentResponse =
  GetOneShipment['responses']['200']['content']['application/json']

export type UpdateShipmentResponse =
  UpdateShipment['responses']['200']['content']['application/json']

export type UpdateShipmentDto =
  UpdateShipment['requestBody']['content']['application/json']

export type UpdateShipmentStatusDto =
  UpdateShipmentStatus['requestBody']['content']['application/json']

export type ShipmentStatus = Shipment['status']

export function useGetShipments() {
  return useQuery<GetAllShipmentsResponse>({
    queryKey: ['shipments'],
    queryFn: async () => {
      return await apiFetch(apiPaths.shipments.base, {}, true)
    },
    staleTime: 5 * 60 * 1000
  })
}

export type CreateShipmentDto =
  PostShipment['requestBody']['content']['application/json']

export type CreateShipmentResponse =
  PostShipment['responses']['201']['content']['application/json']

export function useUpdateShipment(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({ dto, id }: { dto: UpdateShipmentDto; id: string }) => {
      return await apiFetch<UpdateShipmentResponse>(
        apiPaths.shipments.byId(id),
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: async () => {
      toast.success('Fornecedor atualizado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar fornecedor: ${error.message}`)
    }
  })
}

export function useDeleteShipment(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(apiPaths.shipments.byId(id), {}, true, 'DELETE')
    },
    onSuccess: async () => {
      toast.success('Remessa deletada com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
    onError: (error) => {
      toast.error(`Erro ao deletar remessa: ${error.message}`)
    }
  })
}

export function useCreateShipment(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (dto: CreateShipmentDto) => {
      return await apiFetch<CreateShipmentResponse>(
        apiPaths.shipments.base,
        {
          body: JSON.stringify(dto)
        },
        true,
        'POST'
      )
    },
    onSuccess: async () => {
      toast.success('Remessa criada com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
    onError: (error) => {
      toast.error(`Erro ao criar remessa: ${error.message}`)
    }
  })
}

export function useUpdateShipmentStatus(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({
      id,
      dto
    }: {
      id: string
      dto: UpdateShipmentStatusDto
    }) => {
      return await apiFetch<UpdateShipmentResponse>(
        apiPaths.shipments.byId(id),
        {
          body: JSON.stringify({ status: dto })
        },
        true,
        'PATCH'
      )
    },
    onSuccess: async () => {
      toast.success('Status da remessa atualizado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar status da remessa: ${error.message}`)
    }
  })
}
