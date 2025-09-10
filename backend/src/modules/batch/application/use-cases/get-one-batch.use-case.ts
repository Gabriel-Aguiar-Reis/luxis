
import { GetBatchDto } from '@/modules/batch/application/dtos/get-batch.dto'
import { GetBatchProductDto } from '@/modules/batch/application/dtos/get-batch-product.dto'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneBatchUseCase {
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

  async execute(id: UUID): Promise<GetBatchDto> {
    const batch = await this.batchRepository.findById(id)
    if (!batch) {
      throw new NotFoundException('Batch not found')
    }

    // Busca produtos do batch
    const products = await this.productRepository.findByBatchId(batch.id)
    // Busca models dos produtos
    const models = await this.productModelRepository.findManyByIds(products.map(p => p.modelId))
    const modelMap = new Map(models.map(m => [m.id, m]))

    // Monta os itens do batch
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
    const totalCostValue = products.reduce((acc, p) => acc + Number(p.unitCost.getValue()), 0)
    const totalCost = new Currency(totalCostValue.toFixed(2))

    // Busca fornecedor
    const supplier = batch.supplierId ? await this.supplierRepository.findById(batch.supplierId) : undefined
    function getSupplierName(supplier?: { name?: { getValue?: () => string } }) {
      return supplier?.name?.getValue?.() || ''
    }

    return {
      id: batch.id,
      arrivalDate: batch.arrivalDate,
      supplierId: batch.supplierId,
      supplierName: getSupplierName(supplier ?? undefined),
      totalItems,
      totalCost,
      items
    }
  }
}
