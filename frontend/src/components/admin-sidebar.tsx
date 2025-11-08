'use client'

import * as React from 'react'
import {
  ArrowLeftRight,
  BarChart3,
  Box,
  Cog,
  FileBox,
  LogOut,
  PackageOpen,
  ShoppingBag,
  Sparkle,
  Store,
  Truck,
  Undo2,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation'
import { useAuthStore } from '@/stores/use-auth-store'
import { useGetUsers } from '@/hooks/use-users'
import { Badge } from '@/components/ui/badge'
import { useGetTransfers } from '@/hooks/use-transfers'
import { useGetReturns } from '@/hooks/use-returns'

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
  const tReturns = useTranslations('Admin-Returns')
  const tTransfers = useTranslations('Admin-Transfers')
  const tModels = useTranslations('Admin-Models')

  const { logout } = useAuthStore()

  const { data: users } = useGetUsers()

  const { data: transfers } = useGetTransfers()

  const { data: returns } = useGetReturns()

  const handleLogout = () => {
    logout()
    toast.success(t('LogoutSuccess'))
    router.push('/admin-login')
  }

  type subitemsProp = {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    isActive: boolean
    hasBadge?: boolean
  }
  type navItemsProp = {
    title: string
    routeKey: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    isActive: boolean
    hasBadge?: boolean
    items?: subitemsProp[]
  }
  const navItems: navItemsProp[] = [
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
      title: tModels('title'),
      routeKey: 'models',
      url: '/home/models',
      icon: FileBox,
      isActive: pathname.includes('/home/models'),
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
      title: tReturns('title'),
      routeKey: 'returns',
      url: '/home/returns',
      icon: Undo2,
      isActive: pathname.includes('/home/returns'),
      hasBadge:
        returns &&
        returns.filter((returnItem) => returnItem.status === 'PENDING').length >
          0
    },
    {
      title: tTransfers('title'),
      routeKey: 'transfers',
      url: '/home/transfers',
      icon: ArrowLeftRight,
      isActive: pathname.includes('/home/transfers'),
      hasBadge:
        transfers &&
        transfers.filter((transfer) => transfer.status === 'PENDING').length > 0
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
      <SidebarContent className="mt-2">
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
                    <Badge className="bg-badge-6 text-badge-text-6 ml-2">
                      !
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                        <Link
                          href={subItem.url}
                          className="flex justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <subItem.icon className="size-4" />
                            <span>{subItem.title}</span>
                          </div>
                          {subItem.hasBadge && (
                            <Badge className="bg-badge-6 text-badge-text-6 ml-2">
                              !
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : null}
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
