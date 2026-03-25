import {
  useGetAllCategories as useGetAllCategoriesRaw,
  useCreateCategory as useCreateCategoryRaw
} from '@/api/categories/categories'
import type {
  Category,
  CreateCategoryDto as OrvalCreateCategoryDto
} from '@/api/model'
import { queryKeys } from '@/lib/query-keys'
import { QueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export type GetAllCategoriesResponse = Category[]
export type GetOneCategoryResponse = Category
export type CreateCategoryDto = OrvalCreateCategoryDto
export type CreateCategoryResponse = Category

export function useGetCategories() {
  const result = useGetAllCategoriesRaw({
    query: { queryKey: queryKeys.categories.all(), staleTime: 5 * 60 * 1000 }
  })
  return {
    ...result,
    data: (result.data as any)?.data as Category[] | undefined
  }
}

export function useCreateCategory(queryClient: QueryClient) {
  const t = useTranslations('HookFeedback.categories')

  const mutation = useCreateCategoryRaw({
    mutation: {
      onSuccess: () => {
        toast.success(t('createSuccess'))
        queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() })
      }
    }
  })

  return {
    ...mutation,
    mutate: (data: CreateCategoryDto) => mutation.mutate({ data }),
    mutateAsync: (data: CreateCategoryDto) => mutation.mutateAsync({ data })
  }
}
