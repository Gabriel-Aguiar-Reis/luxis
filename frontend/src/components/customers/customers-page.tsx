'use client'

import { useState } from 'react'
import { Ban, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  useGetCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  CreateCustomerDto,
  UpdateCustomerDto
} from '@/hooks/use-customers'
import { CustomersTable } from '@/components/customers/customers-table'
import { CustomerDialog } from '@/components/customers/customer-edit-dialog'
import type { GetAllCustomersResponse } from '@/hooks/use-customers'

export function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<
    GetAllCustomersResponse[0] | null
  >(null)

  const queryClient = useQueryClient()

  const { data: customers, isLoading } = useGetCustomers()
  const { mutate: createCustomer } = useCreateCustomer(queryClient)
  const { mutate: updateCustomer } = useUpdateCustomer(queryClient)

  const handleNewCustomer = () => {
    setSelectedCustomer(null)
    setIsDialogOpen(true)
  }

  const handleEditCustomer = (customer: GetAllCustomersResponse[0]) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleSaveCustomer = (
    id: string | null,
    dto: CreateCustomerDto | UpdateCustomerDto
  ) => {
    if (id) {
      updateCustomer({ id, dto: dto as UpdateCustomerDto })
    } else {
      createCustomer(dto as CreateCustomerDto)
    }
  }

  if (!customers || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          Nenhum cliente encontrado!
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há clientes registrados no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <Button onClick={handleNewCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <CustomersTable customers={customers} onEdit={handleEditCustomer} />

      <CustomerDialog
        customer={selectedCustomer}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  )
}
