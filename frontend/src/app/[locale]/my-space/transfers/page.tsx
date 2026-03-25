import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { TransfersPage } from '@/components/transfers/transfers-page'
import { getTranslations } from 'next-intl/server'

export default async function ResellerTransfersPage() {
  const t = await getTranslations('Transfers')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/my-space" title={t('title')} />
      <TransfersPage />
    </>
  )
}
