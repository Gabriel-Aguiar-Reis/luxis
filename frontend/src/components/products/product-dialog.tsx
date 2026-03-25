'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Product, ProductModel } from '@/lib/api-types'
import { UpdateProductDto } from '@/hooks/use-products'
import { useTranslations } from 'next-intl'

type ProductDialogProps = {
  product: Product | null
  models: ProductModel[]
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateProductDto) => void | Promise<void>
}

export function ProductDialog({
  product,
  models,
  isOpen,
  onClose,
  onSave
}: ProductDialogProps) {
  const t = useTranslations('ProductDialog')
  const [formData, setFormData] = useState<Partial<UpdateProductDto>>({
    unitCost: product?.unitCost.value || '',
    salePrice: product?.salePrice.value || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleClose = () => {
    setFormData({
      unitCost: product?.unitCost.value || '',
      salePrice: product?.salePrice.value || ''
    })
    onClose()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dto = {
      ...formData
    }
    onSave(product!.id, dto)
    onClose()
  }

  if (!product) {
    return
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">{t('serialNumber')}</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={product.serialNumber.value || ''}
                  placeholder={t('serialNumberPlaceholder')}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t('status')}</Label>
                <Select value={formData.status || 'IN_STOCK'} disabled>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_STOCK">
                      {t('statuses.IN_STOCK')}
                    </SelectItem>
                    <SelectItem value="ASSIGNED">
                      {t('statuses.ASSIGNED')}
                    </SelectItem>
                    <SelectItem value="SOLD">{t('statuses.SOLD')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="modelId">{t('model')}</Label>
                <Select value={product.modelId || ''} disabled>
                  <SelectTrigger id="modelId">
                    <SelectValue placeholder={t('selectModel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchId">{t('batch')}</Label>
                <Input
                  id="batchId"
                  name="batchId"
                  value={product.batchId || ''}
                  placeholder={t('batchPlaceholder')}
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unitCost">{t('unitCost')}</Label>
                <Input
                  id="unitCost"
                  name="unitCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitCost || ''}
                  onChange={handleChange}
                  placeholder={t('pricePlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">{t('salePrice')}</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salePrice || ''}
                  onChange={handleChange}
                  placeholder={t('pricePlaceholder')}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button type="submit">{t('saveChanges')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
