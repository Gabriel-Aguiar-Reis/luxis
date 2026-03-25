import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { TransfersPage } from '@/components/transfers/transfers-page'
import { getTranslations } from 'next-intl/server'

export default async function AdminUsersTransfersPage() {
  const t = await getTranslations('Admin-Transfers')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <TransfersPage />
    </>
  )
}
