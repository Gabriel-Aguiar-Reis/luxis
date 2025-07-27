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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Edite os detalhes do produto selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Nº de Série</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={product.serialNumber.value || ''}
                  placeholder="SN-0001"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status || 'IN_STOCK'} disabled>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_STOCK">Em Estoque</SelectItem>
                    <SelectItem value="ASSIGNED">Atribuído</SelectItem>
                    <SelectItem value="SOLD">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelId">Modelo</Label>
                <Select value={product.modelId || ''} disabled>
                  <SelectTrigger id="modelId">
                    <SelectValue placeholder="Selecione um modelo" />
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
                <Label htmlFor="batchId">Lote</Label>
                <Input
                  id="batchId"
                  name="batchId"
                  value={product.batchId || ''}
                  placeholder="ID do lote"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitCost">Custo Unitário (R$) *</Label>
                <Input
                  id="unitCost"
                  name="unitCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitCost || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salePrice || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
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
  )
}
