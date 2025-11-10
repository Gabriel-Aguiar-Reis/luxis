'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersList } from '@/components/users/users-list'
import { PendingUsersList } from '@/components/users/pending-users-list'
import { PasswordResetRequestsList } from '@/components/password-reset/password-reset-requests-list'
import { Badge } from '@/components/ui/badge'
import { useGetUsers } from '@/hooks/use-users'
import { PhoneNumberUtil } from 'google-libphonenumber'

export function UsersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { data: users } = useGetUsers()
  const phoneUtil = PhoneNumberUtil.getInstance()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos os Usuários</TabsTrigger>
          <TabsTrigger value="pending">
            Aprovações Pendentes{' '}
            {users &&
              users?.filter((user) => user.status === 'PENDING').length > 0 && (
                <Badge className="bg-badge-6 text-badge-text-6">!</Badge>
              )}
          </TabsTrigger>
          <TabsTrigger value="password-resets">Redefinições</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <UsersList phoneUtil={phoneUtil} />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <PendingUsersList
            onHandleChange={() => setActiveTab('all')}
            phoneUtil={phoneUtil}
          />
        </TabsContent>
        <TabsContent value="password-resets" className="mt-4">
          <PasswordResetRequestsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
