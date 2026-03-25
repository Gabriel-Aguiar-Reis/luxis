import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { ReturnsPage } from '@/components/returns/returns-page'
import { getTranslations } from 'next-intl/server'

export default async function ResellerReturnsPage() {
  const t = await getTranslations('Returns')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/my-space" title={t('title')} />
      <ReturnsPage />
    </>
  )
}
