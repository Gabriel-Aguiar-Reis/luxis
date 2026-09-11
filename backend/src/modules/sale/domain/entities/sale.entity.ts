import { Unit } from '@/shared/common/value-object/unit.vo'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'
import { BadRequestException } from '@nestjs/common'

export class Sale {
  private _installments: boolean[] = []

  public readonly id: UUID

  public readonly customerId: UUID

  public resellerId: UUID

  public productIds: UUID[]

  public saleDate: Date

  public totalAmount: Currency

  public paymentMethod: PaymentMethod

  public numberInstallments: Unit

  public status: SaleStatus

  public installmentsInterval: Unit

  public installmentsPaid: Unit

  constructor(
    id: UUID,
    customerId: UUID,
    resellerId: UUID,
    productIds: UUID[] = [],
    saleDate: Date,
    totalAmount: Currency,
    paymentMethod: PaymentMethod,
    numberInstallments: Unit = new Unit(1),
    status: SaleStatus = SaleStatus.CONFIRMED,
    installmentsInterval: Unit = new Unit(0),
    installmentsPaid: Unit = new Unit(0),
    installments?: boolean[]
  ) {
    this.validateProductIds(productIds)
    this.validateInstallmentPlan(
      numberInstallments,
      installmentsInterval,
      installmentsPaid,
      installments
    )

    this.id = id
    this.customerId = customerId
    this.resellerId = resellerId
    this.productIds = productIds
    this.saleDate = saleDate
    this.totalAmount = totalAmount
    this.paymentMethod = paymentMethod
    this.numberInstallments = numberInstallments
    this.installmentsInterval = installmentsInterval
    this.installmentsPaid = installmentsPaid
    this._initializeInstallments(installmentsPaid.getValue(), installments)
    // Mantém o status passado no construtor ao invés de sobrescrever
    this.status = status
  }

  private validateProductIds(productIds: UUID[]): void {
    if (productIds.length === 0) {
      throw new BadRequestException('Sale must have at least one product')
    }

    if (new Set(productIds).size !== productIds.length) {
      throw new BadRequestException('Sale cannot contain duplicated products')
    }
  }

  private validateInstallmentPlan(
    numberInstallments: Unit,
    installmentsInterval: Unit,
    installmentsPaid: Unit,
    installments?: boolean[]
  ): void {
    const totalInstallments = numberInstallments.getValue()
    const paidInstallments = installmentsPaid.getValue()

    if (totalInstallments < 1) {
      throw new BadRequestException('Sale must have at least one installment')
    }

    if (totalInstallments > 1 && installmentsInterval.getValue() < 1) {
      throw new BadRequestException(
        'Installment interval is required for installment sales'
      )
    }

    if (paidInstallments > totalInstallments) {
      throw new BadRequestException(
        'Paid installments cannot exceed total installments'
      )
    }

    if (installments && installments.length > totalInstallments) {
      throw new BadRequestException(
        'Installment history cannot exceed total installments'
      )
    }
  }

  private _initializeInstallments(
    paidCount: number = 0,
    installments?: boolean[]
  ): void {
    const totalInstallments = this.numberInstallments.getValue()

    if (installments) {
      this._installments = installments.slice(0, totalInstallments)
      while (this._installments.length < totalInstallments) {
        this._installments.push(false)
      }
      this.installmentsPaid = new Unit(
        this._installments.filter(Boolean).length
      )
      return
    }

    this._installments = Array(totalInstallments).fill(false)
    // Marca as parcelas já pagas
    for (let i = 0; i < paidCount && i < this._installments.length; i++) {
      this._installments[i] = true
    }
  }

  public markInstallmentAsPaid(installmentNumber: Unit): void {
    if (
      installmentNumber.getValue() < 1 ||
      installmentNumber.getValue() > this.numberInstallments.getValue()
    ) {
      throw new BadRequestException('Installment number out of range')
    }

    const index = installmentNumber.getValue() - 1

    // Só incrementa se a parcela ainda não estava paga
    if (!this._installments[index]) {
      this._installments[index] = true
      this.installmentsPaid = new Unit(this.installmentsPaid.getValue() + 1)
      this._updateStatus()
    }
  }

  private _updateStatus(): void {
    if (this._installments.every((paid) => paid)) {
      this.status = SaleStatus.INSTALLMENTS_PAID
    } else if (this._installments.some((paid) => paid)) {
      this.status = SaleStatus.INSTALLMENTS_PENDING
    }
  }

  public getInstallments(): boolean[] {
    return this._installments
  }
}
