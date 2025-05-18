import { UUID } from 'crypto'

export class TotalReturnsByResellerDto {
  public resellerId: UUID
  public resellerName: string
  public totalReturns: number
}
