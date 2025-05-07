import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { CategoryName } from '@/modules/category/domain/value-objects/category-name.vo'
import { Description } from '@/shared/common/value-object/description.vo'
import { UUID } from 'crypto'
import { ApiProperty } from '@nestjs/swagger'

export class Category {
  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public readonly id: UUID

  @ApiProperty({
    description: 'The name of the category',
    example: 'Smartphones',
    type: String
  })
  public name: CategoryName

  @ApiProperty({
    description: 'The description of the category',
    example: 'Electronic devices for communication',
    type: String,
    required: false
  })
  public description?: Description

  @ApiProperty({
    description: 'The status of the category',
    enum: CategoryStatus,
    example: CategoryStatus.ACTIVE,
    type: String
  })
  public status: CategoryStatus

  constructor(
    id: UUID,
    name: CategoryName,
    description?: Description,
    status: CategoryStatus = CategoryStatus.ACTIVE
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.status = status
  }
}
