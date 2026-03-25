'use client'

import * as React from 'react'
import {
  BarChart3,
  Package,
  Users,
  ShoppingBag,
  RotateCcw,
  Repeat,
  Truck,
  Settings,
  LogOut
} from 'lucide-react'
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/use-auth-store'
import { useTranslations } from 'next-intl'

export function ResellerSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Common')
  const tInventory = useTranslations('Inventory')
  const tCustomers = useTranslations('Customers')
  const tSales = useTranslations('Sales')
  const tReturns = useTranslations('Returns')
  const tTransfers = useTranslations('Transfers')
  const tShipments = useTranslations('Shipments')
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success(t('LogoutSuccess'))
    router.push('/login')
  }

  const navItems = [
    {
      title: t('Dashboard'),
      routeKey: 'my-space',
      url: '/my-space',
      icon: BarChart3,
      isActive: pathname === '/my-space' || pathname.endsWith('/my-space')
    },
    {
      title: tInventory('title'),
      routeKey: 'inventory',
      url: '/my-space/inventory',
      icon: Package,
      isActive: pathname.includes('/inventory')
    },
    {
      title: tCustomers('title'),
      routeKey: 'customers',
      url: '/my-space/customers',
      icon: Users,
      isActive: pathname.includes('/customers')
    },
    {
      title: tSales('title'),
      routeKey: 'sales',
      url: '/my-space/sales',
      icon: ShoppingBag,
      isActive: pathname.includes('/sales')
    },
    {
      title: tReturns('title'),
      routeKey: 'returns',
      url: '/my-space/returns',
      icon: RotateCcw,
      isActive: pathname.includes('/returns')
    },
    {
      title: tTransfers('title'),
      routeKey: 'transfers',
      url: '/my-space/transfers',
      icon: Repeat,
      isActive: pathname.includes('/transfers')
    },
    {
      title: tShipments('title'),
      routeKey: 'shipments',
      url: '/my-space/shipments',
      icon: Truck,
      isActive: pathname.includes('/shipments')
    }
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={'/my-space'}>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold">Luxis</span>
                  <span className="text-muted-foreground">
                    {t('ResellerArea')}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={'/my-space/settings'}>
                <Settings className="size-4" />
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
