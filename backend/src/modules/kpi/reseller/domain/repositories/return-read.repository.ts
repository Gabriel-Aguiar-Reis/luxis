import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'

export abstract class ReturnReadRepository {
  abstract returnsMadeByResellerId(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<number>
}
