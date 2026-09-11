import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Unit } from '@/shared/common/value-object/unit.vo'
import { BadRequestException } from '@nestjs/common'
import { UUID, randomUUID } from 'crypto'

type SaleOverrides = {
  productIds?: UUID[]
  numberInstallments?: Unit
  installmentsInterval?: Unit
  installmentsPaid?: Unit
  installments?: boolean[]
}

function makeSale(overrides: SaleOverrides = {}) {
  return new Sale(
    randomUUID(),
    randomUUID(),
    randomUUID(),
    overrides.productIds ?? [randomUUID()],
    new Date('2025-06-01'),
    new Currency('100.00'),
    PaymentMethod.CASH,
    overrides.numberInstallments ?? new Unit(1),
    SaleStatus.PENDING,
    overrides.installmentsInterval ?? new Unit(0),
    overrides.installmentsPaid ?? new Unit(0),
    overrides.installments
  )
}

describe('Sale', () => {
  it('rejects sales without products', () => {
    expect(() => makeSale({ productIds: [] })).toThrow(BadRequestException)
  })

  it('rejects duplicated products', () => {
    const productId = randomUUID() as UUID

    expect(() => makeSale({ productIds: [productId, productId] })).toThrow(
      BadRequestException
    )
  })

  it('requires interval for installment sales', () => {
    expect(() =>
      makeSale({
        numberInstallments: new Unit(2),
        installmentsInterval: new Unit(0)
      })
    ).toThrow(BadRequestException)
  })

  it('rejects more paid installments than total installments', () => {
    expect(() => makeSale({ installmentsPaid: new Unit(2) })).toThrow(
      BadRequestException
    )
  })

  it('hydrates persisted installment history', () => {
    const sale = makeSale({
      numberInstallments: new Unit(3),
      installmentsInterval: new Unit(30),
      installments: [true, false, true]
    })

    expect(sale.getInstallments()).toEqual([true, false, true])
    expect(sale.installmentsPaid.getValue()).toBe(2)
  })
})
