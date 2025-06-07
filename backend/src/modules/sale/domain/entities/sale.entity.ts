import { Unit } from '@/shared/common/value-object/unit.vo'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'
import { BadRequestException } from '@nestjs/common'

export class Sale {
  private _installments: boolean[] = []

  @ApiProperty({
    description: 'The ID of the sale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The ID of the consumer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly customerId: UUID

  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public resellerId: UUID

  @ApiProperty({
    description: 'The IDs of the products in the sale',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String]
  })
  public productIds: UUID[]

  @ApiProperty({
    description: 'The date of the sale',
    example: '2024-01-01',
    type: Date
  })
  public saleDate: Date

  @ApiProperty({
    description: 'The total amount of the sale',
    example: '1000.00',
    type: String
  })
  public totalAmount: Currency

  @ApiProperty({
    description: 'The payment method of the sale',
    enum: PaymentMethod,
    example: PaymentMethod.DEBIT,
    type: String
  })
  public paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'The number of installments',
    example: 12,
    type: Number
  })
  public numberInstallments: Unit

  @ApiProperty({
    description: 'The status of the sale',
    enum: SaleStatus,
    example: SaleStatus.CONFIRMED,
    type: String
  })
  public status: SaleStatus

  @ApiProperty({
    description: 'The interval between installments in days',
    example: 30,
    type: Number
  })
  public installmentsInterval: Unit

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
    installmentsInterval: Unit = new Unit(0)
  ) {
    this.id = id
    this.customerId = customerId
    this.resellerId = resellerId
    this.productIds = productIds
    this.saleDate = saleDate
    this.totalAmount = totalAmount
    this.paymentMethod = paymentMethod
    this.numberInstallments = numberInstallments
    this.status = status
    this.installmentsInterval = installmentsInterval
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
      throw new BadRequestException('Installment number out of range')
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

  public getInstallments(): boolean[] {
    return this._installments
  }
}
