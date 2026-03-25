import { SalesPage } from '@/components/sales/sales-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function ResellerSalesPage() {
  const t = await getTranslations('Sales')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/my-space" title={t('title')} />
      <SalesPage role="RESELLER" />
    </>
  )
}
