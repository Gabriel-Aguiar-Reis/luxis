import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const categorySchema = z.object({
  name: z.string().min(2, 'Nome obrigatório')
})

type CategoryForm = z.infer<typeof categorySchema>

import { Category } from '@/lib/api-types'

interface NewCategoryDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (category: Category) => void
  onCreateCategory: (name: string) => Promise<Category>
}

export function NewCategoryDialog({
  open,
  onClose,
  onAdd,
  onCreateCategory
}: NewCategoryDialogProps) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema)
  })

  const onSubmit = async (data: CategoryForm) => {
    setLoading(true)
    try {
      const newCategory = await onCreateCategory(data.name)
      onAdd(newCategory)
      reset()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Nome da categoria"
            {...register('name')}
            disabled={loading}
            autoFocus
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
