'use client'

import { BatchCreateForm } from '@/components/batches/batch-create-form'
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
import { useRouter } from '@/lib/i18n/navigation'
import { useTranslations } from 'next-intl'
import { BusinessRulesHelp } from '@/components/business-rules/business-rules-help'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function AdminBatchCreatePage() {
  const router = useRouter()
  const t = useTranslations('Admin-Batch-Create')
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Button
            variant="ghost"
            size="icon"
            title="Voltar para lotes"
            aria-label="Voltar para lotes"
            onClick={() => router.push('/home/batches')}
          >
            <ArrowLeft />
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center!"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => {
                    router.push('/home')
                  }}
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => {
                    router.push('/home/batches')
                  }}
                >
                  {t('batches')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <BusinessRulesHelp topic="batches" />
        </div>
      </header>
      <BatchCreateForm />
    </>
  )
}
