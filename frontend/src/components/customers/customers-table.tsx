'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Filter,
  Phone
} from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { GetAllCustomersResponse } from '@/hooks/use-customers'
import {
  CustomersFilters,
  CustomersFiltersType
} from '@/components/customers/customers-filters'
import { PhoneNumberUtil } from 'google-libphonenumber'

type CustomersTableProps = {
  customers: GetAllCustomersResponse
  onEdit: (customer: GetAllCustomersResponse[0]) => void
  customersPerPage?: number
  phoneUtil: PhoneNumberUtil
}

export function CustomersTable({
  customers,
  onEdit,
  customersPerPage = 10,
  phoneUtil
}: CustomersTableProps) {
  const [filters, setFilters] = useState<CustomersFiltersType>({})
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCustomers = customers.filter((customer) => {
    let match = true

    if (filters.name) {
      match =
        match &&
        customer.name.value.toLowerCase().includes(filters.name.toLowerCase())
    }

    if (filters.phone) {
      match = match && customer.phone.value.includes(filters.phone)
    }

    return match
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / customersPerPage)
  )
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  )
  const emptyRows = customersPerPage - paginatedCustomers.length

  return (
    <>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg sm:text-xl">
                Gerenciamento de Clientes
              </CardTitle>
              <Button
                variant={isFiltersVisible ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
            <CardDescription>
              Visualize, crie e edite clientes do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFiltersVisible && (
              <CustomersFilters
                onFilterChange={(f) => {
                  setFilters(f)
                  setCurrentPage(1)
                }}
                initialFilters={filters}
              />
            )}
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Nome</TableHead>
                    <TableHead className="min-w-[150px]">Telefone</TableHead>
                    <TableHead className="min-w-[100px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.length > 0 ? (
                    <>
                      {paginatedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            {customer.name.value}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="text-muted-foreground h-4 w-4" />
                              {phoneUtil.formatInOriginalFormat(
                                phoneUtil.parseAndKeepRawInput(
                                  customer.phone.value,
                                  'BR'
                                )
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Ellipsis />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => onEdit(customer)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {Array.from({
                        length: emptyRows > 0 ? emptyRows : 0
                      }).map((_, idx) => (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell colSpan={3} style={{ height: 57 }} />
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Nenhum cliente encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row sm:justify-end">
                <div className="text-sm">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Página anterior</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima página</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
