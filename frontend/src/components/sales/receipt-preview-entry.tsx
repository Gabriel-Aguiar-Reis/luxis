'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ReceiptPreviewContent = dynamic(
  () =>
    import('@/components/sales/receipt-preview-content').then(
      (module) => module.ReceiptPreviewContent
    ),
  {
    ssr: false
  }
)

export function ReceiptPreviewEntry({
  basePath
}: {
  basePath: '/home' | '/my-space'
}) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto space-y-4 p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[800px] w-full" />
        </div>
      }
    >
      <ReceiptPreviewContent basePath={basePath} />
    </Suspense>
  )
}
