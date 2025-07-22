'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { toast } from 'sonner'
import { Upload } from 'lucide-react'
import { GetAllProductModels, Product, ProductModel } from '@/lib/api-types'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'

type ProductStatus = Product['status']
type GetAllProductModelsResponse =
  GetAllProductModels['responses']['200']['content']['application/json']

type ProductDialogProps = {
  product: Product | null
  models: ProductModel[]
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void | Promise<void>
}

export function ProductDialog({
  product,
  models,
  isOpen,
  onClose,
  onSave
}: ProductDialogProps) {
  const isNewProduct = !product
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      serialNumber: { value: '' },
      modelId: '',
      batchId: '',
      unitCost: { value: '' },
      salePrice: { value: '' },
      status: 'IN_STOCK'
    }
  )

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData(product)
      } else {
        setFormData({
          serialNumber: { value: '' },
          modelId: '',
          batchId: '',
          unitCost: { value: '' },
          salePrice: { value: '' },
          status: 'IN_STOCK'
        })
      }
    }
  }, [isOpen, product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.serialNumber ||
      !formData.modelId ||
      !formData.unitCost ||
      !formData.salePrice
    ) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const productData: Product = {
      id: formData.id || `temp-${Date.now()}`,
      serialNumber: formData.serialNumber,
      modelId: formData.modelId,
      batchId: formData.batchId || '',
      unitCost: formData.unitCost,
      salePrice: formData.salePrice,
      status: (formData.status as ProductStatus) || 'IN_STOCK'
    }
    await onSave(productData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isNewProduct ? 'Adicionar Produto' : 'Editar Produto'}
            </DialogTitle>
            <DialogDescription>
              {isNewProduct
                ? 'Preencha os detalhes para adicionar um novo produto ao catálogo.'
                : 'Edite os detalhes do produto selecionado.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Número de Série */}
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Nº de Série</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber?.value || ''}
                  onChange={handleChange}
                  placeholder="SN-0001"
                  required
                  disabled
                />
              </div>
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'IN_STOCK'}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  disabled
                >
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
              {/* Modelo */}
              <div className="space-y-2">
                <Label htmlFor="modelId">Modelo</Label>
                <Select
                  value={formData.modelId || ''}
                  onValueChange={(value) =>
                    handleSelectChange('modelId', value)
                  }
                  disabled
                >
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
              {/* Lote (opcional) */}
              <div className="space-y-2">
                <Label htmlFor="batchId">Lote</Label>
                <Input
                  id="batchId"
                  name="batchId"
                  value={formData.batchId || ''}
                  onChange={handleChange}
                  placeholder="ID do lote"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Custo Unitário */}
              <div className="space-y-2">
                <Label htmlFor="unitCost">Custo Unitário (R$) *</Label>
                <Input
                  id="unitCost"
                  name="unitCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitCost?.value || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              {/* Preço de Venda */}
              <div className="space-y-2">
                <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salePrice?.value || ''}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isNewProduct ? 'Adicionar Produto' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
