import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { ReturnsPage } from '@/components/returns/returns-page'
import { getTranslations } from 'next-intl/server'

export default async function AdminUsersReturnsPage() {
  const t = await getTranslations('Admin-Returns')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <ReturnsPage />
    </>
  )
}
