import { IsCurrency, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
  @ApiProperty({
    description: 'The serial number of the product',
    example: '1234567890',
    type: String,
    required: true
  })
  @IsString({ message: 'Numero de serie deve ser texto.' })
  @IsNotEmpty({ message: 'Numero de serie e obrigatorio.' })
  serialNumber: string

  @ApiProperty({
    description: 'The ID of the product model',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  modelId: UUID

  @ApiProperty({
    description: 'The ID of the batch',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  batchId: UUID

  @ApiProperty({
    description: 'The unit cost of the product',
    example: '100.00',
    type: String,
    required: true
  })
  @IsString({ message: 'Custo unitario deve ser texto.' })
  @IsNotEmpty({ message: 'Custo unitario e obrigatorio.' })
  @IsCurrency(
    { allow_negatives: false, require_decimal: true },
    { message: 'Custo unitario deve usar decimal com ponto, como 99.90.' }
  )
  unitCost: string

  @ApiProperty({
    description: 'The sale price of the product',
    example: '100.00',
    type: String,
    required: true
  })
  @IsString({ message: 'Preco de venda deve ser texto.' })
  @IsNotEmpty({ message: 'Preco de venda e obrigatorio.' })
  @IsCurrency(
    { allow_negatives: false, require_decimal: true },
    { message: 'Preco de venda deve usar decimal com ponto, como 149.90.' }
  )
  salePrice: string
}
