import { OwnershipTransferStatus } from "@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum"
import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty } from "class-validator"

export class UpdateOwnershipTransferStatusDto {
  @ApiProperty({
    description: 'The new status of the ownership transfer',
    example: OwnershipTransferStatus.APPROVED,
    enum: OwnershipTransferStatus,
    enumName: 'OwnershipTransferStatus',
    required: true
  })
  @IsEnum(OwnershipTransferStatus)
  @IsNotEmpty()
  status: OwnershipTransferStatus
}