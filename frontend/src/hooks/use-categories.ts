import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { GetAllCategories, GetOneCategory, PostCategory } from '@/lib/api-types'
import { toast } from 'sonner'

export type GetAllCategoriesResponse =
  GetAllCategories['responses']['200']['content']['application/json']

export type GetOneCategoryResponse =
  GetOneCategory['responses']['200']['content']['application/json']

export type CreateCategoryDto =
  PostCategory['requestBody']['content']['application/json']
export type CreateCategoryResponse =
  PostCategory['responses']['201']['content']['application/json']

export function useGetCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await apiFetch<GetAllCategoriesResponse>(
        apiPaths.categories.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useCreateCategory(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (data: CreateCategoryDto) => {
      const res = await apiFetch<CreateCategoryResponse>(
        apiPaths.categories.base,
        {
          body: JSON.stringify(data)
        },
        true,
        'POST'
      )
      return res
    },
    onSuccess: () => {
      toast.success('Categoria criada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })
}
