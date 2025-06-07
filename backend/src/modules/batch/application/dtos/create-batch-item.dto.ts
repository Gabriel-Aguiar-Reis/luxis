import { Unit } from '@/shared/common/value-object/unit.vo'
import { ModelName } from '@/modules/product-model/domain/value-objects/model-name.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import {
  IsCurrency,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min
} from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'

export class CreateBatchItemDto {
  @ApiProperty({
    description: 'The name of the model',
    example: 'Model Name',
    type: ModelName,
    required: true
  })
  @IsString()
  @IsOptional()
  modelName?: string

  @ApiProperty({
    description: 'The ID of the model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsOptional()
  modelId?: UUID

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
  @IsOptional()
  @IsCurrency()
  unitCost?: Currency

  @ApiProperty({
    description: 'The sale price of the batch item',
    example: '100.00',
    type: Currency,
    required: true
  })
  @IsOptional()
  @IsCurrency()
  salePrice?: Currency

  @ApiProperty({
    description: 'The Photo URL of the batch item',
    example: 'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis',
    type: String,
    required: false
  })
  @IsUrl()
  @IsOptional()
  photoUrl?: ImageURL
}
