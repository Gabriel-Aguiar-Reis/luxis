import { ShipmentsPage } from '@/components/shipments/shipments-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function AdminShipmentsPage() {
  const t = await getTranslations('Admin-Shipments')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <ShipmentsPage />
    </>
  )
}
