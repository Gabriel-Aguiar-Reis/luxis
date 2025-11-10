import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
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
import { GetInventoryByIdProduct, User } from '@/lib/api-types'
import { GetOneReturnResponse, UpdateReturnDto } from '@/hooks/use-returns'

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
  const { handleSubmit, reset, setValue, watch } = useForm<UpdateReturnDto>({
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

  function useMultipleInventories(resellers: User[]) {
    return resellers.map((reseller) => ({
      resellerId: reseller.id,
      query: useGetInventoryById(reseller.id)
    }))
  }

  const inventories = useMultipleInventories(resellers)

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

  const resellerId = watch('resellerId')
  const items = watch('items')

  const [openReseller, setOpenReseller] = useState(false)
  const [openProducts, setOpenProducts] = useState(false)
  const [searchResellerValue, setSearchResellerValue] = useState('')
  const [searchProductValue, setSearchProductValue] = useState('')

  const selectedInventory = React.useMemo(() => {
    if (!resellerId) return undefined
    const inv = inventories.find((i) => i.resellerId === resellerId)
    if (!inv || !inv.query.data || Array.isArray(inv.query.data))
      return undefined
    return inv.query.data
  }, [resellerId, inventories])

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

  const onSubmit = (data: UpdateReturnDto) => {
    if (ret) {
      onSave(ret.id, data)
    }
    onClose()
    reset()
  }

  if (!ret) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Devolução</DialogTitle>
            <DialogDescription>
              Edite os detalhes da devolução selecionada.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Revendedor */}
              <div className="col-span-2 space-y-2">
                <Label>Revendedor</Label>
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
                        : 'Selecionar revendedor'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar revendedor..."
                        value={searchResellerValue}
                        onValueChange={setSearchResellerValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          Nenhum revendedor encontrado.
                        </CommandEmpty>
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
                                  setValue('resellerId', value)
                                  setValue('items', [])
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
              </div>
              {/* Produtos */}
              <div className="col-span-2 space-y-2">
                <Label>Produtos</Label>
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
                        ? `${items.length} produto(s) selecionado(s)`
                        : 'Selecionar produtos'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar produto..."
                        value={searchProductValue}
                        onValueChange={setSearchProductValue}
                      />
                      <CommandList>
                        <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
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
                                  const current = watch('items') || []
                                  if (current.includes(product.id)) {
                                    setValue(
                                      'items',
                                      current.filter(
                                        (id: string) => id !== product.id
                                      )
                                    )
                                  } else {
                                    setValue('items', [...current, product.id])
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
              </div>
            </div>
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
