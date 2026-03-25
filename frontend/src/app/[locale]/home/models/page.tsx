import { ModelsPage } from '@/components/models/models-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function AdminProductsModelsPage() {
  const t = await getTranslations('Admin-Models')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <ModelsPage />
    </>
  )
}
