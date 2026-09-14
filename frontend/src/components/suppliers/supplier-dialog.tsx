import { Button } from '@/components/ui/button'
import { DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { FieldDescription, FieldLabel } from '@/components/ui/field'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '@/components/ui/input-group'
import { fieldHints, onlyPhoneChars, phonePattern } from '@/lib/form-guidance'

const supplierSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().regex(phonePattern, 'Telefone inválido. Use DDD + número.')
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
    formState: { errors, isSubmitting }
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
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="name"
                    placeholder="Nome do Fornecedor"
                    aria-invalid={!!errors.name}
                    aria-describedby="supplier-edit-name-hint"
                    {...register('name')}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>2-80</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription
                  id="supplier-edit-name-hint"
                  className="text-xs"
                >
                  {fieldHints.name}
                </FieldDescription>
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>+55</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="phone"
                    placeholder="(12) 98123-4567"
                    type="tel"
                    inputMode="tel"
                    aria-invalid={!!errors.phone}
                    aria-describedby="supplier-edit-phone-hint"
                    {...register('phone', {
                      setValueAs: (value: string) => onlyPhoneChars(value)
                    })}
                  />
                </InputGroup>
                <FieldDescription
                  id="supplier-edit-phone-hint"
                  className="text-xs"
                >
                  {fieldHints.phone}
                </FieldDescription>
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
            <Button type="submit" loading={isSubmitting}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
