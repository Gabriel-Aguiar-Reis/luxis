import { ProductsPage } from '@/components/products/products-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function ResellerInventoryPage() {
  const t = await getTranslations('Inventory')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/my-space" title={t('title')} />
      <ProductsPage />
    </>
  )
}
