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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import { fieldHints, onlyPhoneChars } from '@/lib/form-guidance'

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
      <DialogContent className="sm:max-w-125">
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
              <InputGroup>
                <InputGroupInput
                  id="customer-name"
                  placeholder={t('namePlaceholder')}
                  aria-invalid={!!newCustomerForm.formState.errors.name}
                  aria-describedby="new-customer-name-hint"
                  {...newCustomerForm.register('name')}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>2-80</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <p
                id="new-customer-name-hint"
                className="text-muted-foreground text-xs"
              >
                {fieldHints.name}
              </p>
              {newCustomerForm.formState.errors.name && (
                <p className="text-destructive text-sm">
                  {newCustomerForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">{t('phone')}</Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>+55</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="customer-phone"
                  placeholder="(11) 98765-4321"
                  type="tel"
                  inputMode="tel"
                  aria-invalid={!!newCustomerForm.formState.errors.phone}
                  aria-describedby="new-customer-phone-hint"
                  {...newCustomerForm.register('phone', {
                    setValueAs: (value: string) => onlyPhoneChars(value)
                  })}
                />
              </InputGroup>
              <p
                id="new-customer-phone-hint"
                className="text-muted-foreground text-xs"
              >
                {fieldHints.phone}
              </p>
              {newCustomerForm.formState.errors.phone && (
                <p className="text-destructive text-sm">
                  {newCustomerForm.formState.errors.phone.message}
                </p>
              )}
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
