import { redirect } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'

export default function AdminLoginPage() {
  redirect(`/${routing.defaultLocale}/admin-login`)
}
