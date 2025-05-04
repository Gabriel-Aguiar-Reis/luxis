import { Unit } from '@/shared/common/value-object/unit.vo'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'

export class Sale {
  private _installments: boolean[] = []

  constructor(
    public readonly id: UUID,
    public resellerId: UUID,
    public productIds: UUID[] = [],
    public saleDate: Date,
    public totalAmount: Currency,
    public paymentMethod: PaymentMethod,
    public numberInstallments: Unit = new Unit(1),
    public status: SaleStatus = SaleStatus.CONFIRMED,
    public installmentsInterval: Unit = new Unit(0)
  ) {
    this._initializeInstallments()
  }

  private _initializeInstallments(): void {
    this._installments = Array(this.numberInstallments.getValue()).fill(false)
    if (
      this.numberInstallments.getValue() === 1 &&
      this.installmentsInterval.getValue() === 0
    ) {
      this.status = SaleStatus.INSTALLMENTS_PAID
    } else {
      this.status = SaleStatus.INSTALLMENTS_PENDING
    }
  }

  public markInstallmentAsPaid(installmentNumber: Unit): void {
    if (
      installmentNumber.getValue() < 1 ||
      installmentNumber.getValue() > this.numberInstallments.getValue()
    ) {
      throw new Error('Installment number out of range')
    }
    this._installments[installmentNumber.getValue() - 1] = true
    this._updateStatus()
  }

  private _updateStatus(): void {
    if (this._installments.every((paid) => paid)) {
      this.status = SaleStatus.INSTALLMENTS_PAID
    } else if (this._installments.some((paid) => paid)) {
      this.status = SaleStatus.INSTALLMENTS_PENDING
    }
  }
}
