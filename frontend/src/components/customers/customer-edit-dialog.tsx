'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '@/components/ui/input-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  GetAllCustomersResponse,
  CreateCustomerDto,
  UpdateCustomerDto
} from '@/hooks/use-customers'
import { fieldHints, onlyPhoneChars, phonePattern } from '@/lib/form-guidance'

type CustomerDialogProps = {
  customer: GetAllCustomersResponse[0] | null
  isOpen: boolean
  onClose: () => void
  onSave: (
    id: string | null,
    dto: CreateCustomerDto | UpdateCustomerDto
  ) => void
}

// Schema de validação baseado na estrutura real da API
const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().regex(phonePattern, 'Telefone inválido. Use DDD + número.')
})

export function CustomerDialog({
  customer,
  isOpen,
  onClose,
  onSave
}: CustomerDialogProps) {
  const isEditing = !!customer

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: customer?.name.value || '',
      phone: customer?.phone.value || ''
    }
  })

  // Atualizar formulário quando o cliente mudar
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name.value,
        phone: customer.phone.value
      })
    } else {
      form.reset({
        name: '',
        phone: ''
      })
    }
  }, [customer, form])

  // Manipular envio do formulário
  const onSubmit = async (data: z.infer<typeof customerSchema>) => {
    onSave(customer?.id || null, data)
    form.reset()
    onClose()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações do cliente'
              : 'Preencha os dados do novo cliente'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        placeholder="Nome completo do cliente"
                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>2-80</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormDescription>{fieldHints.name}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>+55</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="tel"
                        inputMode="tel"
                        placeholder="(11) 98765-4321"
                        {...field}
                        onChange={(e) => {
                          field.onChange(onlyPhoneChars(e.target.value))
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormDescription>{fieldHints.phone}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar Alterações'
                    : 'Criar Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
