import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function PageBreadcrumbHeader({
  homeHref,
  title,
  homeLabel
}: {
  homeHref: '/home' | '/my-space'
  title: string
  homeLabel?: string
}) {
  return (
    <PageBreadcrumbHeaderContent
      homeHref={homeHref}
      title={title}
      homeLabel={homeLabel}
    />
  )
}

async function PageBreadcrumbHeaderContent({
  homeHref,
  title,
  homeLabel
}: {
  homeHref: '/home' | '/my-space'
  title: string
  homeLabel?: string
}) {
  const t = await getTranslations('Common')
  const resolvedHomeLabel = homeLabel ?? t('Dashboard')

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4 align-middle">
        <SidebarTrigger className="-ml-1" />
        <Button asChild variant="ghost" size="icon" title={t('back')}>
          <Link href={homeHref} aria-label={t('back')}>
            <ArrowLeft />
          </Link>
        </Button>
        <Separator
          orientation="vertical"
          className="h-4 data-[orientation=vertical]:self-center!"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={homeHref}>{resolvedHomeLabel}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
