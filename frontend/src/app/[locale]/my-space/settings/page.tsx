import { SettingsPage } from '@/components/settings/settings-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function ResellerSettingsPage() {
  const t = await getTranslations('Settings')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/my-space" title={t('title')} />
      <SettingsPage />
    </>
  )
}
