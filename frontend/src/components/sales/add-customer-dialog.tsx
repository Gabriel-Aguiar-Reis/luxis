import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AddCustomerDialogProps = {
  showNewCustomerDialog: boolean
  setShowNewCustomerDialog: (show: boolean) => void
  newCustomerForm: any
  handleCreateCustomer: () => void
}

export function AddCustomerDialog({
  showNewCustomerDialog,
  setShowNewCustomerDialog,
  newCustomerForm,
  handleCreateCustomer
}: AddCustomerDialogProps) {
  return (
    <Dialog
      open={showNewCustomerDialog}
      onOpenChange={(o) => {
        if (!o) {
          setShowNewCustomerDialog(false)
          newCustomerForm.reset()
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreateCustomer()
          }}
        >
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Informe os dados básicos do cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Nome</Label>
              <Input
                id="customer-name"
                placeholder="Nome do cliente"
                {...newCustomerForm.register('name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Telefone</Label>
              <Input
                id="customer-phone"
                placeholder="(00) 00000-0000"
                {...newCustomerForm.register('phone')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNewCustomerDialog(false)
                newCustomerForm.reset()
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
