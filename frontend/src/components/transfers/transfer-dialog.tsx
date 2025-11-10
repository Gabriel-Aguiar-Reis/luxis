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
import { UpdateTransferDto } from '@/hooks/use-transfers'
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
import {
  GetInventoryByIdProduct,
  User,
  OwnershipTransfer
} from '@/lib/api-types'
import { useState } from 'react'

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
  const { handleSubmit, reset, setValue, watch } = useForm<UpdateTransferDto>({
    defaultValues: {
      productId: transfer?.productId || '',
      fromResellerId: transfer?.fromResellerId || '',
      toResellerId: transfer?.toResellerId || ''
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

  function useMultipleInventories(resellers: User[]) {
    return resellers.map((reseller) => ({
      resellerId: reseller.id,
      query: useGetInventoryById(reseller.id)
    }))
  }

  const inventories = useMultipleInventories(resellers)

  React.useEffect(() => {
    if (transfer) {
      setValue('productId', transfer.productId || '')
      setValue('fromResellerId', transfer.fromResellerId || '')
      setValue('toResellerId', transfer.toResellerId || '')
    } else {
      reset({
        productId: '',
        fromResellerId: '',
        toResellerId: ''
      })
    }
  }, [transfer, setValue, reset])

  const selectedInventory = React.useMemo(() => {
    if (!fromResellerId) return undefined
    const inv = inventories.find((i) => i.resellerId === fromResellerId)
    if (!inv || !inv.query.data || Array.isArray(inv.query.data))
      return undefined
    return inv.query.data
  }, [fromResellerId, inventories])

  const selectedToInventory = React.useMemo(() => {
    if (!toResellerId) return undefined
    const inv = inventories.find((i) => i.resellerId === toResellerId)
    if (!inv || !inv.query.data || Array.isArray(inv.query.data))
      return undefined
    return inv.query.data
  }, [toResellerId, inventories])

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

  const handleClose = () => {
    reset({
      productId: '',
      fromResellerId: '',
      toResellerId: ''
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Transferência</DialogTitle>
            <DialogDescription>
              Edite os detalhes da transferência selecionada.
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
