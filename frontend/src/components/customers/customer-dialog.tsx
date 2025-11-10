'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import { ApiError, apiFetch } from '@/lib/api-client'

// Tipos para clientes
type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  totalPurchases: number
  lastPurchaseDate: string | null
  createdAt: string
  status: 'ACTIVE' | 'INACTIVE'
}

type CustomerDialogProps = {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onSave: (customer: Customer) => void
}

// Schema de validação
const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  postalCode: z
    .string()
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 00000-000'),
  status: z.enum(['ACTIVE', 'INACTIVE'])
})

export function CustomerDialog({
  customer,
  isOpen,
  onClose,
  onSave
}: CustomerDialogProps) {
  const isEditing = !!customer
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Lista de estados brasileiros
  const states = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO'
  ]

  // Inicializar formulário
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      id: customer?.id || '',
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      postalCode: customer?.postalCode || '',
      status: customer?.status || 'ACTIVE'
    }
  })

  // Atualizar formulário quando o cliente mudar
  useEffect(() => {
    if (customer) {
      form.reset({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postalCode,
        status: customer.status
      })
    } else {
      form.reset({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        status: 'ACTIVE'
      })
    }
  }, [customer, form])

  // Formatar telefone enquanto digita
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // Remover não-dígitos

    if (value.length > 11) {
      value = value.slice(0, 11)
    }

    form.setValue('phone', value)
  }

  // Formatar CEP enquanto digita
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // Remover não-dígitos

    if (value.length > 8) {
      value = value.slice(0, 8)
    }

    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5)
    }

    form.setValue('postalCode', value)
  }

  // Manipular envio do formulário
  const onSubmit = async (data: z.infer<typeof customerSchema>) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      // Exemplo: salvar cliente via API
      const savedCustomer = await apiFetch<Customer>(
        customer
          ? `http://localhost:3000/customers/${customer.id}`
          : 'http://localhost:3000/customers',
        {
          method: customer ? 'PATCH' : 'POST',
          body: JSON.stringify(data)
        },
        true
      )
      onSave(savedCustomer)
    } catch (error) {
      let msg = 'Erro ao salvar cliente'
      if (error instanceof ApiError && error.data?.message) {
        msg = error.data.message
      } else if (error instanceof Error && error.message) {
        msg = error.message
      }
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações do cliente abaixo.'
              : 'Preencha as informações para adicionar um novo cliente.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={field.value}
                          onChange={(e) => handlePhoneChange(e)}
                        />
                      </FormControl>
                      <FormDescription>
                        Apenas números, sem espaços ou caracteres especiais
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Ativo</SelectItem>
                          <SelectItem value="INACTIVE">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rua, número, complemento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00000-000"
                          value={field.value}
                          onChange={(e) => handlePostalCodeChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              {errorMessage && (
                <div className="text-red-500 text-sm mr-auto">
                  {errorMessage}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEditing ? 'Salvar Alterações' : 'Adicionar Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
