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
import { useGetUsers } from '@/hooks/use-users'
import { useGetInventoryById } from '@/hooks/use-inventory'
import * as React from 'react'
import { useState } from 'react'
import { GetInventoryByIdProduct, User } from '@/lib/api-types'
import {
  GetOneShipmentResponse,
  UpdateShipmentDto
} from '@/hooks/use-shipments'

type ShipmentDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateShipmentDto) => void | Promise<void>
  shipment: GetOneShipmentResponse | null
}

export function ShipmentDialog({
  isOpen,
  onClose,
  onSave,
  shipment
}: ShipmentDialogProps) {
  const { handleSubmit, reset, setValue, watch } = useForm<UpdateShipmentDto>({
    defaultValues: {
      productIds: shipment?.products.map((p) => p.id) || [],
      resellerId: shipment?.resellerId || ''
    }
  })

  const { data: users } = useGetUsers()
  const resellers = React.useMemo(
    () => users?.filter((u: any) => u.role === 'RESELLER') || [],
    [users]
  )

  React.useEffect(() => {
    if (shipment) {
      setValue('productIds', shipment.products.map((p) => p.id) || [])
      setValue('resellerId', shipment.resellerId || '')
    } else {
      reset({
        productIds: [],
        resellerId: ''
      })
    }
  }, [shipment, setValue, reset])

  const resellerId = watch('resellerId')
  const productIds = watch('productIds')

  const [openReseller, setOpenReseller] = useState(false)
  const [openProducts, setOpenProducts] = useState(false)
  const [searchResellerValue, setSearchResellerValue] = useState('')
  const [searchProductValue, setSearchProductValue] = useState('')

  // Buscar inventário apenas do revendedor selecionado
  const { data: selectedInventoryData } = useGetInventoryById(resellerId || '')

  const selectedInventory = React.useMemo(() => {
    if (
      !resellerId ||
      !selectedInventoryData ||
      Array.isArray(selectedInventoryData)
    ) {
      return undefined
    }
    return selectedInventoryData
  }, [resellerId, selectedInventoryData])

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

  const handleClose = () => {
    reset({
      productIds: [],
      resellerId: ''
    })
    onClose()
  }

  const onSubmit = (data: UpdateShipmentDto) => {
    if (shipment) {
      onSave(shipment.id, data)
    }
    onClose()
    reset()
  }

  if (!shipment) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Romaneio</DialogTitle>
            <DialogDescription>
              Edite os detalhes do romaneio selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Revendedor */}
              <div className="col-span-2 space-y-2">
                <Label>Revendedor</Label>
                <Popover open={openReseller} onOpenChange={setOpenReseller}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openReseller}
                      className="w-full justify-between"
                    >
                      {resellerId
                        ? resellers.find((r) => r.id === resellerId)?.name
                            ?.value || resellerId
                        : 'Selecionar revendedor'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar revendedor..."
                        value={searchResellerValue}
                        onValueChange={setSearchResellerValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          Nenhum revendedor encontrado.
                        </CommandEmpty>
                        <CommandGroup>
                          {resellers
                            .filter((reseller) => {
                              if (!searchResellerValue) return true
                              const name =
                                `${reseller.name?.value || ''} ${reseller.surname?.value || ''}`.toLowerCase()
                              return name.includes(
                                searchResellerValue.toLowerCase()
                              )
                            })
                            .map((reseller) => (
                              <CommandItem
                                className="flex justify-between"
                                key={reseller.id}
                                value={reseller.id}
                                onSelect={(value) => {
                                  setValue('resellerId', value)
                                  setValue('productIds', [])
                                  setOpenReseller(false)
                                  setSearchResellerValue('')
                                }}
                              >
                                {`${reseller.name?.value} ${reseller.surname?.value}` ||
                                  reseller.id}
                                {resellerId === reseller.id ? (
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
              {/* Produtos */}
              <div className="col-span-2 space-y-2">
                <Label>Produtos</Label>
                <Popover open={openProducts} onOpenChange={setOpenProducts}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProducts}
                      className="w-full justify-between"
                      disabled={!resellerId || productsWithModel.length === 0}
                    >
                      {productIds && productIds.length > 0
                        ? `${productIds.length} produto(s) selecionado(s)`
                        : 'Selecionar produtos'}
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
                                  const current = watch('productIds') || []
                                  if (current.includes(product.id)) {
                                    setValue(
                                      'productIds',
                                      current.filter(
                                        (id: string) => id !== product.id
                                      )
                                    )
                                  } else {
                                    setValue('productIds', [
                                      ...current,
                                      product.id
                                    ])
                                  }
                                }}
                              >
                                {`${product.serialNumber} - ${product.label}`}
                                {productIds &&
                                productIds.includes(product.id) ? (
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
