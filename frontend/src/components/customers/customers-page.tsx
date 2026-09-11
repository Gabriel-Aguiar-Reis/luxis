'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import {
  useGetCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  CreateCustomerDto,
  UpdateCustomerDto
} from '@/hooks/use-customers'
import { CustomersTable } from '@/components/customers/customers-table'
import { CustomerDialog } from '@/components/customers/customer-edit-dialog'
import { GetAllCustomersResponse } from '@/hooks/use-customers'
import { PhoneNumberUtil } from 'google-libphonenumber'

export function CustomersPage() {
  const t = useTranslations('CustomersPage')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<
    GetAllCustomersResponse[0] | null
  >(null)

  const queryClient = useQueryClient()
  const phoneUtil = PhoneNumberUtil.getInstance()

  const { data: customers, isLoading, isError, refetch } = useGetCustomers()
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

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Button onClick={handleNewCustomer}>
          <Plus className="mr-2 h-4 w-4" />
          {t('newCustomer')}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-50 w-full" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !customers || customers.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
        <CustomersTable
          customers={customers}
          onEdit={handleEditCustomer}
          phoneUtil={phoneUtil}
        />
      )}

      <CustomerDialog
        customer={selectedCustomer}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  )
}
