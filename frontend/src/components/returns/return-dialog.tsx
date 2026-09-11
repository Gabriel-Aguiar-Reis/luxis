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
import { Button } from '@/components/ui/button'
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
import { useGetUsers } from '@/hooks/use-users'
import { useGetInventoryById } from '@/hooks/use-inventory'
import * as React from 'react'
import { useState } from 'react'
import { GetInventoryByIdProduct } from '@/lib/api-types'
import { GetOneReturnResponse, UpdateReturnDto } from '@/hooks/use-returns'
import { useTranslations } from 'next-intl'

const returnSchema = z.object({
  resellerId: z.string().trim().min(1, 'Selecione um revendedor'),
  items: z
    .array(z.string().trim().min(1))
    .min(1, 'Selecione ao menos um produto')
})

type ReturnFormValues = z.infer<typeof returnSchema>

type ReturnDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, dto: UpdateReturnDto) => void | Promise<void>
  ret: GetOneReturnResponse | null
}

export function ReturnDialog({
  isOpen,
  onClose,
  onSave,
  ret
}: ReturnDialogProps) {
  const t = useTranslations('ReturnDialog')
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      items: ret?.products.map((p) => p.productId) || [],
      resellerId: ret?.resellerId || ''
    }
  })

  const { data: users } = useGetUsers()
  const resellers = React.useMemo(
    () => users?.filter((u: any) => u.role === 'RESELLER') || [],
    [users]
  )

  React.useEffect(() => {
    if (ret) {
      setValue('items', ret.products.map((p) => p.productId) || [])
      setValue('resellerId', ret.resellerId || '')
    } else {
      reset({
        items: [],
        resellerId: ''
      })
    }
  }, [ret, setValue, reset])

  const resellerId = useWatch({ control, name: 'resellerId' })
  const items = useWatch({ control, name: 'items' }) ?? []

  const [openReseller, setOpenReseller] = useState(false)
  const [openProducts, setOpenProducts] = useState(false)
  const [searchResellerValue, setSearchResellerValue] = useState('')
  const [searchProductValue, setSearchProductValue] = useState('')

  // Buscar inventário apenas do revendedor selecionado
  const { data: selectedInventoryData } = useGetInventoryById(resellerId || '')

  const selectedInventory = React.useMemo(() => {
    if (
      !resellerId ||
      !selectedInventoryData ||
      Array.isArray(selectedInventoryData)
    ) {
      return undefined
    }
    return selectedInventoryData
  }, [resellerId, selectedInventoryData])

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

  const handleClose = () => {
    reset({
      items: [],
      resellerId: ''
    })
    onClose()
  }

  const onSubmit = (data: ReturnFormValues) => {
    const dto: UpdateReturnDto = data
    if (ret) {
      onSave(ret.id, dto)
    }
    onClose()
    reset()
  }

  if (!ret) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Revendedor */}
              <div className="col-span-2 space-y-2">
                <FieldLabel>{t('reseller')}</FieldLabel>
                <Popover open={openReseller} onOpenChange={setOpenReseller}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openReseller}
                      className="w-full justify-between"
                    >
                      {resellerId
                        ? resellers.find((r) => r.id === resellerId)?.name
                            ?.value || resellerId
                        : t('selectReseller')}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder={t('searchReseller')}
                        value={searchResellerValue}
                        onValueChange={setSearchResellerValue}
                      />
                      <CommandList>
                        <CommandEmpty>{t('noResellersFound')}</CommandEmpty>
                        <CommandGroup>
                          {resellers
                            .filter((reseller) => {
                              if (!searchResellerValue) return true
                              const name =
                                `${reseller.name?.value || ''} ${reseller.surname?.value || ''}`.toLowerCase()
                              return name.includes(
                                searchResellerValue.toLowerCase()
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
                                  setOpenReseller(false)
                                  setSearchResellerValue('')
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
              <div className="col-span-2 space-y-2">
                <FieldLabel>{t('products')}</FieldLabel>
                <Popover open={openProducts} onOpenChange={setOpenProducts}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProducts}
                      className="w-full justify-between"
                      disabled={!resellerId || productsWithModel.length === 0}
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
                            .map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.id}
                                className="flex justify-between"
                                onSelect={() => {
                                  const current = items
                                  if (current.includes(product.id)) {
                                    setValue(
                                      'items',
                                      current.filter(
                                        (id: string) => id !== product.id
                                      ),
                                      { shouldValidate: true }
                                    )
                                  } else {
                                    setValue(
                                      'items',
                                      [...current, product.id],
                                      {
                                        shouldValidate: true
                                      }
                                    )
                                  }
                                }}
                              >
                                {`${product.serialNumber} - ${product.label}`}
                                {items && items.includes(product.id) ? (
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
                {errors.items && (
                  <p className="text-destructive text-sm">
                    {errors.items.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button type="submit">{t('saveChanges')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
