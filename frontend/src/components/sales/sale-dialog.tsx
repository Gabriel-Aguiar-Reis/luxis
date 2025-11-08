import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { ChevronsUpDown, Square, SquareCheck } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import {
  GetOneSaleResponse,
  UpdateSaleDto,
  useGetAvailableProductsToSell
} from '@/hooks/use-sales'

type SaleDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateSaleDto) => void | Promise<void>
  sale: GetOneSaleResponse | null
}

export function SaleDialog({ isOpen, onClose, onSave, sale }: SaleDialogProps) {
  const { handleSubmit, reset, setValue, watch } = useForm<UpdateSaleDto>({
    defaultValues: {
      productIds: sale?.products.map((p) => p.id) || []
    }
  })

  const { data: res } = useGetAvailableProductsToSell()
  const [showProductsDialog, setShowProductsDialog] = useState(false)
  const [searchProduct, setSearchProduct] = useState('')

  React.useEffect(() => {
    if (sale) {
      setValue('productIds', sale.products.map((p) => p.id) || [])
    } else {
      reset({
        productIds: []
      })
    }
  }, [sale, setValue, reset])

  const productIds = watch('productIds')

  const handleClose = () => {
    reset({
      productIds: []
    })
    setShowProductsDialog(false)
    onClose()
  }

  const onSubmit = (data: UpdateSaleDto) => {
    if (sale) {
      onSave(sale.id, data)
    }
    handleClose()
  }

  if (!sale) {
    return null
  }

  const categories = res?.data || []

  // Produtos disponíveis
  const allProductsFlat = categories.flatMap((c) =>
    c.models.flatMap((m) => m.products)
  )

  // Produtos selecionados
  const selectedProducts = allProductsFlat.filter((p) =>
    productIds.includes(p.id as string)
  )

  // Calcula o total
  const totalAmount = selectedProducts.reduce((acc, p) => {
    const valueRaw: any = (p.salePrice as any).value
    const numeric =
      typeof valueRaw === 'string' ? parseFloat(valueRaw) : Number(valueRaw)
    return acc + (isNaN(numeric) ? 0 : numeric)
  }, 0)

  function toggleProduct(id: string) {
    const current = watch('productIds') || []
    if (current.includes(id)) {
      setValue(
        'productIds',
        current.filter((p) => p !== id)
      )
    } else {
      setValue('productIds', [...current, id])
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Editar Venda</DialogTitle>
              <DialogDescription>
                Edite os produtos da venda selecionada.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Botão para abrir dialog de produtos */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  type="button"
                  onClick={() => setShowProductsDialog(true)}
                >
                  {productIds.length > 0
                    ? `${productIds.length} produto(s) selecionado(s)`
                    : 'Selecionar produtos'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </div>

              {/* Lista de produtos selecionados */}
              {selectedProducts.length > 0 && (
                <div className="mt-2 rounded border">
                  <div className="bg-muted px-3 py-2 text-sm font-medium">
                    Produtos Selecionados
                  </div>
                  <div className="max-h-96 overflow-auto py-2">
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
                                const priceRaw: any = (p.salePrice as any).value
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
                                      {p.serialNumber?.value || 'Sem serial'}
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

      {/* Dialog de seleção de produtos */}
      <Dialog open={showProductsDialog} onOpenChange={setShowProductsDialog}>
        <DialogContent className="max-h-[85vh] sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Selecionar Produtos</DialogTitle>
            <DialogDescription>
              Escolha os produtos para adicionar à venda.
            </DialogDescription>
          </DialogHeader>

          <Command shouldFilter={false} className="overflow-hidden">
            <CommandInput
              placeholder="Buscar produto..."
              value={searchProduct}
              onValueChange={setSearchProduct}
            />
            <CommandList className="max-h-[50vh] overflow-auto">
              <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
              {categories
                .filter((cat) => {
                  if (!searchProduct) return true
                  return cat.models.some((m) =>
                    m.products.some((p) => {
                      const serial = p.serialNumber?.value || ''
                      const model = m.modelName.value || ''
                      const searchLower = searchProduct.toLowerCase()
                      return (
                        serial.toLowerCase().includes(searchLower) ||
                        model.toLowerCase().includes(searchLower)
                      )
                    })
                  )
                })
                .map((category) => (
                  <CommandGroup
                    key={category.categoryId}
                    heading={category.categoryName.value}
                  >
                    {category.models
                      .filter((model) => {
                        if (!searchProduct) return true
                        return model.products.some((p) => {
                          const serial = p.serialNumber?.value || ''
                          const modelName = model.modelName.value || ''
                          const searchLower = searchProduct.toLowerCase()
                          return (
                            serial.toLowerCase().includes(searchLower) ||
                            modelName.toLowerCase().includes(searchLower)
                          )
                        })
                      })
                      .map((model) =>
                        model.products
                          .filter((product) => {
                            if (!searchProduct) return true
                            const serial = product.serialNumber?.value || ''
                            const modelName = model.modelName.value || ''
                            const searchLower = searchProduct.toLowerCase()
                            return (
                              serial.toLowerCase().includes(searchLower) ||
                              modelName.toLowerCase().includes(searchLower)
                            )
                          })
                          .map((product) => (
                            <CommandItem
                              key={product.id as string}
                              value={product.id as string}
                              className="flex justify-between"
                              onSelect={() =>
                                toggleProduct(product.id as string)
                              }
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {model.modelName.value}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  SN: {product.serialNumber?.value || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }).format(
                                    typeof (product.salePrice as any).value ===
                                      'string'
                                      ? parseFloat(
                                          (product.salePrice as any).value
                                        )
                                      : Number((product.salePrice as any).value)
                                  )}
                                </span>
                                {productIds.includes(product.id as string) ? (
                                  <SquareCheck className="h-4 w-4" />
                                ) : (
                                  <Square className="h-4 w-4" />
                                )}
                              </div>
                            </CommandItem>
                          ))
                      )}
                  </CommandGroup>
                ))}
            </CommandList>
          </Command>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowProductsDialog(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
