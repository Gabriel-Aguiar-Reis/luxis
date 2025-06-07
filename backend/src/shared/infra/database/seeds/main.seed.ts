import { NestFactory } from '@nestjs/core'
import { SeedsModule } from '@/shared/infra/database/seeds/seeds.module'
import { SuperuserSeed } from '@/shared/infra/database/seeds/superuser.seed'
import { SupplierSeed } from '@/shared/infra/database/seeds/supplier.seed'
import { BatchSeed } from '@/shared/infra/database/seeds/batch.seed'
import { CustomerSeed } from '@/shared/infra/database/seeds/customer.seed'
import { SaleSeed } from '@/shared/infra/database/seeds/sale.seed'
import { ReturnSeed } from '@/shared/infra/database/seeds/return.seed'
import { OwnershipTransferSeed } from '@/shared/infra/database/seeds/ownership-transfer.seed'
import { ShipmentSeed } from '@/shared/infra/database/seeds/shipment.seed'
import { ResellerSeed } from '@/shared/infra/database/seeds/reseller.seed'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule)
  try {
    const toUUID = (id: any) =>
      String(id) as `${string}-${string}-${string}-${string}-${string}`

    await app.get(SuperuserSeed).run()
    const resellerId = toUUID(await app.get(ResellerSeed).run())

    const supplierIds = (await app.get(SupplierSeed).run()).map(toUUID)

    await app.get(BatchSeed).run(supplierIds)

    const productRepo = app.get('ProductRepository')
    const products = await productRepo.findAll()
    const productIds = products.map((p: any) => toUUID(p.id))

    const customerIds = (await app.get(CustomerSeed).run()).map(toUUID)

    const user = {
      id: resellerId,
      email: 'superuser@luxis.com',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE
    }
    if (productIds.length < 4)
      throw new Error('Seeds: menos de 4 produtos gerados!')
    if (customerIds.length < 1) throw new Error('Seeds: nenhum cliente gerado!')
    await app
      .get(SaleSeed)
      .run(customerIds[0], [productIds[0], productIds[1]], user)
    await app.get(ReturnSeed).run(resellerId, [productIds[2]], user)
    await app
      .get(OwnershipTransferSeed)
      .run(productIds[3], resellerId, resellerId)
    await app.get(ShipmentSeed).run(resellerId, [productIds[0], productIds[1]])
    console.log('Seeds executados com sucesso!')
  } catch (error) {
    console.error('Erro ao rodar seeds:', error)
  } finally {
    await app.close()
  }
}

bootstrap()
