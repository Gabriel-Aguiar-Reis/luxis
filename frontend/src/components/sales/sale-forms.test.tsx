import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SaleCreateForm } from '@/components/sales/sale-create-form'
import { SaleDialog } from '@/components/sales/sale-dialog'
import type { InputHTMLAttributes, ReactNode } from 'react'

const {
  pushMock,
  backMock,
  createSaleMock,
  availableProductsMock,
  customersMock,
  authStoreState
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  backMock: vi.fn(),
  createSaleMock: vi.fn(),
  availableProductsMock: {
    data: [
      {
        categoryId: 'cat-1',
        categoryName: { value: 'Categoria A' },
        models: [
          {
            modelId: 'model-1',
            modelName: { value: 'Modelo X' },
            products: [
              {
                id: '11111111-1111-4111-8111-111111111111',
                serialNumber: { value: 'SER-001' },
                salePrice: { value: '100.00' }
              },
              {
                id: '22222222-2222-4222-8222-222222222222',
                serialNumber: { value: 'SER-002' },
                salePrice: { value: '150.00' }
              }
            ]
          }
        ]
      }
    ]
  },
  customersMock: [
    {
      id: '33333333-3333-4333-8333-333333333333',
      name: { value: 'Cliente Teste' }
    }
  ],
  authStoreState: {
    user: {
      role: 'ADMIN' as const
    }
  }
}))

vi.mock('@/lib/i18n/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    back: backMock
  })
}))

vi.mock('@/stores/use-auth-store', () => ({
  useAuthStore: () => authStoreState
}))

vi.mock('next-intl', () => ({
  useLocale: () => 'pt',
  useTranslations: (namespace?: string) => (key: string, values?: Record<string, unknown>) => {
    if (namespace === 'SaleCreateForm' && key === 'selectedCount' && values?.count) {
      return `Selecionados: ${values.count}`
    }
    if (namespace === 'SaleEditDialog' && key === 'selectedProducts' && values?.count) {
      return `Produtos selecionados: ${values.count}`
    }
    if (namespace === 'SaleEditDialog' && key === 'groupCount') {
      return `${values?.modelName} (${values?.count})`
    }
    if (namespace === 'SaleCreateForm' && key === 'groupCount') {
      return `${values?.modelName} (${values?.count})`
    }
    return key
  }
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQueryClient: () => ({})
  }
})

vi.mock('@/hooks/use-sales', () => ({
  useGetAvailableProductsToSell: () => ({
    data: availableProductsMock
  }),
  useCreateSale: () => ({
    mutate: createSaleMock,
    isPending: false
  })
}))

vi.mock('@/hooks/use-customers', () => ({
  useGetCustomers: () => ({
    data: customersMock
  }),
  useCreateCustomer: () => ({
    mutate: vi.fn()
  })
}))

vi.mock('@/components/sales/add-customer-dialog', () => ({
  AddCustomerDialog: () => null
}))

vi.mock('@/components/sales/add-product-dialog', () => ({
  AddProductDialog: ({ toggleProduct }: { toggleProduct: (id: string) => void }) => (
    <button
      type="button"
      onClick={() => toggleProduct('11111111-1111-4111-8111-111111111111')}
    >
      Adicionar produto de teste
    </button>
  )
}))

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>
}))

vi.mock('@/components/ui/command', () => ({
  Command: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandEmpty: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CommandGroup: ({ children, heading }: { children: ReactNode; heading?: string }) => (
    <div>
      {heading ? <div>{heading}</div> : null}
      {children}
    </div>
  ),
  CommandInput: ({ onValueChange, ...props }: InputHTMLAttributes<HTMLInputElement> & { onValueChange?: (value: string) => void }) => (
    <input
      {...props}
      onChange={(event) => onValueChange?.(event.target.value)}
    />
  ),
  CommandItem: ({ children, onSelect, value }: { children: ReactNode; onSelect?: (value: string) => void; value: string }) => (
    <button type="button" onClick={() => onSelect?.(value)}>
      {children}
    </button>
  ),
  CommandList: ({ children }: { children: ReactNode }) => <div>{children}</div>
}))

vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: { onSelect?: (date: Date) => void }) => (
    <button type="button" onClick={() => onSelect?.(new Date('2026-03-24T00:00:00.000Z'))}>
      Selecionar data de teste
    </button>
  )
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>
}))

function renderWithQueryClient(ui: React.ReactNode) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('sales forms', () => {
  beforeEach(() => {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
    pushMock.mockReset()
    backMock.mockReset()
    createSaleMock.mockReset()
  })

  it('submete criacao de venda e redireciona para a confirmacao', async () => {
    createSaleMock.mockImplementation((_payload, options) => {
      options?.onSuccess?.({ id: 'sale-123' })
    })

    renderWithQueryClient(<SaleCreateForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Cliente Teste' }))
    fireEvent.click(screen.getByRole('button', { name: /Adicionar produto de teste/i }))
    fireEvent.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => {
      expect(createSaleMock).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: '33333333-3333-4333-8333-333333333333',
          productIds: ['11111111-1111-4111-8111-111111111111'],
          paymentMethod: 'CASH',
          numberInstallments: 1,
          installmentsInterval: 0
        }),
        expect.any(Object)
      )
    })

    expect(pushMock).toHaveBeenCalledWith('/home/sales/new/confirmation?saleId=sale-123')
  })

  it('salva edicao da venda com os produtos selecionados', async () => {
    const onSave = vi.fn()

    renderWithQueryClient(
      <SaleDialog
        isOpen
        onClose={vi.fn()}
        onSave={onSave}
        sale={{
          id: 'sale-1',
          products: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              serialNumber: { value: 'SER-001' },
              salePrice: { value: '100.00' }
            }
          ]
        } as any}
      />
    )

    fireEvent.click(screen.getAllByRole('button', { name: /Modelo X/i })[0])
    fireEvent.click(screen.getByRole('button', { name: 'saveChanges' }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('sale-1', {
        productIds: []
      })
    })
  })
})
