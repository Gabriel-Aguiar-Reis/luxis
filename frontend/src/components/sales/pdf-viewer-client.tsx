'use client'

import { ReactElement } from 'react'
import { DocumentProps, PDFViewer } from '@react-pdf/renderer'

export function PdfViewerClient({
  children,
  height = '800px'
}: {
  children: ReactElement<DocumentProps>
  height?: string
}) {
  return (
    <PDFViewer width="100%" height={height} showToolbar>
      {children}
    </PDFViewer>
  )
}
