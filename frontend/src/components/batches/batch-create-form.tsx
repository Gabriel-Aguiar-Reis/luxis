'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  ChevronsUpDown,
  Square,
  SquareCheck,
  Plus,
  Trash2,
  PenBox
} from 'lucide-react'
import { SupplierCreateDialog } from '@/components/suppliers/supplier-create-dialog'
import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { useCreateSupplier, useGetSuppliers } from '@/hooks/use-suppliers'
import { useGetModels } from '@/hooks/use-product-models'
import { useGetCategories } from '@/hooks/use-categories'
import { NewModelDialog } from '@/components/models/new-model-dialog'
import { useQueryClient } from '@tanstack/react-query'

import { ProductModel } from '@/lib/api-types'
import { ModelAddFields } from './model-add-fields-dialog'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'
import { useState } from 'react'
import { CreateBatchDto, useCreateBatch } from '@/hooks/use-batches'
import { useRouter } from '@/lib/i18n/navigation'

export function BatchCreateForm() {
  const batchSchema = z.object({
    supplier: z.string().min(1, 'Fornecedor obrigatório'),
    arrivalDate: z.string().min(1, 'Data obrigatória'),
    entries: z.array(
      z.object({
        modelId: z.optional(z.string()),
        modelName: z.optional(z.string()),
        categoryId: z.optional(z.string()),
        quantity: z.number().min(1, 'Quantidade obrigatória'),
        unitCost: z.string().min(1, 'Custo unitário obrigatório'),
        salePrice: z.string().min(1, 'Preço de venda obrigatório'),
        photoUrl: z.optional(z.string())
      })
    )
  })

  type BatchFormValues = z.infer<typeof batchSchema>

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      supplier: '',
      arrivalDate: '',
      entries: []
    }
  })

  const { data: suppliers } = useGetSuppliers()
  const [openSupplier, setOpenSupplier] = useState(false)
  const [searchSupplier, setSearchSupplier] = useState('')
  const [showNewSupplierDialog, setShowNewSupplierDialog] = useState(false)

  const { mutateAsync: createSupplier } = useCreateSupplier(useQueryClient())
  const { mutateAsync: createBatch } = useCreateBatch(useQueryClient())

  // MODELS
  const { data: models } = useGetModels()
  const { data: categories } = useGetCategories()
  const [openModel, setOpenModel] = useState(false)
  const [searchModel, setSearchModel] = useState('')
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null)
  // Estado para controlar edição de entry
  const [editingEntryIdx, setEditingEntryIdx] = useState<number | undefined>(
    undefined
  )
  const [showModelAddDialog, setShowModelAddDialog] = useState(false)
  const [showNewModelDialog, setShowNewModelDialog] = useState(false)

  const [step, setStep] = useState(1)

  const router = useRouter()

  function onSubmit(data: BatchFormValues) {
    const dto: CreateBatchDto = {
      supplierId: data.supplier,
      arrivalDate: new Date(data.arrivalDate).toISOString(),
      entries: data.entries.map((e) => ({
        modelId: e.modelId,
        modelName: e.modelName,
        categoryId: e.categoryId,
        quantity: e.quantity,
        unitCost: e.unitCost,
        salePrice: e.salePrice,
        photoUrl: e.photoUrl
      }))
    }
    createBatch(dto)
    router.push('/home/batches')
  }

  function handleCreateSupplier(dto: { name: string; phone: string }) {
    createSupplier(dto)
  }

  function handleAddModel(
    model: ProductModel,
    quantity: number,
    unitCost: string,
    salePrice: string
  ) {
    const exists = form.getValues('entries').some((e) => e.modelId === model.id)
    if (!exists) {
      form.setValue('entries', [
        ...form.getValues('entries'),
        {
          modelId: model.id,
          modelName: model.name.value,
          categoryId: model.categoryId,
          quantity: quantity,
          unitCost: unitCost,
          salePrice: salePrice,
          photoUrl: model.photoUrl?.value || ''
        }
      ])
    }
  }

  return (
    <>
      <Card className="max-h-[80vh] min-w-[50%] max-w-[90%] self-center overflow-auto">
        <CardHeader>
          <CardTitle className="mb-4 text-2xl">Criar Lote</CardTitle>
          <CardDescription className="mb-6">
            Preencha o formulário abaixo para criar um novo lote de produtos.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => {
                      const selectedSupplier = suppliers?.find(
                        (s) => s.id === field.value
                      )
                      return (
                        <FormItem>
                          <FormLabel>Fornecedor</FormLabel>
                          <FormControl>
                            <Popover
                              open={openSupplier}
                              onOpenChange={setOpenSupplier}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openSupplier}
                                  className="w-full justify-between"
                                >
                                  {selectedSupplier &&
                                  selectedSupplier.name?.value
                                    ? selectedSupplier.name.value
                                    : 'Selecionar fornecedor'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command shouldFilter={false}>
                                  <CommandInput
                                    placeholder="Buscar fornecedor..."
                                    value={searchSupplier}
                                    onValueChange={setSearchSupplier}
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      Nenhum fornecedor encontrado.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {suppliers &&
                                        suppliers
                                          .filter((supplier) => {
                                            if (!searchSupplier) return true
                                            return supplier.name?.value
                                              ?.toLowerCase()
                                              .includes(
                                                searchSupplier.toLowerCase()
                                              )
                                          })
                                          .map((supplier) => (
                                            <CommandItem
                                              key={supplier.id}
                                              value={supplier.id}
                                              className="flex justify-between"
                                              onSelect={() => {
                                                field.onChange(supplier.id)
                                                setOpenSupplier(false)
                                                setSearchSupplier('')
                                              }}
                                            >
                                              {supplier.name?.value}
                                              {field.value === supplier.id ? (
                                                <SquareCheck className="h-4 w-4" />
                                              ) : (
                                                <Square className="h-4 w-4" />
                                              )}
                                            </CommandItem>
                                          ))}
                                      <CommandItem
                                        value="__new__"
                                        className="text-primary mt-2 flex items-center"
                                        onSelect={() => {
                                          setShowNewSupplierDialog(true)
                                        }}
                                      >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar novo fornecedor
                                      </CommandItem>
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                          {/* O diálogo de novo fornecedor será renderizado fora do form principal */}
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="arrivalDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de chegada</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-40 justify-between font-normal"
                              >
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : 'Selecionar data'}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                locale={ptBR}
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  field.onChange(date ? date.toISOString() : '')
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={
                        !form.watch('supplier') || !form.watch('arrivalDate')
                      }
                    >
                      Próximo
                    </Button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  {/* MODELS COMBOBOX */}
                  <div className="space-y-2">
                    <FormLabel>Modelos</FormLabel>
                    <Popover open={openModel} onOpenChange={setOpenModel}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openModel}
                          className="w-full justify-between"
                        >
                          Selecionar modelo
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Buscar modelo..."
                            value={searchModel}
                            onValueChange={setSearchModel}
                          />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum modelo encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {models &&
                                models
                                  .filter((model) => {
                                    if (!searchModel) return true
                                    return model.name.value
                                      .toLowerCase()
                                      .includes(searchModel.toLowerCase())
                                  })
                                  .map((model) => (
                                    <CommandItem
                                      key={model.id}
                                      value={model.id}
                                      onSelect={() => {
                                        setSelectedModel(model)
                                        setShowModelAddDialog(true)
                                      }}
                                    >
                                      {model.name.value}
                                    </CommandItem>
                                  ))}
                              <CommandItem
                                value="__new__"
                                className="text-primary mt-2 flex items-center"
                                onSelect={() => setShowNewModelDialog(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Criar novo modelo
                              </CommandItem>
                              {/* Dialog para criar novo modelo */}
                              {/* O diálogo de novo modelo será renderizado fora do form principal */}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {selectedModel && (
                      <ModelAddFields
                        dto={{
                          name: selectedModel.name.value,
                          ...(typeof editingEntryIdx === 'number' &&
                          form.getValues('entries')[editingEntryIdx]
                            ? {
                                quantity:
                                  form.getValues('entries')[editingEntryIdx]
                                    .quantity,
                                unitCost:
                                  form.getValues('entries')[editingEntryIdx]
                                    .unitCost,
                                salePrice:
                                  form.getValues('entries')[editingEntryIdx]
                                    .salePrice
                              }
                            : {})
                        }}
                        isEdit={typeof editingEntryIdx === 'number'}
                        onAdd={({ quantity, unitCost, salePrice }) => {
                          if (typeof editingEntryIdx === 'number') {
                            // Edita o item existente
                            const newEntries = [...form.getValues('entries')]
                            newEntries[editingEntryIdx] = {
                              ...newEntries[editingEntryIdx],
                              quantity,
                              unitCost,
                              salePrice
                            }
                            form.setValue('entries', newEntries)
                            setEditingEntryIdx(undefined)
                          } else {
                            handleAddModel(
                              selectedModel,
                              quantity,
                              unitCost,
                              salePrice
                            )
                          }
                          setShowModelAddDialog(false)
                          setSelectedModel(null)
                        }}
                        onCancel={() => {
                          setShowModelAddDialog(false)
                          setSelectedModel(null)
                          setEditingEntryIdx(undefined)
                        }}
                        showModelAddDialog={showModelAddDialog}
                        setShowModelAddDialog={setShowModelAddDialog}
                        setSelectedModel={setSelectedModel}
                      />
                    )}
                    {form.watch('entries').length > 0 && (
                      <div className="mt-6">
                        <h3 className="mb-2 text-lg font-semibold">
                          Modelos adicionados
                        </h3>
                        <div className="relative max-h-64 overflow-auto rounded border">
                          <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                              <TableRow>
                                <TableHead>Modelo</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Qtd</TableHead>
                                <TableHead>Custo unit.</TableHead>
                                <TableHead>Preço venda</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {form.watch('entries').map((entry, idx) => {
                                const model = models?.find(
                                  (m) => m.id === entry.modelId
                                )
                                const category = categories?.find(
                                  (c) => c.id === entry.categoryId
                                )
                                return (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      {entry.modelName || model?.name.value}
                                    </TableCell>
                                    <TableCell>
                                      {category?.name.value || '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {entry.quantity}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      R$ {entry.unitCost.replace('.', ',')}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      R$ {entry.salePrice.replace('.', ',')}
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setShowModelAddDialog(true)
                                          const foundModel = models?.find(
                                            (m) => m.id === entry.modelId
                                          )
                                          if (foundModel) {
                                            setSelectedModel(foundModel)
                                          } else {
                                            setSelectedModel({
                                              id: entry.modelId,
                                              name: { value: entry.modelName },
                                              categoryId: entry.categoryId,
                                              photoUrl: {
                                                value: entry.photoUrl
                                              }
                                            } as ProductModel)
                                          }
                                          setEditingEntryIdx(idx)
                                        }}
                                      >
                                        <PenBox className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const newEntries = [
                                            ...form.getValues('entries')
                                          ]
                                          newEntries.splice(idx, 1)
                                          form.setValue('entries', newEntries)
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Voltar
                    </Button>
                    <Button type="submit">Criar lote</Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* Renderize os diálogos fora do <form> principal para evitar submit acidental */}
      <SupplierCreateDialog
        isOpen={showNewSupplierDialog}
        onClose={() => setShowNewSupplierDialog(false)}
        onCreate={handleCreateSupplier}
      />
      {categories && (
        <NewModelDialog
          open={showNewModelDialog}
          onClose={() => setShowNewModelDialog(false)}
          categories={categories}
          onAdd={(entry) => {
            form.setValue('entries', [...form.getValues('entries'), entry])
            setShowNewModelDialog(false)
          }}
        />
      )}
    </>
  )
}
