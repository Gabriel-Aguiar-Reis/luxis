'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Receipt, Plus, ArrowLeft, Eye } from 'lucide-react'
import { SaleConfirmationCard } from '@/components/sales/sale-confirmation-card'
import { PDFDownloadButton } from '@/components/sales/pdf-download-button'
import { useGetSales } from '@/hooks/use-sales'
import { useRouter } from '@/lib/i18n/navigation'
import { PhoneNumberUtil } from 'google-libphonenumber'

export default function SaleConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [saleId, setSaleId] = useState<string | null>(null)

  const phoneUtil = PhoneNumberUtil.getInstance()

  // Hook deve estar sempre no topo, antes de qualquer return condicional
  const { data: sales } = useGetSales()

  useEffect(() => {
    const id = searchParams.get('saleId')
    if (!id) {
      router.push('/home/sales')
    } else {
      setSaleId(id)
    }
  }, [searchParams, router])

  const handleNewSale = () => {
    router.push('/home/sales/create')
  }

  const handleGoBack = () => {
    router.push('/home/sales')
  }

  const handlePreview = () => {
    router.push(`/home/sales/receipt-preview?saleId=${saleId}`)
  }

  if (!saleId) {
    return null
  }

  const sale = sales?.find((s) => s.id === saleId)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push('/home')}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push('/home/sales')}>
                  Vendas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Confirmação</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="w-full max-w-4xl space-y-6">
          {/* Card de resumo da venda */}
          <SaleConfirmationCard sale={sale} phoneUtil={phoneUtil} />

          {/* Botões de ação */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleNewSale}
              variant="default"
              size="lg"
              className="min-w-[200px]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Criar Nova Venda
            </Button>

            <Button
              onClick={handlePreview}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <Eye className="mr-2 h-5 w-5" />
              Preview do Comprovante
            </Button>

            {sale ? (
              <PDFDownloadButton sale={sale} phoneUtil={phoneUtil} />
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px]"
                disabled
              >
                <Receipt className="mr-2 h-5 w-5" />
                Emitir Resumo de Venda
              </Button>
            )}

            <Button
              onClick={handleGoBack}
              variant="secondary"
              size="lg"
              className="min-w-[200px]"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
