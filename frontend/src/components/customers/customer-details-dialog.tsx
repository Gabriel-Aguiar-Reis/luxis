'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag,
  Edit,
  Package,
  CreditCard,
  Clock
} from 'lucide-react'

// Tipos para clientes
type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  totalPurchases: number
  lastPurchaseDate: string | null
  createdAt: string
  status: 'ACTIVE' | 'INACTIVE'
}

// Tipo para vendas
type Sale = {
  id: string
  date: string
  total: number
  paymentMethod: string
  status: string
  items: number
}

type CustomerDetailsDialogProps = {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onEdit: (customer: Customer) => void
  onRegisterSale: (customer: Customer) => void
}

export function CustomerDetailsDialog({ 
  customer, 
  isOpen, 
  onClose, 
  onEdit,
  onRegisterSale
}: CustomerDetailsDialogProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoadingSales, setIsLoadingSales] = useState(false)
  
  // Carregar vendas do cliente
  useEffect(() => {
    if (customer && isOpen) {
      fetchCustomerSales(customer.id)
    }
  }, [customer, isOpen])
  
  // Buscar vendas do cliente
  const fetchCustomerSales = async (customerId: string) => {
    setIsLoadingSales(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/customers/${customerId}/sales`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Falha ao carregar vendas do cliente')
      }
      
      const data = await response.json()
      setSales(data)
    } catch (error) {
      console.error(error)
      // Dados fictícios para demonstração
      const demoSales = generateDemoSales()
      setSales(demoSales)
    } finally {
      setIsLoadingSales(false)
    }
  }
  
  // Formatar data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca'
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }
  
  // Formatar data e hora
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    } catch (error) {
      return 'Data inválida'
    }
  }
  
  // Formatar telefone
  const formatPhone = (phone: string) => {
    // Formatar telefone como (XX) XXXXX-XXXX
    if (!phone) return ''
    
    // Remover caracteres não numéricos
    const numbers = phone.replace(/\D/g, '')
    
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    
    return phone
  }
  
  // Formatar método de pagamento
  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, { label: string, icon: React.ReactNode }> = {
      'CREDIT_CARD': { 
        label: 'Cartão de Crédito', 
        icon: <CreditCard className="h-4 w-4 text-blue-500" /> 
      },
      'DEBIT_CARD': { 
        label: 'Cartão de Débito', 
        icon: <CreditCard className="h-4 w-4 text-green-500" /> 
      },
      'CASH': { 
        label: 'Dinheiro', 
        icon: <CreditCard className="h-4 w-4 text-green-700" /> 
      },
      'PIX': { 
        label: 'PIX', 
        icon: <CreditCard className="h-4 w-4 text-purple-500" /> 
      }
    }
    
    const { label, icon } = methodMap[method] || { 
      label: method, 
      icon: <CreditCard className="h-4 w-4" /> 
    }
    
    return (
      <div className="flex items-center gap-1">
        {icon}
        <span>{label}</span>
      </div>
    )
  }
  
  // Formatar status da venda
  const formatSaleStatus = (status: string) => {
    const statusMap: Record<string, { label: string, className: string }> = {
      'COMPLETED': { 
        label: 'Concluída', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      },
      'PENDING': { 
        label: 'Pendente', 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
      },
      'CANCELED': { 
        label: 'Cancelada', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
      }
    }
    
    const { label, className } = statusMap[status] || { 
      label: status, 
      className: '' 
    }
    
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    )
  }
  
  if (!customer) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações detalhadas e histórico de compras
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="purchases">Histórico de Compras</TabsTrigger>
          </TabsList>
          
          {/* Aba de Informações */}
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{customer.name}</h3>
              </div>
              <Badge 
                variant={customer.status === 'ACTIVE' ? 'default' : 'outline'}
                className={customer.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}
              >
                {customer.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contato</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formatPhone(customer.phone)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Endereço</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-col">
                    <span>{customer.address}</span>
                    <span>{customer.city}, {customer.state}</span>
                    <span>CEP: {customer.postalCode}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Cliente desde</span>
                  </div>
                  <span>{formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span>Total de compras</span>
                  </div>
                  <span>{customer.totalPurchases}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Última compra</span>
                  </div>
                  <span>{formatDate(customer.lastPurchaseDate)}</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onEdit(customer)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Cliente
              </Button>
              <Button onClick={() => onRegisterSale(customer)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Nova Venda
              </Button>
            </div>
          </TabsContent>
          
          {/* Aba de Histórico de Compras */}
          <TabsContent value="purchases" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Histórico de Compras</CardTitle>
                <CardDescription>
                  Todas as compras realizadas por {customer.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSales ? (
                  <div className="flex h-[200px] w-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : sales.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDateTime(sale.date)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              <span>{sale.items}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatPaymentMethod(sale.paymentMethod)}</TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {sale.total.toFixed(2)}
                          </TableCell>
                          <TableCell>{formatSaleStatus(sale.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex h-[100px] w-full items-center justify-center text-muted-foreground">
                    <p>Este cliente ainda não realizou nenhuma compra.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={() => onRegisterSale(customer)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Nova Venda
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Função para gerar dados fictícios para demonstração
function generateDemoSales(): Sale[] {
  const paymentMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'PIX']
  const statuses = ['COMPLETED', 'PENDING', 'CANCELED']
  
  // Gerar entre 0 e 10 vendas
  const count = Math.floor(Math.random() * 11)
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 180)) // Últimos 180 dias
    
    const items = Math.floor(Math.random() * 5) + 1 // 1 a 5 itens
    const total = Math.round((Math.random() * 500 + 50) * 100) / 100 // R$50 a R$550
    
    // Distribuição de status: 80% concluídas, 15% pendentes, 5% canceladas
    let status
    const rand = Math.random()
    if (rand < 0.8) status = 'COMPLETED'
    else if (rand < 0.95) status = 'PENDING'
    else status = 'CANCELED'
    
    return {
      id: `sale-${i + 1}`,
      date: date.toISOString(),
      total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status,
      items
    }
  })
}
