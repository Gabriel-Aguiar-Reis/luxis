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
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('AddCustomerDialog')

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
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">{t('name')}</Label>
              <Input
                id="customer-name"
                placeholder={t('namePlaceholder')}
                {...newCustomerForm.register('name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">{t('phone')}</Label>
              <Input
                id="customer-phone"
                placeholder={t('phonePlaceholder')}
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
              {t('cancel')}
            </Button>
            <Button type="submit">{t('create')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
