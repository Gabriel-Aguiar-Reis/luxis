import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'
import { CreateBatchItemDto } from '@/modules/batch/presentation/dtos/create-batch-item.dto'

export class CreateBatchDto {
  @ApiProperty({
    description: 'The arrival date of the batch',
    example: '2021-01-01',
    type: Date,
    required: true
  })
  @IsDate()
  @IsNotEmpty()
  arrivalDate: Date

  @ApiProperty({
    description: 'The ID of the supplier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  supplierId: UUID

  @ApiProperty({
    description: 'The items of the batch',
    example: [
      {
        modelName: 'Model Name',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 1,
        unitCost: '100.00',
        salePrice: '100.00',
        modelId: '123e4567-e89b-12d3-a456-426614174000'
      }
    ],
    type: [CreateBatchItemDto],
    required: true
  })
  @IsArray()
  @ArrayNotEmpty()
  items: CreateBatchItemDto[]
}
