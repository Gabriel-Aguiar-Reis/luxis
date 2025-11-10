'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { ChevronsUpDown, Plus, Square, SquareCheck } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@/lib/i18n/navigation'
import { useGetAvailableProductsToSell, useCreateSale } from '@/hooks/use-sales'
import {
  useGetCustomers,
  useCreateCustomer,
  GetAllCustomersResponse
} from '@/hooks/use-customers'
import { GetAvailableProductDto } from '@/lib/api-types'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { AddCustomerDialog } from '@/components/sales/add-customer-dialog'
import { AddProductDialog } from '@/components/sales/add-product-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const saleSchema = z
  .object({
    productIds: z
      .array(z.string().uuid())
      .min(1, 'Selecione ao menos 1 produto'),
    saleDate: z.string(),
    paymentMethod: z.enum(['CASH', 'PIX', 'DEBIT', 'CREDIT', 'EXCHANGE']),
    numberInstallments: z
      .number({ invalid_type_error: 'Informe o número de parcelas' })
      .int('Número inteiro')
      .min(1, 'Mínimo 1'),
    installmentsInterval: z
      .number({ invalid_type_error: 'Informe o intervalo entre parcelas' })
      .int('Número inteiro')
      .min(0, 'Mínimo 0'),
    customerId: z.string().uuid({ message: 'Selecione um cliente' })
  })
  .superRefine((data, ctx) => {
    if (
      (data.paymentMethod === 'CASH' || data.paymentMethod === 'PIX') &&
      data.numberInstallments < 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['numberInstallments'],
        message: 'Informe o número de parcelas (>0)'
      })
    }
    if (
      (data.paymentMethod === 'CASH' || data.paymentMethod === 'PIX') &&
      data.installmentsInterval < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['installmentsInterval'],
        message: 'Informe um intervalo válido (>=0)'
      })
    }
  })

export type SaleFormValues = {
  productIds: string[]
  saleDate: string
  paymentMethod: 'CASH' | 'PIX' | 'DEBIT' | 'CREDIT' | 'EXCHANGE'
  numberInstallments: number
  installmentsInterval: number
  customerId: string
}

export function SaleCreateForm() {
  const queryClient = useQueryClient()
  const { data: res } = useGetAvailableProductsToSell()
  const { data: customers } = useGetCustomers()
  const { mutate: createCustomer } = useCreateCustomer(queryClient)
  const { mutate: createSale, isPending: isSubmitting } =
    useCreateSale(queryClient)
  const [isCashPayment, setIsCashPayment] = useState(true)

  const router = useRouter()

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productIds: [],
      saleDate: new Date().toISOString(),
      paymentMethod: 'CASH',
      numberInstallments: 1,
      installmentsInterval: 0,
      customerId: ''
    }
  })

  const [openCustomer, setOpenCustomer] = useState(false)
  const [searchCustomer, setSearchCustomer] = useState('')
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false)
  const [showProductsDialog, setShowProductsDialog] = useState(false)
  const [searchProduct, setSearchProduct] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)

  function onSubmit(data: SaleFormValues) {
    const payload = { ...data }
    if (
      (payload.paymentMethod === 'CASH' || payload.paymentMethod === 'PIX') &&
      isCashPayment
    ) {
      payload.numberInstallments = 1
      payload.installmentsInterval = 0
    }
    createSale(payload, {
      onSuccess: (response) => {
        router.push(`/home/sales/new/confirmation?saleId=${response.id}`)
      }
    })
  }

  function toggleProduct(id: string) {
    const current = form.getValues('productIds')
    if (current.includes(id)) {
      form.setValue(
        'productIds',
        current.filter((p) => p !== id),
        { shouldValidate: true }
      )
    } else {
      form.setValue('productIds', [...current, id], { shouldValidate: true })
    }
  }

  const newCustomerForm = useForm<{ name: string; phone: string }>({
    defaultValues: { name: '', phone: '' }
  })

  function handleCreateCustomer() {
    const values = newCustomerForm.getValues()
    if (!values.name) return
    createCustomer(
      { name: values.name, phone: values.phone },
      {
        onSuccess: (cust) => {
          form.setValue('customerId', cust.id, { shouldValidate: true })
          setShowNewCustomerDialog(false)
          newCustomerForm.reset()
        }
      }
    )
  }

  const categories = res?.data || []

  const groupedProducts: [string, GetAvailableProductDto][] = []
  categories.forEach((c) => {
    c.models.forEach((m) => {
      groupedProducts.push([m.modelName.value, m.products])
    })
  })

  // Calcula o total dos produtos selecionados
  const selectedProductIds = form.watch('productIds')
  const allProductsFlat = categories.flatMap((c) =>
    c.models.flatMap((m) => m.products)
  )
  const selectedProducts = allProductsFlat.filter((p) =>
    selectedProductIds.includes(p.id as string)
  )
  const totalAmount = selectedProducts.reduce((acc, p) => {
    const valueRaw: any = (p.salePrice as any).value
    const numeric =
      typeof valueRaw === 'string' ? parseFloat(valueRaw) : Number(valueRaw)
    return acc + (isNaN(numeric) ? 0 : numeric)
  }, 0)

  const selectedCustomer = (customers || []).find(
    (c) => c.id === form.watch('customerId')
  )
  const paymentMethod = form.watch('paymentMethod')

  function getCustomerName(c: GetAllCustomersResponse[0] | undefined) {
    if (!c) return ''
    const name: any = (c as any).name
    if (typeof name === 'string') return name
    if (name && typeof name === 'object' && 'value' in name)
      return (name as any).value
    return ''
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full justify-center px-4"
        >
          <Card className="flex max-h-[85vh] w-full max-w-2xl flex-col">
            <CardHeader className="shrink-0">
              <CardTitle className="mb-2 text-xl sm:text-2xl">
                Criar Venda
              </CardTitle>
              <CardDescription>
                Preencha os dados abaixo para registrar uma nova venda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 overflow-auto">
              {/* Data da venda */}
              <FormField
                control={form.control}
                name="saleDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da venda</FormLabel>
                    <FormControl>
                      <Popover
                        open={showCalendar}
                        onOpenChange={setShowCalendar}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-56 justify-between font-normal"
                            type="button"
                          >
                            {field.value
                              ? format(new Date(field.value), 'dd/MM/yyyy')
                              : 'Selecionar data'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={ptBR}
                            selected={new Date(field.value)}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : '')
                              setShowCalendar(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Cliente */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Popover
                          open={openCustomer}
                          onOpenChange={setOpenCustomer}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCustomer}
                              className="flex-1 justify-between"
                              type="button"
                            >
                              {getCustomerName(selectedCustomer) ||
                                'Selecionar cliente'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder="Buscar cliente..."
                                value={searchCustomer}
                                onValueChange={setSearchCustomer}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Nenhum cliente encontrado.
                                </CommandEmpty>
                                <CommandGroup>
                                  {(customers || [])
                                    .filter((c) => {
                                      if (!searchCustomer) return true
                                      const n = getCustomerName(c)
                                      return n
                                        ?.toLowerCase()
                                        .includes(searchCustomer.toLowerCase())
                                    })
                                    .map((c) => (
                                      <CommandItem
                                        key={c.id}
                                        value={c.id}
                                        className="flex justify-between"
                                        onSelect={() => {
                                          field.onChange(c.id)
                                          setOpenCustomer(false)
                                          setSearchCustomer('')
                                        }}
                                      >
                                        {getCustomerName(c)}
                                        {field.value === c.id ? (
                                          <SquareCheck className="h-4 w-4" />
                                        ) : (
                                          <Square className="h-4 w-4" />
                                        )}
                                      </CommandItem>
                                    ))}
                                  <CommandItem
                                    value="__new__"
                                    className="text-primary mt-2 flex items-center"
                                    onSelect={() => {
                                      setShowNewCustomerDialog(true)
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Criar novo cliente
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setShowNewCustomerDialog(true)}
                        >
                          Novo
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Produtos (Dialog em vez de Popover) */}
              <FormField
                control={form.control}
                name="productIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Produtos</FormLabel>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        type="button"
                        onClick={() => setShowProductsDialog(true)}
                      >
                        {form.watch('productIds').length > 0
                          ? `${form.watch('productIds').length} selecionado(s)`
                          : 'Selecionar produtos'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                    <FormMessage />
                    {selectedProducts.length > 0 && (
                      <div className="mt-4 rounded border">
                        <div className="bg-muted px-3 py-2 text-sm font-medium">
                          Produtos Selecionados
                        </div>
                        <div className="max-h-56 overflow-auto py-2">
                          {(() => {
                            // Agrupa por nome do modelo
                            const grouped = selectedProducts.reduce<
                              Record<string, typeof selectedProducts>
                            >((acc, p) => {
                              // Encontrar o modelName via categories
                              const modelName =
                                categories
                                  .flatMap((c) => c.models)
                                  .find((m) =>
                                    m.products.some((prod) => prod.id === p.id)
                                  )?.modelName.value || 'Modelo'
                              if (!acc[modelName]) acc[modelName] = []
                              acc[modelName].push(p)
                              return acc
                            }, {})
                            return Object.entries(grouped).map(
                              ([modelName, items]) => (
                                <div key={modelName} className="px-3 py-2">
                                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                                    <span>
                                      {modelName} - {items.length} un
                                    </span>
                                  </div>
                                  <ul className="space-y-1 text-xs">
                                    {items.map((p) => {
                                      const priceRaw: any = (p.salePrice as any)
                                        .value
                                      const priceNum =
                                        typeof priceRaw === 'string'
                                          ? parseFloat(priceRaw)
                                          : Number(priceRaw)
                                      return (
                                        <li
                                          key={p.id as string}
                                          className="hover:bg-muted flex items-center gap-4 rounded px-2 py-1"
                                        >
                                          <span className="font-mono tracking-tight">
                                            {p.serialNumber?.value ||
                                              'Sem serial'}
                                          </span>
                                          <span className="text-muted-foreground mx-2 flex flex-1 items-center">
                                            <span className="border-border w-full border-t border-dashed" />
                                          </span>
                                          <span className="text-right font-medium">
                                            {new Intl.NumberFormat('pt-BR', {
                                              style: 'currency',
                                              currency: 'BRL'
                                            }).format(priceNum)}
                                          </span>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </div>
                              )
                            )
                          })()}
                        </div>
                        <div className="flex items-center justify-between border-t px-3 py-2 text-xs">
                          <span className="text-muted-foreground">
                            Total estimado
                          </span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(totalAmount)}
                          </span>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <Separator />

              {/* Pagamento */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {['CASH', 'PIX', 'DEBIT', 'CREDIT', 'EXCHANGE'].map(
                          (pm) => (
                            <Button
                              key={pm}
                              type="button"
                              variant={
                                field.value === pm ? 'default' : 'outline'
                              }
                              onClick={() => field.onChange(pm)}
                              className={cn(
                                'text-sm',
                                field.value === pm && 'font-semibold'
                              )}
                            >
                              {pm === 'CASH' && 'Dinheiro'}
                              {pm === 'PIX' && 'PIX'}
                              {pm === 'DEBIT' && 'Débito'}
                              {pm === 'CREDIT' && 'Crédito'}
                              {pm === 'EXCHANGE' && 'Troca'}
                            </Button>
                          )
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(paymentMethod === 'CASH' || paymentMethod === 'PIX') && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isCashPayment}
                    onCheckedChange={() => setIsCashPayment(!isCashPayment)}
                  />
                  <Label>Pagamento à vista</Label>
                </div>
              )}
              {((paymentMethod === 'CASH' && !isCashPayment) ||
                (paymentMethod === 'PIX' && !isCashPayment)) && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      disabled={isCashPayment}
                      name="numberInstallments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de parcelas</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              placeholder="Ex: 3"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="installmentsInterval"
                      disabled={isCashPayment}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intervalo (dias)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              placeholder="Ex: 30"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t px-6 py-4 backdrop-blur-sm sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Salvando...' : 'Criar venda'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <AddCustomerDialog
        showNewCustomerDialog={showNewCustomerDialog}
        setShowNewCustomerDialog={setShowNewCustomerDialog}
        newCustomerForm={newCustomerForm}
        handleCreateCustomer={handleCreateCustomer}
      />

      <AddProductDialog
        showProductsDialog={showProductsDialog}
        setShowProductsDialog={setShowProductsDialog}
        categories={categories}
        searchProduct={searchProduct}
        setSearchProduct={setSearchProduct}
        form={form}
        toggleProduct={toggleProduct}
        totalAmount={totalAmount}
      />
    </>
  )
}
