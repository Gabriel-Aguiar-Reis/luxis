import { AuthSessionSync } from '@/components/auth/auth-session-sync'
import { OnboardingModal } from '@/components/onboarding/onboarding-modal'
import { ResellerSidebar } from '@/components/reseller-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function ResellerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AuthSessionSync expectedRole="RESELLER" redirectTo="/login" />
      <ResellerSidebar />
      <SidebarInset className="flex flex-col">{children}</SidebarInset>
      <OnboardingModal />
    </SidebarProvider>
  )
}
