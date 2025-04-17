import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProductModelDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  categoryId: string

  @IsString()
  @IsOptional()
  description?: string
}
