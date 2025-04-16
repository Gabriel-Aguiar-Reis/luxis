import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProductModelDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  category: string

  @IsString()
  @IsOptional()
  description?: string
}
