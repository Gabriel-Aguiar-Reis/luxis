import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { OwnershipTransferReadRepository } from '@/modules/kpi/admin/domain/repositories/ownership-transfer-read.repository'
import { UUID } from 'crypto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { ownershipTransfersByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/ownership-transfers-by-reseller-id'
import { totalOwnershipTransfersByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/total-ownership-transfers-by-reseller-id'
import { ownershipTransfersInPeriod } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/ownership-transfers-in-period'
import { totalOwnershipTransfersInPeriod } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/total-ownership-transfers-in-period'
import { ownershipTransfersReceivedByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/ownership-transfers-received-by-reseller-id'
import { totalOwnershipTransfersReceivedByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/total-ownership-transfers-received-by-reseller-id'
import { ownershipTransfersGivenByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/ownership-transfers-given-by-reseller-id'
import { totalOwnershipTransfersGivenByResellerId } from '@/shared/infra/persistence/typeorm/kpi/admin/ownership-transfer-read-methods/total-ownership-transfers-given-by-reseller-id'

export class OwnershipTransferReadTypeormRepository
  implements OwnershipTransferReadRepository
{
  constructor(
    @InjectRepository(OwnershipTransferTypeOrmEntity)
    private readonly ownershipTransferRepo: Repository<OwnershipTransferTypeOrmEntity>
  ) {}

  async ownershipTransfersByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any> {
    return ownershipTransfersByResellerId(
      this.ownershipTransferRepo,
      id,
      qParams
    )
  }

  async totalOwnershipTransfersByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any> {
    return totalOwnershipTransfersByResellerId(
      this.ownershipTransferRepo,
      id,
      qParams
    )
  }

  async ownershipTransfersInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<any> {
    return ownershipTransfersInPeriod(this.ownershipTransferRepo, qParams)
  }

  async totalOwnershipTransfersInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<any> {
    return totalOwnershipTransfersInPeriod(this.ownershipTransferRepo, qParams)
  }

  async ownershipTransfersReceivedByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any> {
    return ownershipTransfersReceivedByResellerId(
      this.ownershipTransferRepo,
      id,
      qParams
    )
  }

  async totalOwnershipTransfersReceivedByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any> {
    return totalOwnershipTransfersReceivedByResellerId(
      this.ownershipTransferRepo,
      id,
      qParams
    )
  }

  async ownershipTransfersGivenByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any> {
    return ownershipTransfersGivenByResellerId(
      this.ownershipTransferRepo,
      id,
      qParams
    )
  }

  async totalOwnershipTransfersGivenByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any> {
    return totalOwnershipTransfersGivenByResellerId(
      this.ownershipTransferRepo,
      id,
      qParams
    )
  }
}
