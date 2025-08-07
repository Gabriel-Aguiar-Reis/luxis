import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import {
  DeleteSupplier,
  GetAllSuppliers,
  PostSupplier,
  UpdateSupplier
} from '@/lib/api-types'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

type GetAllSuppliersResponse =
  GetAllSuppliers['responses']['200']['content']['application/json']

export type UpdateSupplierDto =
  UpdateSupplier['requestBody']['content']['application/json']

export type CreateSupplierDto =
  PostSupplier['requestBody']['content']['application/json']

export type UpdateSupplierResponse =
  UpdateSupplier['responses']['200']['content']['application/json']

export type CreateSupplierResponse =
  PostSupplier['responses']['201']['content']['application/json']

export type DeleteSupplierResponse =
  DeleteSupplier['responses']['204']['content']

export function useGetSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      return await apiFetch<GetAllSuppliersResponse>(
        apiPaths.suppliers.base,
        {},
        true
      )
    },
    staleTime: 5 * 60 * 1000
  })
}

export function useUpdateSupplier(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async ({ dto, id }: { dto: UpdateSupplierDto; id: string }) => {
      return await apiFetch<UpdateSupplierResponse>(
        apiPaths.suppliers.byId(id),
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

export function useDeleteSupplier(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch<DeleteSupplierResponse>(
        apiPaths.suppliers.byId(id),
        {},
        true,
        'DELETE'
      )
    },
    onSuccess: async () => {
      toast.success('Fornecedor excluído com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
    onError: (error) => {
      toast.error(`Erro ao excluir fornecedor: ${error.message}`)
    }
  })
}

export function useCreateSupplier(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (dto: UpdateSupplierDto) => {
      return await apiFetch<CreateSupplierResponse>(
        apiPaths.suppliers.base,
        {
          body: JSON.stringify(dto)
        },
        true,
        'POST'
      )
    },
    onSuccess: async () => {
      toast.success('Fornecedor criado com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
    onError: (error) => {
      toast.error(`Erro ao criar fornecedor: ${error.message}`)
    }
  })
}
