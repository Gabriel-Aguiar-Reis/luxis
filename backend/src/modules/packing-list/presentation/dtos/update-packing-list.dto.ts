import { PackingListStatus } from '@/modules/packing-list/domain/enums/packing-list-status.enum'
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class UpdatePackingListDto {
  @IsUUID()
  @IsOptional()
  resellerId: UUID

  @IsEnum(PackingListStatus)
  @IsOptional()
  status: PackingListStatus

  @IsArray()
  @IsOptional()
  productIds: UUID[] = []
}
