'use client'

import { useState } from 'react'
import { Ban, Plus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
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

type SalesPageProps = {
  role?: 'ADMIN' | 'RESELLER'
}

export function SalesPage({ role = 'ADMIN' }: SalesPageProps) {
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

  const { data: sales, isLoading } = useGetSales()

  const { mutate: updateSale } = useUpdateSale(queryClient)
  const { mutate: updateSaleStatus } = useUpdateSaleStatus(queryClient)
  const { mutate: markInstallmentPaid } =
    useUpdateMarkInstallmentPaid(queryClient)
  const { mutate: deleteSale } = useDeleteSale(queryClient)
  const { mutate: confirmSale } = useConfirmSale(queryClient)

  const phoneUtil = PhoneNumberUtil.getInstance()

  // Permissões baseadas no role
  const canCreate = role === 'ADMIN'
  const canEdit = role === 'ADMIN'
  const canDelete = role === 'ADMIN'

  if (!sales || isLoading) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Ban className="text-primary h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          Nenhuma venda encontrada!
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há vendas registradas no sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
        {canCreate && (
          <Button
            onClick={() =>
              router.push(
                `/${role === 'ADMIN' ? 'home' : 'my-space'}/sales/create`
              )
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Venda
          </Button>
        )}
      </div>
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
