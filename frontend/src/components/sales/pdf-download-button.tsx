'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { GetOneSaleResponse } from '@/hooks/use-sales'
import { toast } from 'sonner'
import { PhoneNumberUtil } from 'google-libphonenumber'
import { generateSaleReceiptPdf } from '@/components/sales/generate-sale-receipt-pdf'
import { useLocale, useTranslations } from 'next-intl'

interface PDFDownloadButtonProps {
  sale: GetOneSaleResponse
  phoneUtil: PhoneNumberUtil
}

export function PDFDownloadButton({ sale, phoneUtil }: PDFDownloadButtonProps) {
  const locale = useLocale()
  const t = useTranslations('SaleConfirmation')
  const tReceipt = useTranslations('ReceiptPreview')
  const [isClient, setIsClient] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDownload = async () => {
    try {
      setIsGenerating(true)

      // Gerar nome do arquivo com data e hora
      const now = new Date()
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
      const fileName = `${tReceipt('pdf.filePrefix')}-${dateStr}-${timeStr}-luxis.pdf`

      const blob = await generateSaleReceiptPdf(sale, phoneUtil, locale, {
        title: tReceipt('pdf.title'),
        saleDate: tReceipt('pdf.saleDate'),
        customer: t('customer'),
        paymentMethod: t('paymentMethod'),
        totalProducts: t('totalProducts'),
        item: t('item'),
        items: t('items'),
        installments: tReceipt('pdf.installments'),
        interval: tReceipt('pdf.interval'),
        days: tReceipt('pdf.days'),
        products: t('products'),
        serialNumber: t('serialNumber'),
        totalSale: t('saleTotal'),
        generatedAt: tReceipt('pdf.generatedAt'),
        at: tReceipt('pdf.at'),
        renderError: tReceipt('pdf.renderError'),
        paymentMethods: {
          CASH: t('paymentMethods.CASH'),
          PIX: t('paymentMethods.PIX'),
          DEBIT: t('paymentMethods.DEBIT'),
          CREDIT: t('paymentMethods.CREDIT'),
          EXCHANGE: t('paymentMethods.EXCHANGE')
        }
      })

      // Criar link de download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('downloadSuccess'))
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error(t('downloadError'))
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isClient) {
    return (
      <Button variant="outline" size="lg" className="min-w-[200px]" disabled>
        <Download className="mr-2 h-5 w-5" />
        {t('downloadPdf')}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="lg"
      className="min-w-[200px]"
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t('generatingPdf')}
        </>
      ) : (
        <>
          <Download className="mr-2 h-5 w-5" />
          {t('downloadPdf')}
        </>
      )}
    </Button>
  )
}
