import { AuthSessionSync } from '@/components/auth/auth-session-sync'
import { AdminSidebar } from '@/components/admin-sidebar'
import { OnboardingModal } from '@/components/onboarding/onboarding-modal'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AuthSessionSync expectedRole="ADMIN" redirectTo="/admin-login" />
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
      <OnboardingModal />
    </SidebarProvider>
  )
}
