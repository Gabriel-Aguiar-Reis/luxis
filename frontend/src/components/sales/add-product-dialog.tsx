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
import { UseFormReturn } from 'react-hook-form'
import { SaleFormValues } from '@/components/sales/sale-create-form'
import { GetAvailableCategoriesDto } from '@/lib/api-types'
import { useEffect } from 'react'

type AddProductDialogProps = {
  showProductsDialog: boolean
  setShowProductsDialog: (show: boolean) => void
  categories: GetAvailableCategoriesDto
  searchProduct: string
  setSearchProduct: (s: string) => void
  form: UseFormReturn<SaleFormValues>
  toggleProduct: (productId: string) => void
  totalAmount: number
}

export function AddProductDialog({
  showProductsDialog,
  setShowProductsDialog,
  categories,
  searchProduct,
  setSearchProduct,
  form,
  toggleProduct,
  totalAmount
}: AddProductDialogProps) {
  useEffect(() => {
    if (!showProductsDialog) {
      setSearchProduct('')
    }
  }, [showProductsDialog, setSearchProduct])
  return (
    <Dialog open={showProductsDialog} onOpenChange={setShowProductsDialog}>
      <DialogContent className="w-[95vw] max-w-[1000px] p-0">
        <div className="flex h-[70vh] flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Selecionar Produtos</DialogTitle>
            <DialogDescription>
              Escolha os produtos que serão incluídos na venda. Agrupados por
              modelo para facilitar a seleção.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-4">
            <Input
              placeholder="Buscar modelo ou serial..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="mb-4 h-9 text-sm"
            />
          </div>
          <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted max-h-none flex-1 overflow-y-auto px-6 pb-4">
            {categories.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Nenhum produto disponível.
              </p>
            )}
            {(() => {
              const searchLower = searchProduct.trim().toLowerCase()
              const filteredCategories = categories
                .map((cat) => {
                  const categoryMatch = searchLower
                    ? cat.categoryName.value.toLowerCase().includes(searchLower)
                    : false
                  const filteredModels = cat.models
                    .map((m) => {
                      const modelMatch = searchLower
                        ? m.modelName.value.toLowerCase().includes(searchLower)
                        : false
                      const anyProductSerialMatch = searchLower
                        ? m.products.some((p) =>
                            p.serialNumber?.value
                              ?.toLowerCase()
                              .includes(searchLower)
                          )
                        : false
                      const productsForDisplay = !searchLower
                        ? m.products
                        : modelMatch || categoryMatch
                          ? m.products
                          : anyProductSerialMatch
                            ? m.products.filter((p) =>
                                p.serialNumber?.value
                                  ?.toLowerCase()
                                  .includes(searchLower)
                              )
                            : []
                      return {
                        ...m,
                        _displayProducts: productsForDisplay,
                        _showModel:
                          modelMatch ||
                          categoryMatch ||
                          productsForDisplay.length > 0
                      }
                    })
                    .filter(
                      (m) => m._showModel && m._displayProducts.length > 0
                    )
                  return {
                    ...cat,
                    _models: filteredModels,
                    _showCategory:
                      categoryMatch || filteredModels.length > 0 || !searchLower
                  }
                })
                .filter((cat) => cat._showCategory)

              if (filteredCategories.length === 0) {
                return (
                  <p className="text-muted-foreground py-4 text-center text-sm">
                    Nenhum produto encontrado.
                  </p>
                )
              }

              return (
                <Accordion type="multiple" className="space-y-2">
                  {filteredCategories.map((cat) => (
                    <AccordionItem
                      key={cat.categoryId as string}
                      value={cat.categoryId as string}
                    >
                      <AccordionTrigger>
                        <div className="flex w-full items-center justify-between pr-2">
                          <span className="truncate font-medium">
                            {cat.categoryName.value}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {(() => {
                              const filteredCount =
                                (cat as any)._models?.reduce(
                                  (acc: number, m: any) =>
                                    acc + m._displayProducts.length,
                                  0
                                ) ?? 0
                              return `${filteredCount} produto${filteredCount === 1 ? '' : 's'}`
                            })()}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Accordion type="multiple" className="ml-2 space-y-2">
                          {cat._models.map((m) => (
                            <AccordionItem
                              key={m.id as string}
                              value={m.id as string}
                            >
                              <AccordionTrigger>
                                <div className="flex w-full items-center justify-between gap-4 pr-2">
                                  <div className="flex min-w-0 items-center gap-3">
                                    {m.imageUrl ? (
                                      <img
                                        src={m.imageUrl.value}
                                        alt={m.modelName.value}
                                        className="ring-border h-24 w-24 rounded object-cover ring-1"
                                      />
                                    ) : (
                                      <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded text-[10px]">
                                        Img
                                      </div>
                                    )}
                                    <span className="truncate font-medium">
                                      {m.modelName.value}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground shrink-0 text-xs">
                                    {
                                      m._displayProducts.filter((p) =>
                                        form
                                          .watch('productIds')
                                          .includes(p.id as string)
                                      ).length
                                    }
                                    /{m._displayProducts.length}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-1">
                                  {m._displayProducts.map((p) => {
                                    const selected = form
                                      .watch('productIds')
                                      .includes(p.id as string)
                                    const priceRaw: any = (p.salePrice as any)
                                      .value
                                    const priceNum =
                                      typeof priceRaw === 'string'
                                        ? parseFloat(priceRaw)
                                        : Number(priceRaw)
                                    return (
                                      <li key={p.id as string}>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleProduct(p.id as string)
                                          }
                                          className={cn(
                                            'hover:bg-muted flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs',
                                            selected && 'bg-muted'
                                          )}
                                        >
                                          <span className="flex flex-1 items-center justify-between pr-2">
                                            <span className="truncate">
                                              {p.serialNumber?.value ||
                                                'Sem serial'}
                                            </span>
                                            <span className="text-muted-foreground mx-2 flex flex-1 items-center">
                                              <span className="border-border w-full border-t border-dashed" />
                                            </span>
                                            <span className="font-medium">
                                              {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                              }).format(priceNum)}
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
                                      const current =
                                        form.getValues('productIds')
                                      const toAdd = m._displayProducts
                                        .map((p) => p.id as string)
                                        .filter((id) => !current.includes(id))
                                      form.setValue(
                                        'productIds',
                                        [...current, ...toAdd],
                                        {
                                          shouldValidate: true
                                        }
                                      )
                                    }}
                                  >
                                    Selecionar todos
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                      const current =
                                        form.getValues('productIds')
                                      const remaining = current.filter(
                                        (id) =>
                                          !m._displayProducts
                                            .map((p) => p.id as string)
                                            .includes(id)
                                      )
                                      form.setValue('productIds', remaining, {
                                        shouldValidate: true
                                      })
                                    }}
                                  >
                                    Limpar grupo
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
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
                  {form.watch('productIds').length} produto(s) selecionado(s)
                </span>
                <span className="text-xs font-medium">
                  Total:{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(totalAmount)}
                </span>
              </div>
              <Button
                type="button"
                onClick={() => setShowProductsDialog(false)}
              >
                Concluir seleção
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
