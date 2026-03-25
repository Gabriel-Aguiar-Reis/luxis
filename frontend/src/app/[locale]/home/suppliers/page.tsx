import { SuppliersPage } from '@/components/suppliers/suppliers-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function AdminSuppliersPage() {
  const t = await getTranslations('Admin-Suppliers')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <SuppliersPage />
    </>
  )
}
