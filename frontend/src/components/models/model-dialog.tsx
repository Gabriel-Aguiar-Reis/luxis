'use client'

import { useState, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
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
import { Category, ProductModel, ProductModelStatus } from '@/lib/api-types'
import { UpdateModelDto } from '@/hooks/use-product-models'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectLabel,
  SelectItem,
  SelectGroup
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload'

type ModelDialogProps = {
  model?: ProductModel
  categories: Category[]
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateModelDto) => void | Promise<void>
}

const statusOptions = [
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'USED', label: 'Usado' },
  { value: 'ARCHIVED', label: 'Arquivado' }
]

export function ModelDialog({
  model,
  categories,
  isOpen,
  onClose,
  onSave
}: ModelDialogProps) {
  const [formData, setFormData] = useState<{
    name: string
    categoryId: string
    suggestedPrice: string
    description?: string
    status?: ProductModelStatus
    photoUrl?: string
    photoFile?: File // for file upload
  }>({
    name: model?.name.value || '',
    categoryId: model?.categoryId || '',
    suggestedPrice: model?.suggestedPrice.value || '',
    description: model?.description?.value || '',
    status: model?.status || 'ACTIVE',
    photoUrl:
      typeof model?.photoUrl === 'string'
        ? model?.photoUrl
        : model?.photoUrl?.value || '',
    photoFile: undefined
  })
  const { upload, loading: uploadingImage } = useCloudinaryUpload()
  const [photoError, setPhotoError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && model) {
      setFormData({
        name: model?.name.value || '',
        categoryId: model?.categoryId || '',
        suggestedPrice: model?.suggestedPrice.value || '',
        description: model?.description?.value || '',
        status: model?.status || 'ACTIVE',
        photoUrl:
          typeof model?.photoUrl === 'string'
            ? model?.photoUrl
            : model?.photoUrl?.value || '',
        photoFile: undefined
      })
    }
  }, [model, isOpen])

  async function compressImage(file: File): Promise<File> {
    const options = {
      maxWidthOrHeight: 500,
      initialQuality: 0.7,
      useWebWorker: true
    }
    const compressed = await imageCompression(file, options)
    return compressed
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files, value } = e.target

    if (type === 'file') {
      if (files && files.length > 0) {
        const file = files[0]
        try {
          const compressedFile = await compressImage(file)
          setFormData({
            ...formData,
            photoFile: compressedFile,
            photoUrl: ''
          })
        } catch (err) {
          setPhotoError(
            'Erro ao comprimir imagem: ' +
              (err instanceof Error ? err.message : String(err))
          )
        }
      }
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

  const handleClose = () => {
    setFormData({
      name: model?.name.value || '',
      categoryId: model?.categoryId || '',
      suggestedPrice: model?.suggestedPrice.value || '',
      description: model?.description?.value || '',
      status: model?.status || 'ACTIVE',
      photoUrl:
        typeof model?.photoUrl === 'string'
          ? model?.photoUrl
          : model?.photoUrl?.value || '',
      photoFile: undefined
    })
    if (uploadingImage) {
      setPhotoError('Upload de imagem em andamento. Aguarde.')
      return
    }
    setPhotoError(null)
    onClose()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.photoFile && formData.photoUrl) {
      setPhotoError(
        'Escolha apenas uma opção: enviar arquivo ou informar URL da imagem.'
      )
      return
    }
    setPhotoError(null)
    let photoUrl = formData.photoUrl
    // Se houver arquivo novo, faz compressão/crop antes do upload
    if (formData.photoFile) {
      try {
        photoUrl = await upload(formData.photoFile)
      } catch (err: any) {
        setPhotoError('Erro ao fazer upload da imagem: ' + (err.message || ''))
        return
      }
    }
    const dto: UpdateModelDto = {
      name: formData.name,
      categoryId: formData.categoryId,
      suggestedPrice: formData.suggestedPrice,
      description: formData.description,
      ...(photoUrl ? { photoUrl } : {})
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
            <div className="flex justify-between gap-4">
              <div className="w-full space-y-2">
                <Label htmlFor="suggestedPrice">Preço Sugerido (R$) *</Label>
                <Input
                  id="suggestedPrice"
                  name="suggestedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full"
                  value={formData.suggestedPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: value
                    }))
                  }
                  defaultValue={formData.categoryId || ''}
                  disabled
                >
                  <SelectTrigger>
                    <SelectGroup>
                      <SelectLabel>
                        {(() => {
                          const selected = categories.find(
                            (c) => c.id === formData.categoryId
                          )
                          if (!selected) return ''
                          if (typeof selected.name === 'string')
                            return selected.name
                          return selected.name?.value ?? ''
                        })()}
                      </SelectLabel>
                    </SelectGroup>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {typeof category.name === 'string'
                          ? category.name
                          : (category.name?.value ?? '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="w-full space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  className="w-full"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value.toUpperCase() as ProductModelStatus
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectGroup>
                      <SelectLabel>
                        {(() => {
                          const selected = statusOptions.find(
                            (s) => s.value === formData.status
                          )
                          return selected
                            ? selected.label
                            : 'Selecione o status'
                        })()}
                      </SelectLabel>
                    </SelectGroup>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="USED">Usado</SelectItem>
                    <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-4 space-y-2">
              <div className="w-[70%] space-y-2">
                <Tabs defaultValue="url">
                  <TabsList>
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Arquivo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url">
                    <div className="w-full space-y-2">
                      <Label htmlFor="photoUrl">Imagem (URL)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="photoUrl"
                          name="photoUrl"
                          type="text"
                          placeholder="https://..."
                          value={formData.photoUrl || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="upload">
                    <div className="w-full space-y-2">
                      <Label htmlFor="photo">Imagem (Arquivo)</Label>
                      <Input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="h-30 w-30 mt-2 flex items-center justify-center">
                {formData.photoFile ? (
                  <img
                    src={URL.createObjectURL(formData.photoFile)}
                    alt="Preview da imagem"
                    className="h-30 w-30 rounded border object-cover object-center"
                  />
                ) : formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Preview da imagem"
                    className="h-30 w-30 rounded border object-cover object-center"
                  />
                ) : model.photoUrl ? (
                  <img
                    src={
                      typeof model.photoUrl === 'string'
                        ? model.photoUrl
                        : model.photoUrl.value
                    }
                    alt="Preview da imagem"
                    className="h-30 w-30 rounded border object-cover object-center"
                  />
                ) : null}
              </div>
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
