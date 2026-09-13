import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { SaleFormValues } from '@/components/sales/sale-create-form'
import { GetAvailableCategoriesDto } from '@/lib/api-types'
import { useEffect, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { CategoryProductList } from '@/components/sales/category-product-list'
import { filterProductCategories } from '@/components/sales/product-filter'

type AddProductDialogProps = {
  showProductsDialog: boolean
  setShowProductsDialog: (show: boolean) => void
  categories: GetAvailableCategoriesDto
  searchProduct: string
  setSearchProduct: (search: string) => void
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
  const locale = useLocale()
  const t = useTranslations('AddProductDialog')

  useEffect(() => {
    if (!showProductsDialog) {
      setSearchProduct('')
    }
  }, [showProductsDialog, setSearchProduct])

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }),
    [locale]
  )
  const selectedProductIds =
    useWatch({ control: form.control, name: 'productIds' }) ?? []
  const filteredCategories = useMemo(
    () => filterProductCategories(categories, searchProduct),
    [categories, searchProduct]
  )

  const updateSelectedProducts = (productIds: string[]) => {
    form.setValue('productIds', productIds, { shouldValidate: true })
  }

  return (
    <Dialog open={showProductsDialog} onOpenChange={setShowProductsDialog}>
      <DialogContent className="w-[95vw] min-w-0 p-0 sm:min-w-130 sm:max-w-230!">
        <div className="flex h-[70vh] flex-col">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-4">
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchProduct}
              onChange={(event) => setSearchProduct(event.target.value)}
              className="mb-4 h-9 text-sm"
            />
          </div>
          <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted min-h-0 max-h-none flex-1 overflow-y-auto px-6 pb-4">
            {categories.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {t('noProductsAvailable')}
              </p>
            ) : filteredCategories.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {t('noProductsFound')}
              </p>
            ) : (
              <div className="flex flex-col space-y-2">
                {filteredCategories.map((category) => (
                  <CategoryProductList
                    key={category.categoryId as string}
                    category={category}
                    selectedProductIds={selectedProductIds}
                    toggleProduct={toggleProduct}
                    updateSelectedProducts={updateSelectedProducts}
                    currencyFormatter={currencyFormatter}
                    noSerialLabel={t('noSerial')}
                    productCountLabel={(count) => t('productCount', { count })}
                    selectAllLabel={t('selectAll')}
                    clearGroupLabel={t('clearGroup')}
                  />
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="px-6 pt-4 pb-6">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">
                  {t('selectedProducts', { count: selectedProductIds.length })}
                </span>
                <span className="text-xs font-medium">
                  {t('total')}: {currencyFormatter.format(totalAmount)}
                </span>
              </div>
              <Button
                type="button"
                onClick={() => setShowProductsDialog(false)}
              >
                {t('finishSelection')}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
