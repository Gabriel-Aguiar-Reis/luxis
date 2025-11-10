'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Category } from '@/lib/api-types'
import {
  CreateCategoryDto,
  GetAllCategoriesResponse,
  useCreateCategory
} from '@/hooks/use-categories'
import { useQueryClient } from '@tanstack/react-query'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { NewCategoryDialog } from '@/components/categories/new-category-dialog'

import { v4 as uuidv4 } from 'uuid'

export type NewModelDialogProps = {
  open: boolean
  onClose: () => void
  categories: GetAllCategoriesResponse
  onAdd: (entry: any) => void
}

export function NewModelDialog({
  open,
  onClose,
  categories,
  onAdd
}: NewModelDialogProps) {
  const queryClient = useQueryClient()

  const [modelName, setModelName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [suggestedPrice, setSuggestedPrice] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { upload, loading: uploadingImage } = useCloudinaryUpload()

  // CATEGORY
  const [openCategory, setOpenCategory] = useState(false)
  const [searchCategory, setSearchCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)

  const { mutateAsync: createCategory } = useCreateCategory(queryClient)

  async function handleCreateCategory(data: CreateCategoryDto) {
    const newCategory = await createCategory(data)
    return {
      ...newCategory,
      status: (newCategory as Category).status || 'ACTIVE'
    } as Category
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      try {
        const url = await upload(file)
        setPhotoUrl(url)
      } catch (err) {
        setError('Erro ao fazer upload da imagem')
      }
    }
  }

  function handleSave() {
    if (!modelName || !categoryId || !suggestedPrice) {
      setError('Preencha todos os campos obrigatórios')
      return
    }
    const dto = {
      modelId: uuidv4(),
      modelName,
      categoryId,
      quantity: 1,
      unitCost: suggestedPrice,
      salePrice: suggestedPrice,
      photoUrl:
        photoUrl !== ''
          ? photoUrl
          : 'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis'
    }
    console.log(dto)
    onAdd(dto)
    setModelName('')
    setCategoryId('')
    setSelectedCategory(null)
    setSuggestedPrice('')
    setPhotoUrl('')
    setPhotoFile(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Modelo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Nome do modelo *</Label>
            <Input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCategory}
                  className="w-full justify-between"
                >
                  {selectedCategory
                    ? selectedCategory.name.value
                    : 'Selecionar categoria'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar categoria..."
                    value={searchCategory}
                    onValueChange={setSearchCategory}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                    <CommandGroup>
                      {categories &&
                        categories
                          .filter((category) => {
                            if (!searchCategory) return true
                            return category.name.value
                              .toLowerCase()
                              .includes(searchCategory.toLowerCase())
                          })
                          .map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.id}
                              onSelect={() => {
                                setSelectedCategory(category)
                                setCategoryId(category.id)
                                setOpenCategory(false)
                                setSearchCategory('')
                              }}
                            >
                              {category.name.value}
                            </CommandItem>
                          ))}
                      <CommandItem
                        value="__new__"
                        className="text-primary mt-2 flex items-center"
                        onSelect={() => setShowNewCategoryDialog(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Criar nova categoria
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <NewCategoryDialog
              open={showNewCategoryDialog}
              onClose={() => setShowNewCategoryDialog(false)}
              onAdd={(category) => {
                setSelectedCategory(category)
                setShowNewCategoryDialog(false)
              }}
              onCreateCategory={async (name: string) => {
                return handleCreateCategory({ name })
              }}
            />
          </div>
          <div>
            <Label>Preço sugerido *</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={suggestedPrice}
              onChange={(e) => {
                setSuggestedPrice(e.target.value)
              }}
              placeholder="123,45"
              maxLength={10}
              step={0.01}
            />
          </div>
          <div>
            <Label>Imagem (opcional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploadingImage}
            />
            {photoUrl && (
              <img
                src={photoUrl}
                alt="preview"
                className="mt-2 h-16 w-16 rounded object-cover"
              />
            )}
          </div>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={uploadingImage}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
