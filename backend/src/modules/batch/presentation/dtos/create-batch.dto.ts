import { BatchItem } from '@/modules/batch/domain/entities/batch-item.entity'
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'

export class CreateBatchDto {
  @IsDate()
  @IsNotEmpty()
  arrivalDate: Date

  @IsUUID()
  @IsNotEmpty()
  supplierId: UUID

  @IsArray()
  @ArrayNotEmpty()
  items: BatchItem[] = []
}
