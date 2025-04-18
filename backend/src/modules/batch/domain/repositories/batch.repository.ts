import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { UUID } from 'crypto'

export abstract class BatchRepository {
  abstract findAll(): Promise<Batch[]>
  abstract findAllByMonthAndYear(month: number, year: number): Promise<Batch[]>
  abstract findById(id: UUID): Promise<Batch | null>
  abstract create(batch: Batch): Promise<Batch>
  abstract update(batch: Batch): Promise<Batch>
  abstract delete(id: UUID): Promise<void>
}
