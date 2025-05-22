import { ParamsWithMandatoryPeriodDto } from '@/shared/common/dtos/params-with-mandatory-period.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'

export abstract class OwnershipTransferReadRepository {
  abstract ownershipTransfersByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any>
  abstract totalOwnershipTransfersByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any>
  abstract ownershipTransfersInPeriod(qParams: ParamsWithMandatoryPeriodDto)
  abstract totalOwnershipTransfersInPeriod(
    qParams: ParamsWithMandatoryPeriodDto
  ): Promise<any>
  abstract ownershipTransfersReceivedByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any>
  abstract totalOwnershipTransfersReceivedByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any>
  abstract ownershipTransfersGivenByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any>
  abstract totalOwnershipTransfersGivenByResellerId(
    id: UUID,
    qParams: ParamsDto
  ): Promise<any>
}
