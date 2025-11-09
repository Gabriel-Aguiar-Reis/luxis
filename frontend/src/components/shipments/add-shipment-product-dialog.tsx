import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { SquareCheck, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'
import { GetInventoryByIdReturn } from '@/lib/api-types'

type AddShipmentProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  inventory: GetInventoryByIdReturn
  selectedProductIds: string[]
  onToggleProduct: (productId: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export function AddShipmentProductDialog({
  open,
  onOpenChange,
  inventory,
  selectedProductIds,
  onToggleProduct,
  searchValue,
  onSearchChange
}: AddShipmentProductDialogProps) {
  // Agrupar produtos por modelo
  const groupedByModel = useMemo(() => {
    if (!inventory || !inventory.products || !inventory.productModels) {
      return []
    }

    const modelMap = new Map()

    inventory.products.forEach((product, index) => {
      const modelId = product.modelId
      const modelData = inventory.productModels[index]

      if (!modelMap.has(modelId)) {
        modelMap.set(modelId, {
          modelId,
          modelName: modelData?.name?.value || 'Modelo desconhecido',
          photoUrl: modelData?.photoUrl?.value,
          products: []
        })
      }

      modelMap.get(modelId).products.push(product)
    })

    return Array.from(modelMap.values())
  }, [inventory])

  if (!inventory) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[1000px] p-0">
        <div className="flex h-[70vh] flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Selecionar Produtos para Envio</DialogTitle>
            <DialogDescription>
              Escolha os produtos do inventário de {inventory.resellerName} que
              serão incluídos no romaneio.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-4">
            <Input
              placeholder="Buscar modelo ou serial..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="mb-4 h-9 text-sm"
            />
          </div>
          <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted max-h-none flex-1 overflow-y-auto px-6 pb-4">
            {groupedByModel.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Nenhum produto disponível no inventário.
              </p>
            )}
            {(() => {
              const searchLower = searchValue.trim().toLowerCase()
              const filteredModels = groupedByModel
                .map((model) => {
                  const modelMatch = searchLower
                    ? model.modelName.toLowerCase().includes(searchLower)
                    : false
                  const anyProductSerialMatch = searchLower
                    ? model.products.some((p: any) =>
                        p.serialNumber?.value
                          ?.toLowerCase()
                          .includes(searchLower)
                      )
                    : false
                  const productsForDisplay = !searchLower
                    ? model.products
                    : modelMatch
                      ? model.products
                      : anyProductSerialMatch
                        ? model.products.filter((p: any) =>
                            p.serialNumber?.value
                              ?.toLowerCase()
                              .includes(searchLower)
                          )
                        : []
                  return {
                    ...model,
                    _displayProducts: productsForDisplay,
                    _showModel: modelMatch || productsForDisplay.length > 0
                  }
                })
                .filter((m) => m._showModel && m._displayProducts.length > 0)

              if (filteredModels.length === 0) {
                return (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    Nenhum produto encontrado.
                  </p>
                )
              }

              return (
                <Accordion type="multiple" className="space-y-2">
                  {filteredModels.map((m) => (
                    <AccordionItem
                      key={m.modelId as string}
                      value={m.modelId as string}
                    >
                      <AccordionTrigger>
                        <div className="flex w-full items-center justify-between gap-4 pr-2">
                          <div className="flex min-w-0 items-center gap-3">
                            {m.photoUrl ? (
                              <img
                                src={m.photoUrl}
                                alt={m.modelName}
                                className="ring-border h-24 w-24 rounded object-cover ring-1"
                              />
                            ) : (
                              <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded text-[10px]">
                                Img
                              </div>
                            )}
                            <span className="truncate font-medium">
                              {m.modelName}
                            </span>
                          </div>
                          <span className="text-muted-foreground shrink-0 text-xs">
                            {
                              m._displayProducts.filter((p: any) =>
                                selectedProductIds.includes(p.id as string)
                              ).length
                            }
                            /{m._displayProducts.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {m._displayProducts.map((p: any) => {
                            const selected = selectedProductIds.includes(
                              p.id as string
                            )
                            return (
                              <li key={p.id as string}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onToggleProduct(p.id as string)
                                  }
                                  className={cn(
                                    'hover:bg-muted flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs',
                                    selected && 'bg-muted'
                                  )}
                                >
                                  <span className="flex flex-1 items-center justify-between pr-2">
                                    <span className="truncate">
                                      {p.serialNumber?.value || 'Sem serial'}
                                    </span>
                                    <span className="text-muted-foreground mx-2 flex flex-1 items-center">
                                      <span className="border-border w-full border-t border-dashed" />
                                    </span>
                                  </span>
                                  {selected ? (
                                    <SquareCheck className="h-3 w-3" />
                                  ) : (
                                    <Square className="h-3 w-3" />
                                  )}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                        <div className="mt-2 flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const toAdd = m._displayProducts
                                .map((p: any) => p.id as string)
                                .filter(
                                  (id: string) =>
                                    !selectedProductIds.includes(id)
                                )
                              toAdd.forEach((id: string) => onToggleProduct(id))
                            }}
                          >
                            Selecionar todos
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const toRemove = m._displayProducts
                                .map((p: any) => p.id as string)
                                .filter((id: string) =>
                                  selectedProductIds.includes(id)
                                )
                              toRemove.forEach((id: string) =>
                                onToggleProduct(id)
                              )
                            }}
                          >
                            Limpar grupo
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )
            })()}
          </div>
          <DialogFooter className="px-6 pt-4 pb-6">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">
                  {selectedProductIds.length} produto(s) selecionado(s)
                </span>
              </div>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Concluir seleção
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
