import { UUID } from 'crypto'

export class TotalReturnsByResellerDto {
  public id: UUID
  public resellerId: UUID
  public resellerName: string
  public totalReturns: number
}
