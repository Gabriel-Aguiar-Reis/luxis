'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
  useGetSale,
  useConfirmSale,
  GetOneSaleResponse
} from '@/hooks/use-sales'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Loader2,
  ShoppingCart,
  User,
  Calendar,
  CreditCard
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SaleStatus } from '@/lib/api-types'
import { HTMLProps } from 'react'
import { PhoneNumberUtil } from 'google-libphonenumber'

interface SaleConfirmationCardProps {
  sale: GetOneSaleResponse | undefined
  phoneUtil: PhoneNumberUtil
  isRefetching?: boolean
}

export function SaleConfirmationCard({
  sale,
  phoneUtil
}: SaleConfirmationCardProps) {
  const queryClient = useQueryClient()
  const { mutate: confirmSale, isPending: isConfirming } =
    useConfirmSale(queryClient)

  if (!sale) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const handleConfirmSale = () => {
    confirmSale(sale.id)
  }

  // Extrai dados da venda
  const saleDate = sale.saleDate || new Date().toISOString()
  const customerName = sale.customerName?.value || 'Cliente não informado'
  const customerPhone = sale.customerPhone?.value || ''
  const paymentMethod = sale.paymentMethod || 'CASH'
  const status = sale.status || 'PENDING'
  const totalAmount = sale.totalAmount?.value || 0
  const products = sale.products || []

  const paymentMethodLabels: Record<string, string> = {
    CASH: 'Dinheiro',
    PIX: 'PIX',
    DEBIT: 'Débito',
    CREDIT: 'Crédito',
    EXCHANGE: 'Troca'
  }

  const statusMap: Record<
    SaleStatus,
    { label: string; className: HTMLProps<HTMLElement>['className'] }
  > = {
    INSTALLMENTS_OVERDUE: {
      label: 'Parcelas em atraso',
      className: 'bg-badge-3 text-badge-text-3'
    },
    CANCELLED: {
      label: 'Cancelado',
      className: 'bg-badge-6 text-badge-text-6'
    },
    INSTALLMENTS_PAID: {
      label: 'Venda Paga',
      className: 'bg-badge-4 text-badge-text-4'
    },
    PENDING: {
      label: 'Pendente',
      className: 'bg-badge-5 text-badge-text-5'
    },
    INSTALLMENTS_PENDING: {
      label: 'Pgto. Pendente',
      className: 'bg-badge-5 text-badge-text-5'
    },
    CONFIRMED: {
      label: 'Confirmado',
      className: 'bg-badge-2 text-badge-text-2'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Venda Criada com Sucesso!
            </CardTitle>
            <CardDescription className="mt-2">
              A venda foi registrada no sistema. Revise as informações abaixo.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusMap[status].className} variant="default">
              {statusMap[status].label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações da venda */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Data da Venda</p>
              <p className="text-muted-foreground text-sm">
                {format(new Date(saleDate), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Cliente</p>
              <p className="text-muted-foreground text-sm">{customerName}</p>
              {customerPhone && (
                <p className="text-muted-foreground text-xs">
                  {phoneUtil.formatInOriginalFormat(
                    phoneUtil.parseAndKeepRawInput(customerPhone, 'BR')
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Método de Pagamento</p>
              <p className="text-muted-foreground text-sm">
                {paymentMethodLabels[paymentMethod]}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShoppingCart className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Total de Produtos</p>
              <p className="text-muted-foreground text-sm">
                {products.length} {products.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Lista de produtos */}
        {products.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Produtos</h3>
            <div className="rounded-md border">
              <div className="max-h-60 overflow-auto">
                {products.map((product: any, index: number) => {
                  const serialNumber =
                    product.serialNumber?.value || product.serialNumber || 'N/A'
                  const modelName =
                    product.modelName?.value || product.modelName || 'Produto'
                  const price =
                    product.salePrice?.value || product.salePrice || 0

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b p-3 last:border-b-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{modelName}</p>
                        <p className="text-muted-foreground text-xs">
                          S/N: {serialNumber}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(Number(price))}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <span className="text-lg font-semibold">Total da Venda</span>
          <span className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(Number(totalAmount))}
          </span>
        </div>

        {/* Botão de confirmar venda */}
        {status === 'PENDING' && (
          <div className="flex justify-end">
            <Button
              onClick={handleConfirmSale}
              size="lg"
              className="min-w-[200px]"
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Confirmar Venda
                </>
              )}
            </Button>
          </div>
        )}

        {/* Mensagem de sucesso após confirmação */}
        {(status === 'INSTALLMENTS_PAID' ||
          status === 'INSTALLMENTS_PENDING') && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  Venda confirmada com sucesso!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  {status === 'INSTALLMENTS_PAID'
                    ? 'Pagamento à vista confirmado.'
                    : 'Aguardando pagamento das parcelas.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
