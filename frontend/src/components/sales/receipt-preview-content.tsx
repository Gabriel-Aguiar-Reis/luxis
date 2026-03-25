'use client'

import { useSearchParams } from 'next/navigation'
import { PhoneNumberUtil } from 'google-libphonenumber'
import { useRouter } from '@/lib/i18n/navigation'
import { useGetSale } from '@/hooks/use-sales'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SaleReceiptPDF } from '@/components/sales/sale-receipt-pdf/sale-receipt-pdf'
import { PdfViewerClient } from '@/components/sales/pdf-viewer-client'
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
import { useLocale, useTranslations } from 'next-intl'

export function ReceiptPreviewContent({
  basePath
}: {
  basePath: '/home' | '/my-space'
}) {
  const locale = useLocale()
  const tCommon = useTranslations('Common')
  const tReceipt = useTranslations('ReceiptPreview')
  const tConfirmation = useTranslations('SaleConfirmation')
  const searchParams = useSearchParams()
  const saleId = searchParams.get('saleId')
  const router = useRouter()
  const phoneUtil = PhoneNumberUtil.getInstance()
  const { data: sale, isLoading } = useGetSale(saleId || '')

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
            <CardTitle>{tReceipt('notFoundTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {tReceipt('notFoundDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pdfDocument = (
    <SaleReceiptPDF
      sale={sale}
      phoneUtil={phoneUtil}
      locale={locale}
      labels={{
        title: tReceipt('pdf.title'),
        saleDate: tReceipt('pdf.saleDate'),
        customer: tConfirmation('customer'),
        paymentMethod: tConfirmation('paymentMethod'),
        totalProducts: tConfirmation('totalProducts'),
        item: tConfirmation('item'),
        items: tConfirmation('items'),
        installments: tReceipt('pdf.installments'),
        interval: tReceipt('pdf.interval'),
        days: tReceipt('pdf.days'),
        products: tConfirmation('products'),
        serialNumber: tConfirmation('serialNumber'),
        totalSale: tConfirmation('saleTotal'),
        generatedAt: tReceipt('pdf.generatedAt'),
        at: tReceipt('pdf.at'),
        renderError: tReceipt('pdf.renderError'),
        paymentMethods: {
          CASH: tConfirmation('paymentMethods.CASH'),
          PIX: tConfirmation('paymentMethods.PIX'),
          DEBIT: tConfirmation('paymentMethods.DEBIT'),
          CREDIT: tConfirmation('paymentMethods.CREDIT'),
          EXCHANGE: tConfirmation('paymentMethods.EXCHANGE')
        }
      }}
    />
  )

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
                <BreadcrumbLink onClick={() => router.push(basePath)}>
                  {tCommon('Dashboard')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.push(`${basePath}/sales`)}
                >
                  {tReceipt('sales')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() =>
                    router.push(
                      `${basePath}/sales/new/confirmation?saleId=${sale.id}`
                    )
                  }
                >
                  {tReceipt('confirmation')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{tReceipt('previewTitle')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="container mx-auto space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{tReceipt('previewTitle')}</h1>
          <p className="text-muted-foreground text-sm">
            {tReceipt('saleIdLabel')}: {sale.id}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <PdfViewerClient>{pdfDocument}</PdfViewerClient>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-muted-foreground text-sm">
            <strong>{tReceipt('hintLabel')}:</strong> {tReceipt('liveHint')}
          </p>
        </div>
      </div>
    </>
  )
}
