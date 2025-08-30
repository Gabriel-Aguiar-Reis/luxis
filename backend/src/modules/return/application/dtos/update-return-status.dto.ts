import { ReturnStatus } from "@/modules/return/domain/enums/return-status.enum"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class UpdateReturnStatusDto {
  @ApiProperty({
    description: 'The status of the return',
    example: 'CANCELLED',
    enum: ReturnStatus,
    required: true
  })
  @IsNotEmpty()
  status: ReturnStatus
}