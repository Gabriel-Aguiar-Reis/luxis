import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, Length } from 'class-validator'
import { IsBrazilianPhone } from '@/shared/common/validators/is-brazilian-phone.validator'

export class CreateSupplierDto {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'John Doe',
    type: String,
    required: true
  })
  @IsString({ message: 'Nome deve ser texto.' })
  @Length(2, 80, { message: 'Nome deve ter entre 2 e 80 caracteres.' })
  @IsNotEmpty({ message: 'Nome e obrigatorio.' })
  name: string

  @ApiProperty({
    description: 'The phone number of the supplier',
    example: '+5511999999999',
    type: String,
    required: true
  })
  @IsString({ message: 'Telefone deve ser texto.' })
  @IsBrazilianPhone()
  @IsNotEmpty({ message: 'Telefone e obrigatorio.' })
  phone: string
}
