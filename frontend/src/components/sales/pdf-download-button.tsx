'use client'

import { useState, useEffect, createElement } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { GetOneSaleResponse } from '@/hooks/use-sales'
import { toast } from 'sonner'
import * as ReactPDF from '@react-pdf/renderer'
import { SaleReceiptPDF } from '@/components/sales/sale-receipt-pdf/sale-receipt-pdf'
import { PhoneNumberUtil } from 'google-libphonenumber'

interface PDFDownloadButtonProps {
  sale: GetOneSaleResponse
  phoneUtil: PhoneNumberUtil
}

export function PDFDownloadButton({ sale, phoneUtil }: PDFDownloadButtonProps) {
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
      const fileName = `comprovante-${dateStr}-${timeStr}-luxis.pdf`

      // Gerar o PDF diretamente do componente
      const element = createElement(SaleReceiptPDF, { sale, phoneUtil })
      // @ts-ignore - O tipo está correto, é um Document do react-pdf
      const asPdf = ReactPDF.pdf(element)
      const blob = await asPdf.toBlob()

      // Criar link de download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Comprovante baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar o comprovante')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isClient) {
    return (
      <Button variant="outline" size="lg" className="min-w-[200px]" disabled>
        <Download className="mr-2 h-5 w-5" />
        Baixar Comprovante (PDF)
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
          Gerando PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-5 w-5" />
          Baixar Comprovante (PDF)
        </>
      )}
    </Button>
  )
}
