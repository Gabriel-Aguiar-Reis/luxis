import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FieldLabel } from '@/components/ui/field'
import { useGetUsers } from '@/hooks/use-users'
import { useGetInventoryById } from '@/hooks/use-inventory'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ChevronsUpDown, Square, SquareCheck } from 'lucide-react'
import { GetInventoryByIdProduct } from '@/lib/api-types'
import { useState } from 'react'
import { CreateReturnDto } from '@/hooks/use-returns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useTranslations } from 'next-intl'

const returnSchema = z.object({
  resellerId: z.string().trim().min(1, 'Selecione um revendedor'),
  items: z
    .array(z.string().trim().min(1))
    .min(1, 'Selecione ao menos um produto')
})

type ReturnFormValues = z.infer<typeof returnSchema>

export function ReturnCreateDialog({
  isOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (dto: CreateReturnDto) => void
}) {
  const t = useTranslations('ReturnCreateDialog')
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      resellerId: '',
      items: []
    }
  })

  const [openFrom, setOpenFrom] = React.useState(false)
  const [_openTo, _setOpenTo] = React.useState(false)
  const [openProduct, setOpenProduct] = React.useState(false)

  const resellerId = useWatch({ control, name: 'resellerId' })
  const items = useWatch({ control, name: 'items' }) ?? []

  const { data: users } = useGetUsers()
  const resellers = React.useMemo(
    () => users?.filter((u: any) => u.role === 'RESELLER') || [],
    [users]
  )

  // Carrega apenas o inventário do revendedor selecionado
  const { data: inventory } = useGetInventoryById(resellerId || '')

  const selectedInventory = React.useMemo(() => {
    if (!resellerId || !inventory) return undefined
    if (Array.isArray(inventory)) return undefined
    return inventory
  }, [resellerId, inventory])

  // Monta productsWithModel igual ao transfer-create-dialog
  const productsWithModel = React.useMemo(() => {
    if (
      !selectedInventory ||
      !selectedInventory.products ||
      !selectedInventory.productModels
    )
      return []

    // Criar um map de modelId -> productModel para facilitar a busca
    const modelMap = new Map(
      selectedInventory.productModels.map((model) => [model.id, model])
    )

    return selectedInventory.products.map((p: GetInventoryByIdProduct) => {
      const model = modelMap.get(p.modelId)
      return {
        id: p.id,
        label: model?.name?.value || p.id,
        serialNumber: p.serialNumber.value
      }
    })
  }, [selectedInventory])

  const selectedProducts = React.useMemo(() => {
    if (!items || !productsWithModel) return []
    return productsWithModel.filter((p: any) => items.includes(p.id))
  }, [items, productsWithModel])

  const [searchFromValue, setSearchFromValue] = useState('')
  const [_searchToValue, _setSearchToValue] = useState('')
  const [searchProductValue, setSearchProductValue] = useState('')

  const onSubmit = (data: ReturnFormValues) => {
    const dto: CreateReturnDto = data
    onCreate(dto)
    onClose()
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Revendedor */}
              <div className="space-y-2">
                <FieldLabel>{t('reseller')}</FieldLabel>
                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFrom}
                      className="w-full justify-between"
                    >
                      {resellerId
                        ? selectedInventory?.resellerName
                        : t('selectReseller')}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder={t('searchReseller')}
                        value={searchFromValue}
                        onValueChange={setSearchFromValue}
                      />
                      <CommandList>
                        <CommandEmpty>{t('noResellersFound')}</CommandEmpty>
                        <CommandGroup>
                          {resellers
                            .filter((reseller) => {
                              if (!searchFromValue) return true
                              const name =
                                `${reseller.name?.value || ''} ${reseller.surname?.value || ''}`.toLowerCase()
                              return name.includes(
                                searchFromValue.toLowerCase()
                              )
                            })
                            .map((reseller) => (
                              <CommandItem
                                className="flex justify-between"
                                key={reseller.id}
                                value={reseller.id}
                                onSelect={(value) => {
                                  setValue('resellerId', value, {
                                    shouldValidate: true
                                  })
                                  setValue('items', [], {
                                    shouldValidate: true
                                  })
                                  setOpenFrom(false)
                                  setSearchFromValue('')
                                }}
                              >
                                {`${reseller.name?.value} ${reseller.surname?.value}` ||
                                  reseller.id}
                                {resellerId === reseller.id ? (
                                  <SquareCheck className={'h-4 w-4'} />
                                ) : (
                                  <Square className={'h-4 w-4'} />
                                )}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.resellerId && (
                  <p className="text-destructive text-sm">
                    {errors.resellerId.message}
                  </p>
                )}
              </div>
              {/* Produtos */}
              <div className="space-y-2 sm:col-span-2">
                <FieldLabel>{t('products')}</FieldLabel>
                <Popover open={openProduct} onOpenChange={setOpenProduct}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProduct}
                      className="w-full justify-between"
                      disabled={
                        !resellerId ||
                        !selectedInventory ||
                        selectedInventory.products.length === 0
                      }
                    >
                      {items && items.length > 0
                        ? t('selectedProductsCount', { count: items.length })
                        : t('selectProducts')}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder={t('searchProduct')}
                        value={searchProductValue}
                        onValueChange={setSearchProductValue}
                      />
                      <CommandList>
                        <CommandEmpty>{t('noProductsFound')}</CommandEmpty>
                        <CommandGroup>
                          {productsWithModel
                            .filter((product) => {
                              if (!searchProductValue) return true
                              const label =
                                `${product.serialNumber} - ${product.label}`.toLowerCase()
                              return label.includes(
                                searchProductValue.toLowerCase()
                              )
                            })
                            .map((product: any) => {
                              const checked = items?.includes(product.id)
                              return (
                                <CommandItem
                                  key={product.id}
                                  value={product.id}
                                  className="flex justify-between"
                                  onSelect={() => {
                                    let newItems = [...items]
                                    if (checked) {
                                      newItems = newItems.filter(
                                        (id) => id !== product.id
                                      )
                                    } else {
                                      newItems.push(product.id)
                                    }
                                    setValue('items', newItems, {
                                      shouldValidate: true
                                    })
                                  }}
                                >
                                  {`${product.serialNumber} - ${product.label}`}
                                  {checked ? (
                                    <SquareCheck className={'h-4 w-4'} />
                                  ) : (
                                    <Square className={'h-4 w-4'} />
                                  )}
                                </CommandItem>
                              )
                            })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.items && (
                  <p className="text-destructive text-sm">
                    {errors.items.message}
                  </p>
                )}
                {/* Lista de produtos selecionados */}
                {selectedProducts.length > 0 && (
                  <div className="text-muted-foreground mt-2 text-sm">
                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-50">
                              {t('selectedProductsTitle')}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{`${product.serialNumber} - ${product.label}`}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <ButtonGroup className="w-full justify-end sm:w-fit">
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto"
                >
                  {t('cancel')}
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {t('createReturn')}
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
