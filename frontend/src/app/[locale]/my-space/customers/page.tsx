import { CustomersPage } from '@/components/customers/customers-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function ResellerCustomersPage() {
  const t = await getTranslations('Customers')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/my-space" title={t('title')} />
      <CustomersPage />
    </>
  )
}
