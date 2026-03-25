import { SalesPage } from '@/components/sales/sales-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function AdminSalesPage() {
  const t = await getTranslations('Admin-Sales')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <SalesPage />
    </>
  )
}
