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
import { queryKeys } from '@/lib/query-keys'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
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
    queryKey: queryKeys.shipments.all(),
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
  const t = useTranslations('HookFeedback.shipments')

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
      toast.success(t('updateSuccess'))
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shipments.all()
      })
    },
    onError: (error) => {
      toast.error(
        t('updateError', { message: error.message || t('unexpectedError') })
      )
    }
  })
}

export function useDeleteShipment(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.shipments')

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(apiPaths.shipments.byId(id), {}, true, 'DELETE')
    },
    onSuccess: async () => {
      toast.success(t('deleteSuccess'))
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shipments.all()
      })
    },
    onError: (error) => {
      toast.error(
        t('deleteError', { message: error.message || t('unexpectedError') })
      )
    }
  })
}

export function useCreateShipment(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.shipments')

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
      toast.success(t('createSuccess'))
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shipments.all()
      })
    },
    onError: (error) => {
      toast.error(
        t('createError', { message: error.message || t('unexpectedError') })
      )
    }
  })
}

export function useUpdateShipmentStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.shipments')

  return useMutation({
    mutationFn: async ({
      id,
      dto
    }: {
      id: string
      dto: UpdateShipmentStatusDto
    }) => {
      console.log(
        'apiPaths.shipments.status(id): ',
        apiPaths.shipments.status(id)
      )
      return await apiFetch<UpdateShipmentResponse>(
        `${apiPaths.shipments.status(id)}`,
        {
          body: JSON.stringify(dto)
        },
        true,
        'PATCH'
      )
    },
    onSuccess: async () => {
      toast.success(t('updateStatusSuccess'))
      await queryClient.invalidateQueries({
        queryKey: queryKeys.shipments.all()
      })
    },
    onError: (error) => {
      toast.error(
        t('updateStatusError', {
          message: error.message || t('unexpectedError')
        })
      )
    }
  })
}
