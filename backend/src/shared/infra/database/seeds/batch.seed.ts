import { Injectable } from '@nestjs/common'
import { CreateBatchUseCase } from '@/modules/batch/application/use-cases/create-batch.use-case'
import { CreateCategoryUseCase } from '@/modules/category/application/use-cases/create-category.use-case'
import { CreateBatchDto } from '@/modules/batch/application/dtos/create-batch.dto'
import { CreateCategoryDto } from '@/modules/category/application/dtos/create-category.dto'
import { UUID } from 'crypto'
import * as fs from 'fs'
import { UpdateProductModelUseCase } from '@/modules/product-model/application/use-cases/update-product-model.use-case'
import { ImageURL } from '@/modules/product-model/domain/value-objects/image-url.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'

@Injectable()
export class BatchSeed {
  constructor(
    private readonly createBatchUseCase: CreateBatchUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateProductModelUseCase: UpdateProductModelUseCase
  ) {}

  async run(supplierIds: UUID[]): Promise<UUID[]> {
    const categories: CreateCategoryDto[] = [
      { name: 'Anéis', description: 'Anéis de semijoia' },
      { name: 'Brincos', description: 'Brincos de semijoia' },
      { name: 'Colares', description: 'Colares de semijoia' },
      { name: 'Pulseiras', description: 'Pulseiras de semijoia' }
    ]
    const categoryIds: UUID[] = []
    for (const category of categories) {
      const created = await this.createCategoryUseCase.execute(category)
      categoryIds.push(created.id)
    }

    const batches: CreateBatchDto[] = [
      {
        arrivalDate: new Date('2024-05-01'),
        supplierId: supplierIds[0],
        items: [
          {
            modelName: 'Anel Solitário',
            categoryId: categoryIds[0],
            quantity: 10,
            unitCost: new Currency('60.00'),
            salePrice: new Currency('120.00'),
            photoUrl: new ImageURL(
              'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis'
            )
          },
          {
            modelName: 'Brinco Argola',
            categoryId: categoryIds[1],
            quantity: 15,
            unitCost: new Currency('40.00'),
            salePrice: new Currency('80.00'),
            photoUrl: new ImageURL(
              'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis'
            )
          }
        ]
      },
      {
        arrivalDate: new Date('2024-05-10'),
        supplierId: supplierIds[1],
        items: [
          {
            modelName: 'Colar Coração',
            categoryId: categoryIds[2],
            quantity: 8,
            unitCost: new Currency('75.00'),
            salePrice: new Currency('150.00'),
            photoUrl: new ImageURL(
              'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis'
            )
          },
          {
            modelName: 'Pulseira Riviera',
            categoryId: categoryIds[3],
            quantity: 12,
            unitCost: new Currency('100.00'),
            salePrice: new Currency('200.00'),
            photoUrl: new ImageURL(
              'https://dummyimage.com/500x500/cccccc/000000.png&text=Luxis'
            )
          }
        ]
      }
    ]
    const ids: UUID[] = []
    for (const batch of batches) {
      const created = await this.createBatchUseCase.execute(batch)
      ids.push(created.id)
    }

    let photoUrl: string | undefined
    try {
      const cloudinaryService = (global as any).app?.get?.('CloudinaryService')
      if (cloudinaryService) {
        const file: Express.Multer.File = {
          fieldname: 'photo',
          originalname: 'modelo.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: fs.readFileSync('src/shared/common/assets/modelo.jpg'),
          size: fs.statSync('src/shared/common/assets/modelo.jpg').size,
          destination: '',
          filename: 'modelo.jpg',
          path: 'src/shared/common/assets/modelo.jpg',
          stream: undefined as any
        }
        photoUrl = await cloudinaryService.uploadImage(file, 'product-models')
      }
    } catch (e) {
      console.error('Erro ao fazer upload da foto única do modelo:', e)
    }
    if (photoUrl) {
      const productModelRepo =
        (global as any).app?.get?.('ProductModelRepository') || undefined
      if (productModelRepo) {
        const models = await productModelRepo.findAll()
        for (const model of models) {
          await this.updateProductModelUseCase.execute(model.id, {
            photoUrl
          })
        }
      }
    }
    return ids
  }
}
