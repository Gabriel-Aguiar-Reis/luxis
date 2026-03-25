import {
  useGetAllSuppliers as useGetAllSuppliersRaw,
  useUpdateSupplier as useUpdateSupplierRaw,
  useDeleteSupplier as useDeleteSupplierRaw,
  useCreateSupplier as useCreateSupplierRaw
} from '@/api/suppliers/suppliers'
import type {
  Supplier,
  UpdateSupplierDto as OrvalUpdateSupplierDto,
  CreateSupplierDto as OrvalCreateSupplierDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type UpdateSupplierDto = OrvalUpdateSupplierDto
export type CreateSupplierDto = OrvalCreateSupplierDto
export type UpdateSupplierResponse = Supplier
export type CreateSupplierResponse = Supplier
export type DeleteSupplierResponse = void

export function useGetSuppliers() {
  const result = useGetAllSuppliersRaw({
    query: { queryKey: queryKeys.suppliers.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as Supplier[] | undefined
  }
}

export function useUpdateSupplier(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.suppliers')

  const mutation = useUpdateSupplierRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('updateSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.suppliers.all()
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
    mutate: ({ dto, id }: { dto: UpdateSupplierDto; id: string }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ dto, id }: { dto: UpdateSupplierDto; id: string }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}

export function useDeleteSupplier(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.suppliers')

  const mutation = useDeleteSupplierRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('deleteSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.suppliers.all()
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

export function useCreateSupplier(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.suppliers')

  const mutation = useCreateSupplierRaw({
    mutation: {
      onSuccess: async () => {
        toast.success(t('createSuccess'))
        await queryClient.invalidateQueries({
          queryKey: queryKeys.suppliers.all()
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
    mutate: (data: CreateSupplierDto) => mutation.mutate({ data }),
    mutateAsync: (data: CreateSupplierDto) => mutation.mutateAsync({ data })
  }
}
