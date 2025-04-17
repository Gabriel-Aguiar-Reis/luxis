import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreatePackingListDto {
  @IsString()
  @IsNotEmpty()
  resellerId: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productIds: string[] = []
}
