import {
  useGetAllShipments as useGetAllShipmentsRaw,
  useUpdateShipment as useUpdateShipmentRaw,
  useDeleteShipment as useDeleteShipmentRaw,
  useCreateShipment as useCreateShipmentRaw,
  useUpdateShipmentStatus as useUpdateShipmentStatusRaw
} from '@/api/shipments/shipments'
import type {
  GetShipmentDto,
  UpdateShipmentDto as OrvalUpdateShipmentDto,
  UpdateStatusShipmentDto as OrvalUpdateShipmentStatusDto,
  CreateShipmentDto as OrvalCreateShipmentDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetAllShipmentsResponse = GetShipmentDto[]
export type GetOneShipmentResponse = GetShipmentDto
export type UpdateShipmentDto = OrvalUpdateShipmentDto
export type UpdateShipmentStatusDto = OrvalUpdateShipmentStatusDto
export type CreateShipmentDto = OrvalCreateShipmentDto
export type ShipmentStatus = GetShipmentDto['status']

export type UpdateShipmentResponse = GetShipmentDto
export type CreateShipmentResponse = GetShipmentDto

export function useGetShipments() {
  const result = useGetAllShipmentsRaw({
    query: { queryKey: queryKeys.shipments.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as GetShipmentDto[] | undefined
  }
}

export function useUpdateShipment(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.shipments')

  const mutation = useUpdateShipmentRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('updateSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.shipments.all()
        })
      },
      onError: (e: Error) => {
        toast.error(
          t('updateError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ dto, id }: { dto: UpdateShipmentDto; id: string }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ dto, id }: { dto: UpdateShipmentDto; id: string }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}

export function useDeleteShipment(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.shipments')

  const mutation = useDeleteShipmentRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('deleteSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.shipments.all()
        })
      },
      onError: (e: Error) => {
        toast.error(
          t('deleteError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: (id: string) => mutation.mutate({ id }),
    mutateAsync: (id: string) => mutation.mutateAsync({ id })
  }
}

export function useCreateShipment(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.shipments')

  const mutation = useCreateShipmentRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('createSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.shipments.all()
        })
      },
      onError: (e: Error) => {
        toast.error(
          t('createError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: (data: CreateShipmentDto) => mutation.mutate({ data }),
    mutateAsync: (data: CreateShipmentDto) => mutation.mutateAsync({ data })
  }
}

export function useUpdateShipmentStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.shipments')

  const mutation = useUpdateShipmentStatusRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('updateStatusSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.shipments.all()
        })
      },
      onError: (e: Error) => {
        toast.error(
          t('updateStatusError', { message: e.message || t('unexpectedError') })
        )
      }
    }
  })

  return {
    ...mutation,
    mutate: ({ id, dto }: { id: string; dto: UpdateShipmentStatusDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateShipmentStatusDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}
