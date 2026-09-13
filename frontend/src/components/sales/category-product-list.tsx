import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { FilteredCategory } from '@/components/sales/product-filter'
import { ModelProductList } from '@/components/sales/model-product-list'
import { ChevronDown } from 'lucide-react'

type CategoryProductListProps = {
  category: FilteredCategory
  selectedProductIds: string[]
  toggleProduct: (productId: string) => void
  updateSelectedProducts: (productIds: string[]) => void
  currencyFormatter: Intl.NumberFormat
  noSerialLabel: string
  productCountLabel: (count: number) => string
  selectAllLabel: string
  clearGroupLabel: string
}

export function CategoryProductList({
  category,
  selectedProductIds,
  toggleProduct,
  updateSelectedProducts,
  currencyFormatter,
  noSerialLabel,
  productCountLabel,
  selectAllLabel,
  clearGroupLabel
}: CategoryProductListProps) {
  const productCount = category._models.reduce(
    (count, model) => count + model._displayProducts.length,
    0
  )

  return (
    <Collapsible className="not-last:border-b">
      <CollapsibleTrigger className="group/collapsible-trigger relative flex w-full items-center justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50">
        <div className="flex w-full items-center justify-between pr-2">
          <span className="truncate font-medium">
            {category.categoryName.value}
          </span>
          <span className="text-muted-foreground text-xs">
            {productCountLabel(productCount)}
          </span>
        </div>
        <ChevronDown className="text-muted-foreground size-4 shrink-0 transition-transform group-data-[state=open]/collapsible-trigger:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden pb-2.5">
        <div className="flex flex-col space-y-2">
          {category._models.map((model) => (
            <ModelProductList
              key={model.id as string}
              model={model}
              selectedProductIds={selectedProductIds}
              toggleProduct={toggleProduct}
              updateSelectedProducts={updateSelectedProducts}
              currencyFormatter={currencyFormatter}
              noSerialLabel={noSerialLabel}
              selectAllLabel={selectAllLabel}
              clearGroupLabel={clearGroupLabel}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
