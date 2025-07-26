'use client'

import * as React from 'react'
import {
  BarChart3,
  Box,
  Cog,
  LogOut,
  PackageOpen,
  ShoppingBag,
  Sparkle,
  Store,
  Truck,
  Users
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation'
import { useAuthStore } from '@/stores/use-auth-store'
import { useGetUsers } from '@/hooks/use-users'
import { Badge } from '@/components/ui/badge'

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Common')

  const tProducts = useTranslations('Admin-Products')
  const tUsers = useTranslations('Admin-Users')
  const tSales = useTranslations('Admin-Sales')
  const tBatches = useTranslations('Admin-Batches')
  const tSuppliers = useTranslations('Admin-Suppliers')
  const tShipments = useTranslations('Admin-Shipments')

  const { logout } = useAuthStore()

  const { data: users } = useGetUsers()

  const handleLogout = () => {
    logout()
    toast.success(t('LogoutSuccess'))
    router.push('/admin-login')
  }

  const navItems = [
    {
      title: t('Dashboard'),
      routeKey: 'home',
      url: '/home',
      icon: BarChart3,
      isActive: pathname === '/home' || pathname.endsWith('/home'),
      hasBadge: false
    },
    {
      title: tProducts('title'),
      routeKey: 'products',
      url: '/home/products',
      icon: Box,
      isActive: pathname.includes('/home/products'),
      hasBadge: false
    },
    {
      title: tUsers('title'),
      routeKey: 'users',
      url: '/home/users',
      icon: Users,
      isActive: pathname.includes('/home/users'),
      hasBadge:
        users && users?.filter((user) => user.status === 'PENDING').length > 0
    },
    {
      title: tSales('title'),
      routeKey: 'sales',
      url: '/home/sales',
      icon: ShoppingBag,
      isActive: pathname.includes('/home/sales'),
      hasBadge: false
    },
    {
      title: tBatches('title'),
      routeKey: 'batches',
      url: '/home/batches',
      icon: PackageOpen,
      isActive: pathname.includes('/home/batches'),
      hasBadge: false
    },
    {
      title: tSuppliers('title'),
      routeKey: 'suppliers',
      url: '/home/suppliers',
      icon: Store,
      isActive: pathname.includes('/home/suppliers'),
      hasBadge: false
    },
    {
      title: tShipments('title'),
      routeKey: 'shipments',
      url: '/home/shipments',
      icon: Truck,
      isActive: pathname.includes('/home/shipments'),
      hasBadge: false
    }
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Sparkle className="fill-accent size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Luxis</span>
                  <span className="truncate text-xs">{t('AdminArea')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link href={item.url} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </div>
                  {item.hasBadge && (
                    <Badge className="ml-2 bg-[var(--badge-6)] text-[var(--badge-text-6)]">
                      !
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/home/settings">
                <Cog className="size-4" />
                <span>{t('Settings')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              <span>{t('Logout')}</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
