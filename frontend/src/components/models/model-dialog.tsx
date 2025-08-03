'use client'

import { useState, useEffect } from 'react'
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
import { ProductModel } from '@/lib/api-types'
import { UpdateModelDto } from '@/hooks/use-product-models'

async function fileFromUrl(url: string, fileName?: string): Promise<File> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Não foi possível baixar a imagem da URL')
  const blob = await response.blob()
  const name = fileName || url.split('/').pop() || 'image.jpg'
  return new File([blob], name, { type: blob.type })
}

type ModelDialogProps = {
  model?: ProductModel
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateModelDto) => void | Promise<void>
}

export function ModelDialog({
  model,
  isOpen,
  onClose,
  onSave
}: ModelDialogProps) {
  const [formData, setFormData] = useState<{
    name: string
    categoryId: string
    suggestedPrice: string
    description?: string
    photo?: string // base64
    photoUrl?: string
    photoFile?: File // para preview
  }>({
    name: model?.name.value || '',
    categoryId: model?.categoryId || '',
    suggestedPrice: model?.suggestedPrice.value || '',
    description: model?.description?.value || '',
    photo: undefined,
    photoUrl:
      typeof model?.photoUrl === 'string'
        ? model?.photoUrl
        : model?.photoUrl?.value || '',
    photoFile: undefined
  })
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false)
  const initialFormData = {
    name: model?.name.value || '',
    categoryId: model?.categoryId || '',
    suggestedPrice: model?.suggestedPrice.value || '',
    description: model?.description?.value || '',
    photo: undefined,
    photoUrl:
      typeof model?.photoUrl === 'string'
        ? model?.photoUrl
        : model?.photoUrl?.value || '',
    photoFile: undefined
  }
  const [photoError, setPhotoError] = useState<string | null>(null)

  // Atualiza o formData quando model ou isOpen mudam
  useEffect(() => {
    if (isOpen && model) {
      setFormData({
        name: model?.name.value || '',
        categoryId: model?.categoryId || '',
        suggestedPrice: model?.suggestedPrice.value || '',
        description: model?.description?.value || '',
        photo: undefined,
        photoUrl:
          typeof model?.photoUrl === 'string'
            ? model?.photoUrl
            : model?.photoUrl?.value || '',
        photoFile: undefined
      })
    }
  }, [model, isOpen])
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target
    if (type === 'file' && files && files.length > 0) {
      const file = files[0]
      const base64 = await fileToBase64(file)
      setFormData({
        ...formData,
        photo: base64,
        photoFile: file,
        photoUrl: '' // Limpa photoUrl se um arquivo for selecionado
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
        ...(name === 'photoUrl' && value
          ? { photo: undefined, photoFile: undefined }
          : {})
      })
    }
  }

  // Função para popular o campo photo a partir da photoUrl
  const handlePhotoFromUrl = async () => {
    if (!formData.photoUrl) return
    setIsLoadingPhoto(true)
    setPhotoError(null)
    try {
      const file = await fileFromUrl(formData.photoUrl)
      const base64 = await fileToBase64(file)
      setFormData((prev) => ({
        ...prev,
        photo: base64,
        photoFile: file,
        photoUrl: ''
      }))
    } catch (err) {
      setPhotoError(
        'Erro ao baixar imagem da URL. Verifique se a URL é válida e permite download.'
      )
    } finally {
      setIsLoadingPhoto(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: model?.name.value || '',
      categoryId: model?.categoryId || '',
      suggestedPrice: model?.suggestedPrice.value || '',
      description: model?.description?.value || '',
      photo: undefined,
      photoUrl:
        typeof model?.photoUrl === 'string'
          ? model?.photoUrl
          : model?.photoUrl?.value || '',
      photoFile: undefined
    })
    onClose()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validação: não permitir ambos photo e photoUrl
    if (formData.photo && formData.photoUrl) {
      setPhotoError(
        'Escolha apenas uma opção: enviar arquivo ou informar URL da imagem.'
      )
      return
    }
    setPhotoError(null)
    // Só envie photo se for uma imagem nova (base64), não se for a mesma da url original
    const currentPhotoUrl =
      typeof model?.photoUrl === 'string'
        ? model.photoUrl
        : model?.photoUrl?.value
    const isNewPhoto = !!formData.photo && formData.photo !== currentPhotoUrl
    const dto: UpdateModelDto = {
      name: formData.name,
      categoryId: formData.categoryId,
      suggestedPrice: formData.suggestedPrice,
      description: formData.description,
      ...(isNewPhoto ? { photo: formData.photo } : {}),
      // photoUrl só se não houver upload novo
      ...(!isNewPhoto && formData.photoUrl
        ? { photoUrl: formData.photoUrl }
        : {})
    }
    if (model?.id) {
      await onSave(model.id, dto)
      onClose()
    }
  }

  if (!model) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Modelo de Produto</DialogTitle>
            <DialogDescription>
              Edite os detalhes do modelo selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria *</Label>
              <Input
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suggestedPrice">Preço Sugerido (R$) *</Label>
              <Input
                id="suggestedPrice"
                name="suggestedPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.suggestedPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
              />
            </div>
            {/* Campo para upload de imagem ou URL e preview */}
            <div className="grid grid-cols-2 items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Imagem (upload)</Label>
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  disabled={!!formData.photoUrl}
                />
                {formData.photoFile && (
                  <span className="text-muted-foreground text-xs">
                    {formData.photoFile.name}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoUrl">Imagem (URL)</Label>
                <div className="flex gap-2">
                  <Input
                    id="photoUrl"
                    name="photoUrl"
                    type="text"
                    placeholder="https://..."
                    value={formData.photoUrl || ''}
                    onChange={handleChange}
                    disabled={!!formData.photoFile}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handlePhotoFromUrl}
                    disabled={
                      !formData.photoUrl ||
                      !!formData.photoFile ||
                      isLoadingPhoto
                    }
                    title="Baixar imagem da URL para o campo de upload"
                  >
                    {isLoadingPhoto ? 'Baixando...' : 'Usar como arquivo'}
                  </Button>
                </div>
              </div>
            </div>
            {/* Preview da imagem */}
            <div className="mt-2 flex justify-center">
              {formData.photoFile ? (
                <img
                  src={URL.createObjectURL(formData.photoFile)}
                  alt="Preview da imagem"
                  className="max-h-32 rounded border"
                />
              ) : formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Preview da imagem"
                  className="max-h-32 rounded border"
                />
              ) : model.photoUrl ? (
                <img
                  src={
                    typeof model.photoUrl === 'string'
                      ? model.photoUrl
                      : model.photoUrl.value
                  }
                  alt="Preview da imagem"
                  className="max-h-32 rounded border"
                />
              ) : null}
            </div>
            {photoError && (
              <div className="mt-2 text-sm text-red-500">{photoError}</div>
            )}
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
