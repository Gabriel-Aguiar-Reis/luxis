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
import { Product } from '@/modules/product/domain/entities/product.entity'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule)
  try {
    const superUser = await app.get(SuperuserSeed).run()
    const user = {
      id: superUser.id,
      email: superUser.email,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      name: 'Super User Admin'
    }
    const resellerIds = await app.get(ResellerSeed).run(user)
    const resellerPayload = {
      id: resellerIds[0],
      email: 'reseller@luxis.com',
      role: Role.RESELLER,
      status: UserStatus.ACTIVE,
      name: 'Reseller User'
    }

    const supplierIds = await app.get(SupplierSeed).run()

    await app.get(BatchSeed).run(supplierIds)

    const productRepo = app.get('ProductRepository')
    const products: Product[] = await productRepo.findAll()
    console.log('products ', products)
    const productIds = products.map((p) => p.id)
    console.log('Produtos gerados:', productIds)
    const customerIds = await app.get(CustomerSeed).run(resellerPayload)

    if (productIds.length < 4)
      throw new Error('Seeds: menos de 4 produtos gerados!')
    if (customerIds.length < 1) throw new Error('Seeds: nenhum cliente gerado!')
    await app
      .get(ShipmentSeed)
      .run(
        resellerIds[0],
        [productIds[0], productIds[1], productIds[2], productIds[3]],
        resellerPayload
      )

    await app
      .get(SaleSeed)
      .run(customerIds[0], [productIds[0], productIds[1]], resellerPayload)
    await app
      .get(ReturnSeed)
      .run(resellerIds[0], [productIds[2]], resellerPayload)
    await app
      .get(OwnershipTransferSeed)
      .run(productIds[3], resellerIds[0], resellerIds[1], resellerPayload)
    console.log('Seeds executados com sucesso!')
  } catch (error) {
    console.error('Erro ao rodar seeds:', error)
  } finally {
    await app.close()
  }
}

bootstrap()
