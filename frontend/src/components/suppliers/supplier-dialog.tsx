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
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const supplierSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório'),
  phone: z.string().trim().min(10, 'Telefone obrigatório')
})

type SupplierFormValues = z.infer<typeof supplierSchema>

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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
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

  const onSubmit = (data: SupplierFormValues) => {
    const dto: UpdateSupplierDto = data
    if (supplier) {
      onSave(supplier.id, dto)
    }
    onClose()
    reset()
  }

  if (!supplier) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150">
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
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="Telefone do Fornecedor"
                  type="tel"
                  inputMode="tel"
                  aria-invalid={!!errors.phone}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-destructive text-sm">
                    {errors.phone.message}
                  </p>
                )}
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
