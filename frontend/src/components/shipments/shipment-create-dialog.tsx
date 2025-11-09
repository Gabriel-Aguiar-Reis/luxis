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
import { useGetUsers } from '@/hooks/use-users'
import { useGetAvailableProducts } from '@/hooks/use-products'
import { useGetModels } from '@/hooks/use-product-models'
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
import { useState } from 'react'
import { CreateShipmentDto } from '@/hooks/use-shipments'
import { AddShipmentProductDialog } from '@/components/shipments/add-shipment-product-dialog'

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
  const [showProductsDialog, setShowProductsDialog] = React.useState(false)

  const resellerId = watch('resellerId')
  const productIds = watch('productIds')

  const { data: users } = useGetUsers()
  const { data: availableProducts } = useGetAvailableProducts()
  const { data: productModels } = useGetModels()

  const resellers = React.useMemo(
    () => users?.filter((u: any) => u.role === 'RESELLER') || [],
    [users]
  )

  // Montar estrutura de inventário fake a partir dos produtos disponíveis
  const availableInventory = React.useMemo(() => {
    if (!availableProducts || !productModels) return undefined

    return {
      resellerId: 'available',
      resellerName: 'Produtos Disponíveis',
      products: availableProducts.map((p: any) => ({
        id: p.id,
        serialNumber: { value: p.serialNumber?.value || '' },
        modelId: p.modelId,
        batchId: p.batchId,
        unitCost: { value: p.unitCost?.value || '0' },
        salePrice: { value: p.salePrice?.value || '0' },
        status: p.status
      })),
      productModels: availableProducts.map((p: any) => {
        const model = productModels.find((m: any) => m.id === p.modelId)
        return {
          id: model?.id || p.modelId,
          name: { value: model?.name?.value || 'Desconhecido' },
          categoryId: model?.categoryId || '',
          suggestedPrice: { value: model?.suggestedPrice?.value || '0' },
          description: model?.description,
          photoUrl: model?.photoUrl,
          status: model?.status || 'ACTIVE'
        }
      })
    }
  }, [availableProducts, productModels])

  const [searchFromValue, setSearchFromValue] = useState('')
  const [searchProductValue, setSearchProductValue] = useState('')

  function toggleProduct(id: string) {
    const current = productIds || []
    if (current.includes(id)) {
      setValue(
        'productIds',
        current.filter((p) => p !== id)
      )
    } else {
      setValue('productIds', [...current, id])
    }
  }

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
            <DialogTitle>Novo Romaneio</DialogTitle>
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
                        ? resellers.find((r: any) => r.id === resellerId)?.name
                            ?.value +
                          ' ' +
                          resellers.find((r: any) => r.id === resellerId)
                            ?.surname?.value
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
                <Button
                  type="button"
                  variant="outline"
                  disabled={!resellerId}
                  onClick={() => setShowProductsDialog(true)}
                  className="w-full justify-start font-normal"
                >
                  <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  {productIds && productIds.length > 0
                    ? `${productIds.length} produto(s) selecionado(s)`
                    : 'Selecionar produtos'}
                </Button>
                {productIds && productIds.length > 0 && (
                  <p className="text-muted-foreground text-sm">
                    {productIds.length} produto(s) selecionado(s)
                  </p>
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

      {availableInventory && (
        <AddShipmentProductDialog
          open={showProductsDialog}
          onOpenChange={setShowProductsDialog}
          inventory={availableInventory}
          selectedProductIds={productIds || []}
          onToggleProduct={toggleProduct}
          searchValue={searchProductValue}
          onSearchChange={setSearchProductValue}
        />
      )}
    </Dialog>
  )
}
