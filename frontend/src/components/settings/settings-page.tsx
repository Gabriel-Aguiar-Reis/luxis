'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { AppearanceForm } from '@/components/settings/appearance-form'
import { ProfileForm } from '@/components/settings/profile-form'
import { SecurityForm } from '@/components/settings/security-form'
import { useTranslations } from 'next-intl'

export function SettingsPage() {
  const t = useTranslations('Settings')

  return (
    <div className="container flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <ProfileForm />
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <SecurityForm />
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <AppearanceForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
