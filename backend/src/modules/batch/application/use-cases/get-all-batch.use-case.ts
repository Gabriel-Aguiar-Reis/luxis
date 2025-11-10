import { GetBatchDto } from '@/modules/batch/application/dtos/get-batch.dto'
import { GetBatchProductDto } from '@/modules/batch/application/dtos/get-batch-product.dto'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllBatchUseCase {
  constructor(
    @Inject('BatchRepository')
    private readonly batchRepository: BatchRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(): Promise<GetBatchDto[]> {
    const batches = await this.batchRepository.findAll()
    // Busca todos os fornecedores
    const supplierIds = [...new Set(batches.map(b => b.supplierId))]
  const suppliers = await this.supplierRepository.findManyByIds(supplierIds)
  const supplierMap = new Map(suppliers.map(s => [s.id, s]))

    // Busca todos os models para mapear nomes
    const allModelIds: string[] = []
    // Monta o DTO de cada batch
    return await Promise.all(batches.map(async batch => {
      const products = await this.productRepository.findByBatchId(batch.id)
      products.forEach(p => allModelIds.push(p.modelId))
      // Busca os models dos produtos desse batch
      const models = await this.productModelRepository.findManyByIds(products.map(p => p.modelId))
      const modelMap = new Map(models.map(m => [m.id, m]))

      const items = products.map(p => {
        const modelNameObj = modelMap.get(p.modelId)?.name
        const item = new GetBatchProductDto(
          p.id,
          p.serialNumber,
          p.modelId,
          p.batchId,
          p.unitCost,
          p.salePrice,
          p.status
        )
        item.modelName = modelNameObj ?? new (Object.getPrototypeOf(item).constructor.ModelName)('')
        item.quantity = 1
        return item
      })

      // Total de itens e custo
      const totalItems = products.length
      // Soma unitCost de todos os produtos
      const totalCostValue = products.reduce((acc, p) => acc + Number(p.unitCost.getValue()), 0)
  const totalCost = new Currency(totalCostValue.toFixed(2))

      function getSupplierName(supplier?: { name?: { getValue?: () => string } }) {
        return supplier?.name?.getValue?.() || ''
      }

      return {
        id: batch.id,
        arrivalDate: batch.arrivalDate,
        supplierId: batch.supplierId,
        supplierName: getSupplierName(supplierMap.get(batch.supplierId)),
        totalItems,
        totalCost,
        items
      }
    }))
  }
}
