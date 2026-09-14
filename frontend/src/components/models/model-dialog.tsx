'use client'

import { useState, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/ui/field'
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
import { useTranslations } from 'next-intl'

type ModelDialogProps = {
  model?: ProductModel
  categories: Category[]
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateModelDto) => void | Promise<void>
}

export function ModelDialog({
  model,
  categories,
  isOpen,
  onClose,
  onSave
}: ModelDialogProps) {
  const t = useTranslations('ModelDialog')
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const statusOptions = [
    { value: 'ACTIVE', label: t('statuses.ACTIVE') },
    { value: 'USED', label: t('statuses.USED') },
    { value: 'ARCHIVED', label: t('statuses.ARCHIVED') }
  ]

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
            t('compressImageError') +
              ': ' +
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
      setPhotoError(t('uploadInProgress'))
      return
    }
    setPhotoError(null)
    onClose()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (formData.photoFile && formData.photoUrl) {
        setPhotoError(t('selectSingleImageSource'))
        return
      }
      setPhotoError(null)
      let photoUrl = formData.photoUrl
      // Se houver arquivo novo, faz compressão/crop antes do upload
      if (formData.photoFile) {
        try {
          photoUrl = await upload(formData.photoFile)
        } catch (err: any) {
          setPhotoError(`${t('uploadImageError')}: ${err.message || ''}`)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!model) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {t('title')}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {t('description')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4 sm:gap-4">
            <div className="space-y-2">
              <FieldLabel htmlFor="name" className="text-xs sm:text-sm">
                {t('name')}
              </FieldLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="w-full space-y-2">
                <FieldLabel
                  htmlFor="suggestedPrice"
                  className="text-xs sm:text-sm"
                >
                  {t('suggestedPrice')}
                </FieldLabel>
                <Input
                  id="suggestedPrice"
                  name="suggestedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full text-xs sm:text-sm"
                  value={formData.suggestedPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full space-y-2 sm:w-auto">
                <FieldLabel htmlFor="categoryId" className="text-xs sm:text-sm">
                  {t('category')}
                </FieldLabel>
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
                  <SelectTrigger className="text-xs sm:text-sm">
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
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-xs sm:text-sm"
                      >
                        {typeof category.name === 'string'
                          ? category.name
                          : (category.name?.value ?? '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="w-full space-y-2">
                <FieldLabel
                  htmlFor="description"
                  className="text-xs sm:text-sm"
                >
                  {t('descriptionField')}
                </FieldLabel>
                <Input
                  id="description"
                  name="description"
                  className="w-full text-xs sm:text-sm"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full space-y-2 sm:w-auto">
                <FieldLabel htmlFor="status" className="text-xs sm:text-sm">
                  {t('status')}
                </FieldLabel>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value.toUpperCase() as ProductModelStatus
                    }))
                  }
                >
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectGroup>
                      <SelectLabel>
                        {(() => {
                          const selected = statusOptions.find(
                            (s) => s.value === formData.status
                          )
                          return selected ? selected.label : t('selectStatus')
                        })()}
                      </SelectLabel>
                    </SelectGroup>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE" className="text-xs sm:text-sm">
                      {t('statuses.ACTIVE')}
                    </SelectItem>
                    <SelectItem value="USED" className="text-xs sm:text-sm">
                      {t('statuses.USED')}
                    </SelectItem>
                    <SelectItem value="ARCHIVED" className="text-xs sm:text-sm">
                      {t('statuses.ARCHIVED')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="w-full space-y-2 sm:w-[70%]">
                <Tabs defaultValue="url">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url" className="text-xs sm:text-sm">
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="text-xs sm:text-sm">
                      {t('fileTab')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url">
                    <div className="w-full space-y-2">
                      <FieldLabel
                        htmlFor="photoUrl"
                        className="text-xs sm:text-sm"
                      >
                        {t('imageUrl')}
                      </FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          id="photoUrl"
                          name="photoUrl"
                          type="text"
                          placeholder={t('imageUrlPlaceholder')}
                          value={formData.photoUrl || ''}
                          onChange={handleChange}
                          className="text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="upload">
                    <div className="w-full space-y-2">
                      <FieldLabel
                        htmlFor="photo"
                        className="text-xs sm:text-sm"
                      >
                        {t('imageFile')}
                      </FieldLabel>
                      <Input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="text-xs sm:text-sm"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28 md:h-30 md:w-30">
                {formData.photoFile ? (
                  <img
                    src={URL.createObjectURL(formData.photoFile)}
                    alt={t('imagePreviewAlt')}
                    className="h-full w-full rounded border object-cover object-center"
                  />
                ) : formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={t('imagePreviewAlt')}
                    className="h-full w-full rounded border object-cover object-center"
                  />
                ) : model.photoUrl ? (
                  <img
                    src={
                      typeof model.photoUrl === 'string'
                        ? model.photoUrl
                        : model.photoUrl.value
                    }
                    alt={t('imagePreviewAlt')}
                    className="h-full w-full rounded border object-cover object-center"
                  />
                ) : null}
              </div>
            </div>

            {photoError && (
              <div className="mt-2 text-xs text-red-500 sm:text-sm">
                {photoError}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <ButtonGroup className="w-full justify-end sm:w-fit">
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full text-xs sm:w-auto sm:text-sm"
                >
                  {t('cancel')}
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full text-xs sm:w-auto sm:text-sm"
                >
                  {t('saveChanges')}
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
