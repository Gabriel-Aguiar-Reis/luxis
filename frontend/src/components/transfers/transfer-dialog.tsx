import { Button } from '@/components/ui/button'
import { DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UpdateSupplierDto } from '@/hooks/use-suppliers'
import { OwnershipTransfer, Supplier } from '@/lib/api-types'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import React from 'react'
import { useForm } from 'react-hook-form'
import { UpdateTransferDto } from '@/hooks/use-transfers'

type TransferDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateTransferDto) => void | Promise<void>
  transfer: OwnershipTransfer | null
}
export function TransferDialog({
  isOpen,
  onClose,
  onSave,
  transfer
}: TransferDialogProps) {
  const { register, handleSubmit, reset, setValue } =
    useForm<UpdateTransferDto>({
      defaultValues: {
        productId: transfer?.productId || '',
        fromResellerId: transfer?.fromResellerId || '',
        toResellerId: transfer?.toResellerId || '',
        transferDate: transfer?.transferDate || ''
      }
    })

  // Atualiza valores do formulário ao abrir/alterar transfer
  React.useEffect(() => {
    if (transfer) {
      setValue('productId', transfer.productId || '')
      setValue('fromResellerId', transfer.fromResellerId || '')
      setValue('toResellerId', transfer.toResellerId || '')
      setValue('transferDate', transfer.transferDate || '')
    } else {
      reset({
        productId: '',
        fromResellerId: '',
        toResellerId: '',
        transferDate: ''
      })
    }
  }, [transfer, setValue, reset])

  const handleClose = () => {
    reset({
      productId: '',
      fromResellerId: '',
      toResellerId: '',
      transferDate: ''
    })
    onClose()
  }

  const onSubmit = (data: UpdateTransferDto) => {
    if (transfer) {
      onSave(transfer.id, data)
    }
    onClose()
    reset()
  }

  if (!transfer) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
            <DialogDescription>
              Edite os detalhes do fornecedor selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Nome do Produto"
                  {...register('productId')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="Telefone do Fornecedor"
                  type="tel"
                  inputMode="tel"
                  {...register('fromResellerId')}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
