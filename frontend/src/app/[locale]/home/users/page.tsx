import { UsersPage } from '@/components/users/users-page'
import { PageBreadcrumbHeader } from '@/components/layout/page-breadcrumb-header'
import { getTranslations } from 'next-intl/server'

export default async function AdminUsersPage() {
  const t = await getTranslations('Admin-Users')

  return (
    <>
      <PageBreadcrumbHeader homeHref="/home" title={t('title')} />
      <UsersPage />
    </>
  )
}
