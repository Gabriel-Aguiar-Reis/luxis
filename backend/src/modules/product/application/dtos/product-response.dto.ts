import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class ProductResponseDto {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  id: UUID

  @ApiProperty({ type: String, example: '0424A-BR-BAB-001' })
  @IsString()
  serialNumber: string

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  modelId: UUID

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  batchId: UUID

  @ApiProperty({ type: String, example: '100.00' })
  @IsString()
  unitCost: string

  @ApiProperty({ type: String, example: '150.00' })
  @IsString()
  salePrice: string

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.IN_STOCK })
  @IsEnum(ProductStatus)
  status: ProductStatus
}
