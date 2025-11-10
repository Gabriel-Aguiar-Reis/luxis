'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useMemo } from 'react'
import { useGetSale } from '@/hooks/use-sales'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SaleReceiptPDF } from '@/components/sales/sale-receipt-pdf/sale-receipt-pdf'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { useRouter } from '@/lib/i18n/navigation'
import { PhoneNumberUtil } from 'google-libphonenumber'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[800px] w-full items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">Carregando visualização...</p>
      </div>
    )
  }
)

function PreviewContent() {
  const searchParams = useSearchParams()
  const saleId = searchParams.get('saleId')

  const router = useRouter()

  const phoneUtil = PhoneNumberUtil.getInstance()

  const { data: sale, isLoading } = useGetSale(saleId || '')

  const pdfDocument = useMemo(() => {
    if (!sale) return null
    return <SaleReceiptPDF sale={sale} phoneUtil={phoneUtil} />
  }, [sale])

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[800px] w-full" />
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Venda não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Não foi possível carregar os dados da venda.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
                <BreadcrumbLink onClick={() => router.push('/my-space')}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push('/my-space/sales')}>
                  Vendas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() =>
                    router.push(
                      '/my-space/sales/new/confirmation?saleId=' + sale.id
                    )
                  }
                >
                  Confirmação
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Preview do Comprovante</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="container mx-auto space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Preview do Comprovante</h1>
          <p className="text-muted-foreground text-sm">Venda ID: {sale.id}</p>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <PDFViewer width="100%" height="800px" showToolbar={true}>
            {pdfDocument || <></>}
          </PDFViewer>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-muted-foreground text-sm">
            💡 <strong>Dica:</strong> Esta é uma visualização em tempo real.
            Você pode editar o componente{' '}
            <code className="bg-background rounded px-1 py-0.5">
              sale-receipt-pdf.tsx
            </code>{' '}
            e as mudanças aparecerão automaticamente aqui (após salvar o
            arquivo).
          </p>
        </div>
      </div>
    </>
  )
}

export default function ReceiptPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto space-y-4 p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[800px] w-full" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  )
}
