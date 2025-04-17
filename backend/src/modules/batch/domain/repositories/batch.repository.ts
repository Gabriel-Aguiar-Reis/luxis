import { Batch } from '@/modules/batch/domain/entities/batch.entity'

export abstract class BatchRepository {
  abstract findAll(): Promise<Batch[]>
  abstract findById(id: string): Promise<Batch | null>
  abstract create(batch: Batch): Promise<Batch>
  abstract update(batch: Batch): Promise<Batch>
  abstract delete(id: string): Promise<void>
}
