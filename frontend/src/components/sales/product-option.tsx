import { Square, SquareCheck } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { AvailableProduct } from '@/components/sales/product-filter'

type ProductOptionProps = {
  product: AvailableProduct
  selected: boolean
  onToggle: () => void
  currencyFormatter: Intl.NumberFormat
  noSerialLabel: string
}

export function ProductOption({
  product,
  selected,
  onToggle,
  currencyFormatter,
  noSerialLabel
}: ProductOptionProps) {
  return (
    <li>
      <Button
        type="button"
        variant="ghost"
        onClick={onToggle}
        className={cn(
          'hover:bg-muted flex h-auto w-full items-center justify-between rounded px-2 py-1 text-left text-xs',
          selected && 'bg-muted'
        )}
      >
        <span className="flex min-w-0 flex-1 items-center justify-between pr-2">
          <span className="truncate">
            {product.serialNumber?.value || noSerialLabel}
          </span>
          <span className="text-muted-foreground mx-2 flex flex-1 items-center">
            <span className="border-border w-full border-t border-dashed" />
          </span>
          <span className="font-medium">
            {currencyFormatter.format(Number(product.salePrice.value))}
          </span>
        </span>
        {selected ? (
          <SquareCheck className="h-3 w-3" />
        ) : (
          <Square className="h-3 w-3" />
        )}
      </Button>
    </li>
  )
}
