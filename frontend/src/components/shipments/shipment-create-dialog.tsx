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
import {
  GetInventoryByIdProduct,
  ReturnProductDto,
  User
} from '@/lib/api-types'
import { useState } from 'react'
import { CreateReturnDto } from '@/hooks/use-returns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { CreateShipmentDto } from '@/hooks/use-shipments'

export function ShipmentCreateDialog({
  isOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (dto: CreateShipmentDto) => void
}) {
  const { handleSubmit, reset, setValue, watch } = useForm<CreateShipmentDto>({
    defaultValues: {
      resellerId: '',
      productIds: []
    }
  })

  const [openFrom, setOpenFrom] = React.useState(false)
  const [openProduct, setOpenProduct] = React.useState(false)

  const resellerId = watch('resellerId')
  const productIds = watch('productIds')

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

  const selectedInventory = React.useMemo(() => {
    if (!resellerId) return undefined
    const inv = inventories.find((i) => i.resellerId === resellerId)
    if (!inv || !inv.query.data || Array.isArray(inv.query.data))
      return undefined
    return inv.query.data
  }, [resellerId, inventories])

  // Monta productsWithModel igual ao transfer-create-dialog
  const productsWithModel = React.useMemo(() => {
    if (
      !selectedInventory ||
      !selectedInventory.products ||
      !selectedInventory.productModelNames
    )
      return []
    return selectedInventory.products.map(
      (p: GetInventoryByIdProduct, idx: number) => ({
        id: p.id,
        label: selectedInventory.productModelNames[idx]?.value || p.id,
        serialNumber: p.serialNumber.value
      })
    )
  }, [selectedInventory])

  const selectedProducts = React.useMemo(() => {
    if (!productIds || !productsWithModel) return []
    return productsWithModel.filter((p: any) => productIds.includes(p.id))
  }, [productIds, productsWithModel])

  const [searchFromValue, setSearchFromValue] = useState('')
  const [searchProductValue, setSearchProductValue] = useState('')

  const onSubmit = (data: CreateShipmentDto) => {
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
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nova Romaneio</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo romaneio.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Revendedor */}
              <div className="space-y-2">
                <Label>Revendedor</Label>
                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFrom}
                      className="w-full justify-between"
                    >
                      {resellerId
                        ? selectedInventory?.resellerName
                        : 'Selecionar revendedor'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar revendedor..."
                        value={searchFromValue}
                        onValueChange={setSearchFromValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          Nenhum revendedor encontrado.
                        </CommandEmpty>
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
                                  setValue('resellerId', value)
                                  setValue('productIds', [])
                                  setOpenFrom(false)
                                  setSearchFromValue('')
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
                <Popover open={openProduct} onOpenChange={setOpenProduct}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProduct}
                      className="w-full justify-between"
                      disabled={
                        !resellerId ||
                        !selectedInventory ||
                        selectedInventory.products.length === 0
                      }
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
                            .map((product: any) => {
                              const checked = productIds?.includes(product.id)
                              return (
                                <CommandItem
                                  key={product.id}
                                  value={product.id}
                                  className="flex justify-between"
                                  onSelect={() => {
                                    let newProductIds = Array.isArray(
                                      productIds
                                    )
                                      ? [...productIds]
                                      : []
                                    if (checked) {
                                      newProductIds = newProductIds.filter(
                                        (id) => id !== product.id
                                      )
                                    } else {
                                      newProductIds.push(product.id)
                                    }
                                    setValue('productIds', newProductIds)
                                  }}
                                >
                                  {`${product.serialNumber} - ${product.label}`}
                                  {checked ? (
                                    <SquareCheck className={'h-4 w-4'} />
                                  ) : (
                                    <Square className={'h-4 w-4'} />
                                  )}
                                </CommandItem>
                              )
                            })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {/* Lista de produtos selecionados */}
                {selectedProducts.length > 0 && (
                  <div className="text-muted-foreground mt-2 text-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Selecionados:</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{`${product.serialNumber} - ${product.label}`}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Criar Romaneio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
