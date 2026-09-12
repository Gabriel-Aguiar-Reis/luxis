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
  GetOneSaleResponse,
  useConfirmSale,
  useDeleteSale,
  useGetSales,
  useUpdateMarkInstallmentPaid,
  useUpdateSale,
  useUpdateSaleStatus
} from '@/hooks/use-sales'
import { useRouter } from '@/lib/i18n/navigation'
import { SalesTable } from '@/components/sales/sales-table'
import { PhoneNumberUtil } from 'google-libphonenumber'
import { SaleDeleteDialog } from '@/components/sales/sale-delete-dialog'
import { SaleEditStatusDialog } from '@/components/sales/sale-edit-status-dialog'
import { SaleMarkInstallmentPaidDialog } from '@/components/sales/sale-mark-installment-paid-dialog'
import { SaleDialog } from '@/components/sales/sale-dialog'
import { SaleConfirmDialog } from '@/components/sales/sale-confirm-dialog'
import { BusinessRulesHelp } from '@/components/business-rules/business-rules-help'

type SalesPageProps = {
  role?: 'ADMIN' | 'RESELLER'
}

export function SalesPage({ role = 'ADMIN' }: SalesPageProps) {
  const t = useTranslations('SalesPage')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [isMarkInstallmentPaidDialogOpen, setIsMarkInstallmentPaidDialogOpen] =
    useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<GetOneSaleResponse | null>(
    null
  )

  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: sales, isLoading, isError, refetch } = useGetSales()

  const { mutate: updateSale } = useUpdateSale(queryClient)
  const { mutate: updateSaleStatus } = useUpdateSaleStatus(queryClient)
  const { mutate: markInstallmentPaid } =
    useUpdateMarkInstallmentPaid(queryClient)
  const { mutate: deleteSale } = useDeleteSale(queryClient)
  const { mutate: confirmSale } = useConfirmSale(queryClient)

  const phoneUtil = PhoneNumberUtil.getInstance()

  // Permissões baseadas no role
  const canEdit = role === 'ADMIN'
  const canDelete = true

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>

        <div className="flex items-center gap-2">
          <BusinessRulesHelp topic="sales" />
          <Button
            onClick={() =>
              router.push(
                `/${role === 'ADMIN' ? 'home' : 'my-space'}/sales/create`
              )
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('newSale')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-50 w-full" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !sales || sales.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
        />
      ) : (
        <SalesTable
          sales={sales}
          phoneUtil={phoneUtil}
          onEdit={
            canEdit
              ? (sale) => {
                  setSelectedSale(sale)
                  setIsDialogOpen(true)
                }
              : undefined
          }
          onEditStatus={
            canEdit
              ? (sale) => {
                  setSelectedSale(sale)
                  setIsEditStatusDialogOpen(true)
                }
              : undefined
          }
          onDelete={
            canDelete
              ? (sale) => {
                  setSelectedSale(sale)
                  setIsDeleteDialogOpen(true)
                }
              : undefined
          }
          onMarkInstallmentPaid={(sale) => {
            setSelectedSale(sale)
            setIsMarkInstallmentPaidDialogOpen(true)
          }}
          onConfirm={(sale) => {
            setSelectedSale(sale)
            setIsConfirmDialogOpen(true)
          }}
        />
      )}

      <SaleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={(id, dto) => {
          updateSale({ id, dto })
        }}
        sale={selectedSale}
      />

      <SaleMarkInstallmentPaidDialog
        isOpen={isMarkInstallmentPaidDialogOpen}
        onClose={() => setIsMarkInstallmentPaidDialogOpen(false)}
        onSave={(id, dto) => {
          markInstallmentPaid({ id, dto })
        }}
        sale={selectedSale}
      />

      <SaleEditStatusDialog
        isOpen={isEditStatusDialogOpen}
        onClose={() => setIsEditStatusDialogOpen(false)}
        onSave={(id, dto) => {
          updateSaleStatus({ id, dto })
        }}
        sale={selectedSale}
      />

      <SaleDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={(id) => {
          deleteSale(id)
        }}
        sale={selectedSale}
      />

      <SaleConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={(id) => {
          confirmSale(id)
        }}
        sale={selectedSale}
      />
    </div>
  )
}
