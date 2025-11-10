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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Novo Romaneio
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Preencha os dados para criar um novo romaneio.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-3 sm:gap-4 sm:py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {/* Revendedor */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Revendedor</Label>
                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFrom}
                      className="h-9 w-full justify-between text-xs sm:h-10 sm:text-sm"
                    >
                      <span className="truncate">
                        {resellerId
                          ? resellers.find((r: any) => r.id === resellerId)
                              ?.name?.value +
                            ' ' +
                            resellers.find((r: any) => r.id === resellerId)
                              ?.surname?.value
                          : 'Selecionar revendedor'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50 sm:h-4 sm:w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar revendedor..."
                        value={searchFromValue}
                        onValueChange={setSearchFromValue}
                        className="text-xs sm:text-sm"
                      />
                      <CommandList>
                        <CommandEmpty className="text-xs sm:text-sm">
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
                                className="flex justify-between text-xs sm:text-sm"
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
                                  <SquareCheck
                                    className={'h-3 w-3 sm:h-4 sm:w-4'}
                                  />
                                ) : (
                                  <Square className={'h-3 w-3 sm:h-4 sm:w-4'} />
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
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs sm:text-sm">Produtos</Label>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!resellerId}
                  onClick={() => setShowProductsDialog(true)}
                  className="h-9 w-full justify-start text-xs font-normal sm:h-10 sm:text-sm"
                >
                  <ChevronsUpDown className="mr-2 h-3 w-3 shrink-0 opacity-50 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {productIds && productIds.length > 0
                      ? `${productIds.length} produto(s) selecionado(s)`
                      : 'Selecionar produtos'}
                  </span>
                </Button>
                {productIds && productIds.length > 0 && (
                  <p className="text-muted-foreground text-[10px] sm:text-xs">
                    {productIds.length} produto(s) selecionado(s)
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full text-xs sm:w-auto sm:text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full text-xs sm:w-auto sm:text-sm"
            >
              Criar Romaneio
            </Button>
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
