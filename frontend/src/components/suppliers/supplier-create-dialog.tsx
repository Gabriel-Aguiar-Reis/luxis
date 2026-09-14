import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { CreateSupplierDto } from '@/hooks/use-suppliers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FieldDescription, FieldLabel } from '@/components/ui/field'
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

export function SupplierCreateDialog({
  isOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (dto: CreateSupplierDto) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { name: '', phone: '' }
  })

  const onSubmit = (data: SupplierFormValues) => {
    const dto: CreateSupplierDto = data
    onCreate(dto)
    onClose()
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Criar Fornecedor</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo fornecedor.
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
                    aria-describedby="supplier-name-hint"
                    {...register('name')}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>2-80</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription id="supplier-name-hint" className="text-xs">
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
                    aria-describedby="supplier-phone-hint"
                    {...register('phone', {
                      setValueAs: (value: string) => onlyPhoneChars(value)
                    })}
                  />
                </InputGroup>
                <FieldDescription id="supplier-phone-hint" className="text-xs">
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
              Criar Fornecedor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
