import { GetAvailableCategoriesDto } from '@/lib/api-types'

export type AvailableCategory = GetAvailableCategoriesDto[number]
export type AvailableModel = AvailableCategory['models'][number]
export type AvailableProduct = AvailableModel['products'][number]

export type FilteredModel = AvailableModel & {
  _displayProducts: AvailableProduct[]
}

export type FilteredCategory = AvailableCategory & {
  _models: FilteredModel[]
}

export function filterProductCategories(
  categories: GetAvailableCategoriesDto,
  search: string
): FilteredCategory[] {
  const searchLower = search.trim().toLowerCase()

  return categories
    .map((category) => {
      const categoryMatch = Boolean(
        searchLower &&
          category.categoryName.value.toLowerCase().includes(searchLower)
      )
      const models = category.models
        .map((model) => {
          const modelMatch = Boolean(
            searchLower &&
              model.modelName.value.toLowerCase().includes(searchLower)
          )
          const products = !searchLower
            ? model.products
            : modelMatch || categoryMatch
              ? model.products
              : model.products.filter((product) =>
                  product.serialNumber?.value
                    ?.toLowerCase()
                    .includes(searchLower)
                )

          return { ...model, _displayProducts: products }
        })
        .filter((model) => model._displayProducts.length > 0)

      return { ...category, _models: models }
    })
    .filter((category) => category._models.length > 0)
}
