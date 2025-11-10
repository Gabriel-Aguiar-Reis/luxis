import { Injectable } from '@nestjs/common'
import { PasswordResetRequestRepository } from '@/modules/auth/domain/repositories/password-reset-request.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { PasswordResetRequestTypeOrmEntity } from '@/shared/infra/persistence/typeorm/auth/password-reset-requests/password-reset-requests.typeorm.entity'
import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'
import { Repository } from 'typeorm'
import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { UUID } from 'crypto'
import { PasswordResetRequestMapper } from '@/shared/infra/persistence/typeorm/auth/password-reset-requests/mappers/password-reset-request.mapper'

@Injectable()
export class PasswordResetRequestTypeOrmRepository
  implements PasswordResetRequestRepository
{
  constructor(
    @InjectRepository(PasswordResetRequestTypeOrmEntity)
    private readonly repository: Repository<PasswordResetRequestTypeOrmEntity>
  ) {}

  async create(request: PasswordResetRequest): Promise<PasswordResetRequest> {
    const entity = PasswordResetRequestMapper.toTypeOrmEntity(request)
    const savedEntity = await this.repository.save(entity)
    return PasswordResetRequestMapper.toDomainEntity(savedEntity)
  }

  async findById(id: UUID): Promise<PasswordResetRequest | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? PasswordResetRequestMapper.toDomainEntity(entity) : null
  }

  async findByToken(token: string): Promise<PasswordResetRequest | null> {
    const entity = await this.repository.findOne({ where: { token } })
    return entity ? PasswordResetRequestMapper.toDomainEntity(entity) : null
  }

  async findAll(): Promise<PasswordResetRequest[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' }
    })
    return entities.map(PasswordResetRequestMapper.toDomainEntity)
  }

  async findByStatus(
    status: PasswordResetRequestStatus
  ): Promise<PasswordResetRequest[]> {
    const entities = await this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
      relations: ['user']
    })
    return entities.map(PasswordResetRequestMapper.toDomainEntity)
  }

  async update(request: PasswordResetRequest): Promise<PasswordResetRequest> {
    const entity = PasswordResetRequestMapper.toTypeOrmEntity(request)
    const savedEntity = await this.repository.save(entity)
    return PasswordResetRequestMapper.toDomainEntity(savedEntity)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
