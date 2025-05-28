import { redirect } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'

export default function DashboardPage() {
  redirect(`/${routing.defaultLocale}/dashboard`)
}
