import { ProductsPage } from '@/components/products/products-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function AdminProductsPage() {
  const t = await getTranslations('Admin-Products')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <ProductsPage />
    </>
  )
}
