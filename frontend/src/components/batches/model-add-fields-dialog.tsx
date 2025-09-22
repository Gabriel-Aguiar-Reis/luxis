import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProductModel, ProductModelStatus } from '@/lib/api-types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ModelAddFieldsProps = {
  dto: {
    name: string
    quantity?: number
    unitCost?: string
    salePrice?: string
  }
  onAdd: (data: {
    quantity: number
    unitCost: string
    salePrice: string
  }) => void
  onCancel: () => void
  showModelAddDialog: boolean
  setShowModelAddDialog: (show: boolean) => void
  setSelectedModel: (model: ProductModel | null) => void
  isEdit?: boolean
}

export function ModelAddFields({
  dto,
  onAdd,
  onCancel,
  showModelAddDialog,
  setShowModelAddDialog,
  setSelectedModel,
  isEdit
}: ModelAddFieldsProps) {
  const [quantity, setQuantity] = React.useState<number>(dto.quantity || 1)
  const [unitCost, setUnitCost] = React.useState(dto.unitCost || '')
  const [salePrice, setSalePrice] = React.useState(dto.salePrice || '')
  const [error, setError] = React.useState<string | null>(null)

  function parseBRLToNumericString(value: string): string {
    // Se já está no formato 100.00, retorna como está
    if (/^\d+(\.\d{1,2})?$/.test(value)) {
      return Number(value).toFixed(2)
    }
    // Se está no formato brasileiro (com vírgula), converte
    let clean = value.replace(/[^\d,]/g, '')
    clean = clean.replace(',', '.')
    if (!clean) return '0.00'
    const num = Number(clean)
    return num.toFixed(2)
  }

  function handleAdd() {
    if (!quantity || quantity < 1) {
      setError('Quantidade obrigatória')
      return
    }
    if (!unitCost) {
      setError('Custo unitário obrigatório')
      return
    }
    if (!salePrice) {
      setError('Preço de venda obrigatório')
      return
    }
    setError(null)
    onAdd({
      quantity,
      unitCost: parseBRLToNumericString(unitCost),
      salePrice: parseBRLToNumericString(salePrice)
    })
  }

  return (
    <Dialog
      open={showModelAddDialog}
      onOpenChange={(open) => {
        setShowModelAddDialog(open)
        if (!open) setSelectedModel(null)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edite modelo do lote' : 'Adicionar modelo ao lote'}
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>{dto.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium leading-none">
                Quantidade (un)
              </label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Qtd"
                step={1}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium leading-none">
                Custo Unitário R$
              </label>
              <Input
                type="number"
                inputMode="decimal"
                value={unitCost}
                onChange={(e) => {
                  setUnitCost(e.target.value)
                }}
                placeholder="123,45"
                maxLength={10}
                step={0.01}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium leading-none">
                Preço de Venda R$
              </label>
              <Input
                type="number"
                inputMode="decimal"
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(e.target.value)
                }}
                placeholder="123,45"
                maxLength={10}
                step={0.01}
              />
            </div>
          </CardContent>
          {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
        </Card>
        <DialogFooter>
          <Button type="button" size="sm" onClick={handleAdd}>
            Adicionar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
