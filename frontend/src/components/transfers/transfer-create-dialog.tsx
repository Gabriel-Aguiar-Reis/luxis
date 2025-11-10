import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { CreateTransferDto } from '@/hooks/use-transfers'
import { useGetUsers } from '@/hooks/use-users'
import { useGetInventoryById } from '@/hooks/use-inventory'
import * as React from 'react'
import { Button } from '@/components/ui/button'
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
import { GetInventoryByIdProduct, User } from '@/lib/api-types'
import { useState } from 'react'

export function TransferCreateDialog({
  isOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (dto: CreateTransferDto) => void
}) {
  const { handleSubmit, reset, setValue, watch } = useForm<CreateTransferDto>({
    defaultValues: {
      productId: '',
      fromResellerId: '',
      toResellerId: ''
    }
  })

  const [openFrom, setOpenFrom] = React.useState(false)
  const [openTo, setOpenTo] = React.useState(false)
  const [openProduct, setOpenProduct] = React.useState(false)

  const fromResellerId = watch('fromResellerId')
  const toResellerId = watch('toResellerId')
  const productId = watch('productId')

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

  const onSubmit = (data: CreateTransferDto) => {
    console.log(data.transferDate)
    onCreate(data)
    onClose()
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
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
                <Label>Doador</Label>
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
                                  setValue('fromResellerId', value)
                                  setValue('productId', '')
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
              </div>
              {/* Recebedor */}
              <div className="space-y-2">
                <Label>Recebedor</Label>
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
                                  setValue('toResellerId', value)
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
              </div>
              {/* Produto */}
              <div className="space-y-2 sm:col-span-2">
                <Label>Produto</Label>
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
                                  setValue('productId', product.id)
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
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Criar Transferência
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
