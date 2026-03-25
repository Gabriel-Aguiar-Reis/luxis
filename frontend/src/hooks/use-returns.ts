import {
  useGetAllReturns as useGetAllReturnsRaw,
  useCreateReturn as useCreateReturnRaw,
  useDeleteReturn as useDeleteReturnRaw,
  useUpdateReturn as useUpdateReturnRaw,
  useUpdateReturnStatus as useUpdateReturnStatusRaw
} from '@/api/returns/returns'
import type {
  GetAllReturnDto,
  GetOneReturnDto,
  CreateReturnDto as OrvalCreateReturnDto,
  UpdateReturnDto as OrvalUpdateReturnDto,
  UpdateReturnStatusDto as OrvalUpdateReturnStatusDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetAllReturnsResponse = GetAllReturnDto[]
export type GetOneReturnResponse = GetOneReturnDto
export type CreateReturnDto = OrvalCreateReturnDto
export type UpdateReturnDto = OrvalUpdateReturnDto
export type UpdateReturnStatusDto = OrvalUpdateReturnStatusDto

export function useGetReturns() {
  const result = useGetAllReturnsRaw({
    query: { queryKey: queryKeys.returns.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as GetAllReturnDto[] | undefined
  }
}

export function useCreateReturn(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.returns')

  const mutation = useCreateReturnRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('createSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.returns.all() })
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
    mutate: (data: CreateReturnDto) => mutation.mutate({ data }),
    mutateAsync: (data: CreateReturnDto) => mutation.mutateAsync({ data })
  }
}

export function useDeleteReturn(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.returns')

  const mutation = useDeleteReturnRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('deleteSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.returns.all() })
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

export function useUpdateReturn(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.returns')

  const mutation = useUpdateReturnRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.returns.all() })
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
    mutate: ({ id, dto }: { id: string; dto: UpdateReturnDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateReturnDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}

export function useUpdateReturnStatus(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.returns')

  const mutation = useUpdateReturnStatusRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('updateStatusSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.returns.all() })
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
    mutate: ({ id, dto }: { id: string; dto: UpdateReturnStatusDto }) =>
      mutation.mutate({ id, data: dto }),
    mutateAsync: ({ id, dto }: { id: string; dto: UpdateReturnStatusDto }) =>
      mutation.mutateAsync({ id, data: dto })
  }
}
