import { createElement } from 'react'
import { GetOneSaleResponse } from '@/hooks/use-sales'
import { PhoneNumberUtil } from 'google-libphonenumber'
import { PaymentMethod } from '@/lib/api-types'

type SaleReceiptPdfLabels = {
  title: string
  saleDate: string
  customer: string
  paymentMethod: string
  totalProducts: string
  item: string
  items: string
  installments: string
  interval: string
  days: string
  products: string
  serialNumber: string
  totalSale: string
  generatedAt: string
  at: string
  renderError: string
  paymentMethods: Record<PaymentMethod, string>
}

export async function generateSaleReceiptPdf(
  sale: GetOneSaleResponse,
  phoneUtil: PhoneNumberUtil,
  locale: string,
  labels: SaleReceiptPdfLabels
) {
  const [{ pdf }, { SaleReceiptPDF }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/sales/sale-receipt-pdf/sale-receipt-pdf')
  ])

  const element = createElement(SaleReceiptPDF, {
    sale,
    phoneUtil,
    locale,
    labels
  })
  return pdf(element as never).toBlob()
}
