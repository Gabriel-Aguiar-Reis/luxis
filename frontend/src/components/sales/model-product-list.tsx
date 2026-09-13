import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import {
  AvailableProduct,
  FilteredModel
} from '@/components/sales/product-filter'
import { ProductOption } from '@/components/sales/product-option'
import { ChevronDown } from 'lucide-react'

type ModelProductListProps = {
  model: FilteredModel
  selectedProductIds: string[]
  toggleProduct: (productId: string) => void
  updateSelectedProducts: (productIds: string[]) => void
  currencyFormatter: Intl.NumberFormat
  noSerialLabel: string
  selectAllLabel: string
  clearGroupLabel: string
}

export function ModelProductList({
  model,
  selectedProductIds,
  toggleProduct,
  updateSelectedProducts,
  currencyFormatter,
  noSerialLabel,
  selectAllLabel,
  clearGroupLabel
}: ModelProductListProps) {
  const productIds = model._displayProducts.map(
    (product) => product.id as string
  )
  const selectedCount = productIds.filter((id) =>
    selectedProductIds.includes(id)
  ).length

  const selectAll = () => {
    const selected = new Set(selectedProductIds)
    productIds.forEach((id) => selected.add(id))
    updateSelectedProducts(Array.from(selected))
  }

  const clearGroup = () => {
    const productIdSet = new Set(productIds)
    updateSelectedProducts(
      selectedProductIds.filter((id) => !productIdSet.has(id))
    )
  }

  return (
    <Collapsible className="not-last:border-b">
      <CollapsibleTrigger className="group/collapsible-trigger relative flex w-full items-center justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50">
        <div className="flex w-4/5 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {model.imageUrl ? (
              <img
                src={model.imageUrl.value}
                alt={model.modelName.value}
                className="ring-border h-12 w-12 rounded object-cover ring-1"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded text-[10px]">
                Img
              </div>
            )}
            <span className="truncate font-medium">
              {model.modelName.value}
            </span>
          </div>
          <span className="text-muted-foreground shrink-0 text-xs">
            {selectedCount}/{productIds.length}
          </span>
        </div>
        <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]/collapsible-trigger:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden pb-2.5">
        <ul className="space-y-1">
          {model._displayProducts.map((product: AvailableProduct) => (
            <ProductOption
              key={product.id as string}
              product={product}
              selected={selectedProductIds.includes(product.id as string)}
              onToggle={() => toggleProduct(product.id as string)}
              currencyFormatter={currencyFormatter}
              noSerialLabel={noSerialLabel}
            />
          ))}
        </ul>
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-6 px-2 text-xs"
            onClick={selectAll}
          >
            {selectAllLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-6 px-2 text-xs"
            onClick={clearGroup}
          >
            {clearGroupLabel}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
