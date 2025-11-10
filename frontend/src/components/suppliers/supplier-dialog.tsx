import { Button } from '@/components/ui/button'
import { DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UpdateSupplierDto } from '@/hooks/use-suppliers'
import { Supplier } from '@/lib/api-types'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import React from 'react'
import { useForm } from 'react-hook-form'

type SupplierDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateSupplierDto) => void | Promise<void>
  supplier: Supplier | null
}
export function SupplierDialog({
  isOpen,
  onClose,
  onSave,
  supplier
}: SupplierDialogProps) {
  const { register, handleSubmit, reset, setValue } =
    useForm<UpdateSupplierDto>({
      defaultValues: {
        name: supplier?.name.value || '',
        phone: supplier?.phone.value || ''
      }
    })

  // Atualiza valores do formulário ao abrir/alterar supplier
  React.useEffect(() => {
    if (supplier) {
      setValue('name', supplier.name.value || '')
      setValue('phone', supplier.phone.value || '')
    } else {
      reset({ name: '', phone: '' })
    }
  }, [supplier, setValue, reset])

  const handleClose = () => {
    reset({
      name: supplier?.name.value || '',
      phone: supplier?.phone.value || ''
    })
    onClose()
  }

  const onSubmit = (data: UpdateSupplierDto) => {
    if (supplier) {
      onSave(supplier.id, data)
    }
    onClose()
    reset()
  }

  if (!supplier) {
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
                  placeholder="Nome do Fornecedor"
                  {...register('name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="Telefone do Fornecedor"
                  type="tel"
                  inputMode="tel"
                  {...register('phone')}
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
