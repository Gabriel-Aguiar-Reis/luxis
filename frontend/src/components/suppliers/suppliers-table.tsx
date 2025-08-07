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
import { Supplier } from '@/lib/api-types'
import { PhoneNumberUtil } from 'google-libphonenumber'
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

type SuppliersTableProps = {
  suppliers: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => void
  phoneUtil: PhoneNumberUtil
  onCreate: () => void
  suppliersPerPage?: number
}

export function SuppliersTable({
  suppliers,
  onEdit,
  onDelete,
  phoneUtil,
  onCreate,
  suppliersPerPage = 10
}: SuppliersTableProps) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filtra fornecedores por nome ou telefone
  const filteredSuppliers = suppliers.filter((supplier) => {
    const name = supplier.name.value?.toLowerCase() || ''
    const phone = supplier.phone.value?.toLowerCase() || ''
    const searchTerm = search.toLowerCase()
    return name.includes(searchTerm) || phone.includes(searchTerm)
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / suppliersPerPage)
  )
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * suppliersPerPage,
    currentPage * suppliersPerPage
  )
  const emptyRows = suppliersPerPage - paginatedSuppliers.length

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciamento de Fornecedores</CardTitle>
          </div>
          <CardDescription>
            Visualize, crie, edite e exclua fornecedores do catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex w-full">
            <Input
              placeholder="Pesquisar por nome ou telefone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSuppliers.length > 0 ? (
                  <>
                    {paginatedSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.name.value}</TableCell>
                        <TableCell>
                          {phoneUtil.formatInOriginalFormat(
                            phoneUtil.parseAndKeepRawInput(
                              supplier.phone.value,
                              'BR'
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(supplier)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(supplier)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {Array.from({ length: emptyRows > 0 ? emptyRows : 0 }).map(
                      (_, idx) => (
                        <TableRow key={`empty-${idx}`}>
                          <TableCell colSpan={3} style={{ height: 57 }} />
                        </TableRow>
                      )
                    )}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Nenhum fornecedor encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
              </Button>
              <div className="text-sm">
                Página {currentPage} de {totalPages}
              </div>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
