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

export function ResellerSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Logout realizado com sucesso')
    router.push('/login')
  }

  const navItems = [
    {
      title: 'Dashboard',
      routeKey: 'my-space',
      url: '/my-space',
      icon: BarChart3,
      isActive: pathname === '/my-space' || pathname.endsWith('/my-space')
    },
    {
      title: 'Meu Estoque',
      routeKey: 'inventory',
      url: '/my-space/inventory',
      icon: Package,
      isActive: pathname.includes('/inventory')
    },
    {
      title: 'Clientes',
      routeKey: 'customers',
      url: '/my-space/customers',
      icon: Users,
      isActive: pathname.includes('/customers')
    },
    {
      title: 'Vendas',
      routeKey: 'sales',
      url: '/my-space/sales',
      icon: ShoppingBag,
      isActive: pathname.includes('/sales')
    },
    {
      title: 'Devoluções',
      routeKey: 'returns',
      url: '/my-space/returns',
      icon: RotateCcw,
      isActive: pathname.includes('/returns')
    },
    {
      title: 'Trocas',
      routeKey: 'transfers',
      url: '/my-space/transfers',
      icon: Repeat,
      isActive: pathname.includes('/transfers')
    },
    {
      title: 'Romaneios',
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
                  <span className="text-muted-foreground">Revenda</span>
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
                <span>Configurações</span>
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
              <span>Sair</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
