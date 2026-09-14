import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FieldLabel } from '@/components/ui/field'
import { CreateTransferDto } from '@/hooks/use-transfers'
import { useGetUsers } from '@/hooks/use-users'
import { useGetInventoryById } from '@/hooks/use-inventory'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ChevronsUpDown, Square, SquareCheck } from 'lucide-react'
import { GetInventoryByIdProduct } from '@/lib/api-types'
import { useState } from 'react'

const transferSchema = z
  .object({
    productId: z.string().trim().min(1, 'Selecione um produto'),
    fromResellerId: z.string().trim().min(1, 'Selecione um doador'),
    toResellerId: z.string().trim().min(1, 'Selecione um recebedor')
  })
  .refine((data) => data.fromResellerId !== data.toResellerId, {
    path: ['toResellerId'],
    message: 'O recebedor deve ser diferente do doador'
  })

type TransferFormValues = z.infer<typeof transferSchema>

export function TransferCreateDialog({
  isOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (dto: CreateTransferDto) => void
}) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      productId: '',
      fromResellerId: '',
      toResellerId: ''
    }
  })

  const [openFrom, setOpenFrom] = React.useState(false)
  const [openTo, setOpenTo] = React.useState(false)
  const [openProduct, setOpenProduct] = React.useState(false)

  const fromResellerId = useWatch({ control, name: 'fromResellerId' })
  const toResellerId = useWatch({ control, name: 'toResellerId' })
  const productId = useWatch({ control, name: 'productId' })

  const { data: users } = useGetUsers()
  const resellers = React.useMemo(
    () => users?.filter((u: any) => u.role === 'RESELLER') || [],
    [users]
  )

  // Carrega apenas os inventários necessários (doador e recebedor)
  const { data: fromInventory } = useGetInventoryById(fromResellerId || '')
  const { data: toInventory } = useGetInventoryById(toResellerId || '')

  const selectedInventory = React.useMemo(() => {
    if (!fromResellerId || !fromInventory) return undefined
    if (Array.isArray(fromInventory)) return undefined
    return fromInventory
  }, [fromResellerId, fromInventory])

  const selectedToInventory = React.useMemo(() => {
    if (!toResellerId || !toInventory) return undefined
    if (Array.isArray(toInventory)) return undefined
    return toInventory
  }, [toResellerId, toInventory])

  const selectedProduct = React.useMemo(() => {
    if (!productId || !selectedInventory) return ''

    const product = selectedInventory.products.find(
      (p: GetInventoryByIdProduct) => p.id === productId
    )
    if (!product) return ''

    const model = selectedInventory.productModels?.find(
      (m) => m.id === product.modelId
    )
    const modelName = model?.name?.value || product.id
    return `${product.serialNumber.value} - ${modelName}`
  }, [productId, selectedInventory])

  const productsWithModel = React.useMemo(() => {
    if (
      !selectedInventory ||
      !selectedInventory.products ||
      !selectedInventory.productModels
    )
      return []

    // Criar um map de modelId -> productModel para facilitar a busca
    const modelMap = new Map(
      selectedInventory.productModels.map((model) => [model.id, model])
    )

    return selectedInventory.products.map((p: GetInventoryByIdProduct) => {
      const model = modelMap.get(p.modelId)
      return {
        id: p.id,
        label: model?.name?.value || p.id,
        serialNumber: p.serialNumber.value
      }
    })
  }, [selectedInventory])

  const [searchFromValue, setSearchFromValue] = useState('')
  const [searchToValue, setSearchToValue] = useState('')
  const [searchProductValue, setSearchProductValue] = useState('')

  const onSubmit = (data: TransferFormValues) => {
    const dto: CreateTransferDto = data
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nova Transferência</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova transferência de
              propriedade.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Doador */}
              <div className="space-y-2">
                <FieldLabel>Doador</FieldLabel>
                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFrom}
                      className="w-full justify-between"
                    >
                      {fromResellerId
                        ? selectedInventory?.resellerName
                        : 'Selecionar doador'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar doador..."
                        value={searchFromValue}
                        onValueChange={setSearchFromValue}
                      />
                      <CommandList>
                        <CommandEmpty>Nenhum doador encontrado.</CommandEmpty>
                        <CommandGroup>
                          {resellers
                            .filter((reseller) => {
                              if (!searchFromValue) return true
                              const name =
                                `${reseller.name?.value || ''} ${reseller.surname?.value || ''}`.toLowerCase()
                              return name.includes(
                                searchFromValue.toLowerCase()
                              )
                            })
                            .map((reseller) => (
                              <CommandItem
                                className="flex justify-between"
                                key={reseller.id}
                                value={reseller.id}
                                onSelect={(value) => {
                                  setValue('fromResellerId', value, {
                                    shouldValidate: true
                                  })
                                  if (value === toResellerId) {
                                    setValue('toResellerId', '', {
                                      shouldValidate: true
                                    })
                                  }
                                  setValue('productId', '', {
                                    shouldValidate: true
                                  })
                                  setOpenFrom(false)
                                  setSearchFromValue('')
                                }}
                              >
                                {`${reseller.name?.value} ${reseller.surname?.value}` ||
                                  reseller.id}
                                {fromResellerId === reseller.id ? (
                                  <SquareCheck className={'h-4 w-4'} />
                                ) : (
                                  <Square className={'h-4 w-4'} />
                                )}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.fromResellerId && (
                  <p className="text-destructive text-sm">
                    {errors.fromResellerId.message}
                  </p>
                )}
              </div>
              {/* Recebedor */}
              <div className="space-y-2">
                <FieldLabel>Recebedor</FieldLabel>
                <Popover open={openTo} onOpenChange={setOpenTo}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openTo}
                      className="w-full justify-between"
                    >
                      {toResellerId
                        ? selectedToInventory?.resellerName
                        : 'Selecionar recebedor'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar recebedor..."
                        value={searchToValue}
                        onValueChange={setSearchToValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          Nenhum recebedor encontrado.
                        </CommandEmpty>
                        <CommandGroup>
                          {resellers
                            .filter((r) => r.id !== fromResellerId)
                            .filter((reseller) => {
                              if (!searchToValue) return true
                              const name =
                                `${reseller.name?.value || ''} ${reseller.surname?.value || ''}`.toLowerCase()
                              return name.includes(searchToValue.toLowerCase())
                            })
                            .map((reseller) => (
                              <CommandItem
                                key={reseller.id}
                                value={reseller.id}
                                className="flex justify-between"
                                onSelect={(value) => {
                                  setValue('toResellerId', value, {
                                    shouldValidate: true
                                  })
                                  setOpenTo(false)
                                  setSearchToValue('')
                                }}
                              >
                                {`${reseller.name?.value} ${reseller.surname?.value}` ||
                                  reseller.id}
                                {toResellerId === reseller.id ? (
                                  <SquareCheck className={'h-4 w-4'} />
                                ) : (
                                  <Square className={'h-4 w-4'} />
                                )}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.toResellerId && (
                  <p className="text-destructive text-sm">
                    {errors.toResellerId.message}
                  </p>
                )}
              </div>
              {/* Produto */}
              <div className="space-y-2 sm:col-span-2">
                <FieldLabel>Produto</FieldLabel>
                <Popover open={openProduct} onOpenChange={setOpenProduct}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProduct}
                      className="w-full justify-between"
                      disabled={
                        !fromResellerId || productsWithModel.length === 0
                      }
                    >
                      {productId ? selectedProduct : 'Selecionar produto'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar produto..."
                        value={searchProductValue}
                        onValueChange={setSearchProductValue}
                      />
                      <CommandList>
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                          {productsWithModel
                            .filter((product) => {
                              if (!searchProductValue) return true
                              const label =
                                `${product.serialNumber} - ${product.label}`.toLowerCase()
                              return label.includes(
                                searchProductValue.toLowerCase()
                              )
                            })
                            .map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.id}
                                className="flex justify-between"
                                onSelect={() => {
                                  setValue('productId', product.id, {
                                    shouldValidate: true
                                  })
                                  setOpenProduct(false)
                                  setSearchProductValue('')
                                }}
                              >
                                {`${product.serialNumber} - ${product.label}`}
                                {productId === product.id ? (
                                  <SquareCheck className={'h-4 w-4'} />
                                ) : (
                                  <Square className={'h-4 w-4'} />
                                )}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.productId && (
                  <p className="text-destructive text-sm">
                    {errors.productId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <ButtonGroup className="w-full justify-end sm:w-fit">
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Criar Transferência
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
