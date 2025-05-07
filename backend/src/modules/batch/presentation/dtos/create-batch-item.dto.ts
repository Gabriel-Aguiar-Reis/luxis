import { Unit } from '@/shared/common/value-object/unit.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import {
  IsCurrency,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min
} from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateBatchItemDto {
  @ApiProperty({
    description: 'The name of the model',
    example: 'Model Name',
    type: ModelName,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  modelName: string

  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: UUID

  @ApiProperty({
    description: 'The quantity of the batch item',
    default: 1,
    type: Unit,
    required: true
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    description: 'The unit cost of the batch item',
    example: '100.00',
    type: Currency,
    required: true
  })
  @IsNotEmpty()
  @IsCurrency()
  unitCost: string

  @ApiProperty({
    description: 'The sale price of the batch item',
    example: '100.00',
    type: Currency,
    required: true
  })
  @IsNotEmpty()
  @IsCurrency()
  salePrice: string
}
