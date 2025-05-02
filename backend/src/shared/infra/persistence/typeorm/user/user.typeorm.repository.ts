import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/modules/user/domain/entities/user.entity'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { UserMapper } from '@/shared/infra/persistence/typeorm/user/mappers/user.mapper'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UUID } from 'crypto'

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find()
    return entities.map(UserMapper.toDomain)
  }

  async findById(id: UUID): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return UserMapper.toDomain(entity)
  }

  async create(user: User): Promise<User> {
    const entity = UserMapper.toTypeOrm(user)
    const savedEntity = await this.repository.save(entity)
    return UserMapper.toDomain(savedEntity)
  }

  async update(user: User): Promise<User> {
    const entity = UserMapper.toTypeOrm(user)
    const updatedEntity = await this.repository.save(entity)
    return UserMapper.toDomain(updatedEntity)
  }

  async updateRole(id: UUID, role: Role): Promise<User> {
    await this.repository.update(id, { role })
    const updatedEntity = await this.repository.findOne({ where: { id } })
    if (!updatedEntity) throw new Error('User not found')
    return UserMapper.toDomain(updatedEntity)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }

  async disable(id: UUID): Promise<User> {
    await this.repository.update(id, { status: UserStatus.DISABLED })
    const updatedEntity = await this.repository.findOne({ where: { id } })
    if (!updatedEntity) throw new Error('User not found')
    return UserMapper.toDomain(updatedEntity)
  }
}
