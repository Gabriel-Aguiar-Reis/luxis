import { http, HttpResponse } from 'msw'

type Value<T extends string | number> = { value: T }
type Entity = { id: string }
type User = Entity & {
  name: Value<string>
  surname: Value<string>
  phone: Value<string>
  email: Value<string>
  passwordHash: string
  role: 'ADMIN' | 'RESELLER' | 'ASSISTANT' | 'UNASSIGNED'
  status: 'ACTIVE' | 'DISABLED' | 'PENDING'
  residence: {
    address: {
      street: Value<string>
      number: Value<string>
      complement?: Value<string>
      neighborhood: Value<string>
      city: Value<string>
      state: Value<string>
      postalCode: Value<string>
    }
  }
}
type Category = Entity & {
  name: Value<string>
  description?: Value<string>
  status: 'ACTIVE' | 'INACTIVE'
}
type Supplier = Entity & { name: Value<string>; phone: Value<string> }
type ProductModel = Entity & {
  name: Value<string>
  categoryId: string
  suggestedPrice: Value<string>
  description?: Value<string>
  photoUrl?: Value<string>
  status: 'USED' | 'ACTIVE' | 'ARCHIVED'
}
type Product = Entity & {
  serialNumber: Value<string>
  modelId: string
  batchId: string
  unitCost: Value<string>
  salePrice: Value<string>
  status: 'IN_STOCK' | 'ASSIGNED' | 'SOLD'
  ownerId?: string
  soldAt?: string
}
type Batch = Entity & { arrivalDate: string; supplierId: string }
type Customer = Entity & { name: Value<string>; phone: Value<string> }
type Sale = Entity & {
  customerId: string
  resellerId: string
  productIds: string[]
  saleDate: string
  totalAmount: Value<string>
  paymentMethod: 'CASH' | 'PIX' | 'DEBIT' | 'CREDIT' | 'EXCHANGE'
  numberInstallments: Value<number>
  installmentsInterval: Value<number>
  installmentsPaid: Value<number>
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'INSTALLMENTS_PENDING'
    | 'INSTALLMENTS_PAID'
    | 'INSTALLMENTS_OVERDUE'
}
type Shipment = Entity & {
  resellerId: string
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'DELIVERED' | 'CANCELLED'
  productIds: string[]
}
type ReturnRequest = Entity & {
  resellerId: string
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'CANCELLED'
  productIds: string[]
}
type Transfer = Entity & {
  productId: string
  fromResellerId: string
  toResellerId: string
  transferDate: string
  status: 'PENDING' | 'APPROVED' | 'FINISHED' | 'CANCELLED'
}
type PasswordResetRequest = Entity & {
  email: Value<string>
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
}
type MockDb = {
  users: User[]
  categories: Category[]
  suppliers: Supplier[]
  productModels: ProductModel[]
  products: Product[]
  batches: Batch[]
  customers: Customer[]
  sales: Sale[]
  shipments: Shipment[]
  returns: ReturnRequest[]
  transfers: Transfer[]
  passwordResetRequests: PasswordResetRequest[]
}

type MockResult = {
  body?: any
  status?: number
}

let counter = 1000
let currentUserId = 'user-admin'

function id(prefix: string) {
  counter += 1
  return `${prefix}-${counter}`
}

function vo<T extends string | number>(value: T): Value<T> {
  return { value }
}

function money(value: number) {
  return vo(value.toFixed(2))
}

function iso(daysAgo: number) {
  const date = new Date('2026-09-11T12:00:00.000Z')
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

function createProducts(batchId: string, modelId: string, count: number) {
  return Array.from(
    { length: count },
    (_, index): Product => ({
      id: id('prod'),
      serialNumber: vo(
        `${modelId.toUpperCase()}-${String(index + 1).padStart(3, '0')}`
      ),
      modelId,
      batchId,
      unitCost: money(modelId.includes('anel') ? 52 : 38),
      salePrice: money(modelId.includes('anel') ? 139.9 : 89.9),
      status: 'IN_STOCK'
    })
  )
}

function createSeed(): MockDb {
  counter = 1000
  const admin: User = {
    id: 'user-admin',
    name: vo('Gabriel'),
    surname: vo('Admin'),
    phone: vo('+5511999990000'),
    email: vo('admin@luxis.local'),
    passwordHash: 'mock',
    role: 'ADMIN',
    status: 'ACTIVE',
    residence: {
      address: {
        street: vo('Rua das Joias'),
        number: vo('100'),
        neighborhood: vo('Centro'),
        city: vo('Sao Paulo'),
        state: vo('SP'),
        postalCode: vo('01001000')
      }
    }
  }
  const resellerA: User = {
    ...admin,
    id: 'user-reseller-a',
    name: vo('Marina'),
    surname: vo('Costa'),
    email: vo('marina@luxis.local'),
    phone: vo('+5511988881111'),
    role: 'RESELLER'
  }
  const resellerB: User = {
    ...admin,
    id: 'user-reseller-b',
    name: vo('Renata'),
    surname: vo('Lima'),
    email: vo('renata@luxis.local'),
    phone: vo('+5511977772222'),
    role: 'RESELLER'
  }
  const pendingUser: User = {
    ...admin,
    id: 'user-pending',
    name: vo('Clara'),
    surname: vo('Pendente'),
    email: vo('clara@luxis.local'),
    phone: vo('+5511966663333'),
    role: 'UNASSIGNED',
    status: 'PENDING'
  }

  const categories: Category[] = [
    {
      id: 'cat-aneis',
      name: vo('Aneis'),
      description: vo('Aneis folheados e semijoias finas'),
      status: 'ACTIVE'
    },
    {
      id: 'cat-colares',
      name: vo('Colares'),
      description: vo('Colares, gargantilhas e escapularios'),
      status: 'ACTIVE'
    },
    {
      id: 'cat-brincos',
      name: vo('Brincos'),
      description: vo('Brincos para uso diario e festas'),
      status: 'ACTIVE'
    }
  ]
  const suppliers: Supplier[] = [
    {
      id: 'sup-aurora',
      name: vo('Aurora Semijoias'),
      phone: vo('+551132323232')
    },
    { id: 'sup-bela', name: vo('Bela Prata'), phone: vo('+551133334444') }
  ]
  const productModels: ProductModel[] = [
    {
      id: 'model-anel-sol',
      name: vo('Anel Solitario Zircônia'),
      categoryId: 'cat-aneis',
      suggestedPrice: money(139.9),
      description: vo('Banho ouro 18k com pedra central'),
      photoUrl: vo(
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e'
      ),
      status: 'ACTIVE'
    },
    {
      id: 'model-colar-luz',
      name: vo('Colar Ponto de Luz'),
      categoryId: 'cat-colares',
      suggestedPrice: money(89.9),
      description: vo('Colar delicado com zircônia'),
      photoUrl: vo(
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f'
      ),
      status: 'ACTIVE'
    },
    {
      id: 'model-brinco-argola',
      name: vo('Brinco Argola Lisa'),
      categoryId: 'cat-brincos',
      suggestedPrice: money(79.9),
      description: vo('Argola media para revenda'),
      status: 'USED'
    }
  ]
  const batches: Batch[] = [
    { id: 'batch-001', supplierId: 'sup-aurora', arrivalDate: iso(42) },
    { id: 'batch-002', supplierId: 'sup-bela', arrivalDate: iso(12) }
  ]
  const products = [
    ...createProducts('batch-001', 'model-anel-sol', 8),
    ...createProducts('batch-001', 'model-colar-luz', 7),
    ...createProducts('batch-002', 'model-brinco-argola', 6)
  ]
  products[0].status = 'ASSIGNED'
  products[0].ownerId = resellerA.id
  products[1].status = 'SOLD'
  products[1].ownerId = resellerA.id
  products[1].soldAt = iso(3)
  products[9].status = 'ASSIGNED'
  products[9].ownerId = resellerB.id
  products[10].status = 'SOLD'
  products[10].ownerId = resellerB.id
  products[10].soldAt = iso(6)

  const customers: Customer[] = [
    { id: 'cust-ana', name: vo('Ana Beatriz'), phone: vo('+5511911112222') },
    {
      id: 'cust-julia',
      name: vo('Julia Andrade'),
      phone: vo('+5511933334444')
    },
    {
      id: 'cust-paula',
      name: vo('Paula Nogueira'),
      phone: vo('+5511955556666')
    }
  ]
  const sales: Sale[] = [
    {
      id: 'sale-001',
      customerId: 'cust-ana',
      resellerId: resellerA.id,
      productIds: [products[1].id],
      saleDate: iso(3),
      totalAmount: money(139.9),
      paymentMethod: 'PIX',
      numberInstallments: vo(1),
      installmentsInterval: vo(0),
      installmentsPaid: vo(1),
      status: 'CONFIRMED'
    },
    {
      id: 'sale-002',
      customerId: 'cust-julia',
      resellerId: resellerB.id,
      productIds: [products[10].id],
      saleDate: iso(6),
      totalAmount: money(89.9),
      paymentMethod: 'CREDIT',
      numberInstallments: vo(3),
      installmentsInterval: vo(30),
      installmentsPaid: vo(1),
      status: 'INSTALLMENTS_PENDING'
    }
  ]

  return {
    users: [admin, resellerA, resellerB, pendingUser],
    categories,
    suppliers,
    productModels,
    products,
    batches,
    customers,
    sales,
    shipments: [
      {
        id: 'ship-001',
        resellerId: resellerA.id,
        createdAt: iso(10),
        status: 'DELIVERED',
        productIds: [products[0].id]
      },
      {
        id: 'ship-002',
        resellerId: resellerB.id,
        createdAt: iso(4),
        status: 'PENDING',
        productIds: [products[9].id]
      }
    ],
    returns: [
      {
        id: 'ret-001',
        resellerId: resellerB.id,
        createdAt: iso(2),
        status: 'PENDING',
        productIds: [products[9].id]
      }
    ],
    transfers: [
      {
        id: 'trans-001',
        productId: products[0].id,
        fromResellerId: resellerA.id,
        toResellerId: resellerB.id,
        transferDate: iso(1),
        status: 'PENDING'
      }
    ],
    passwordResetRequests: [
      {
        id: 'reset-001',
        email: vo('marina@luxis.local'),
        status: 'PENDING',
        createdAt: iso(1)
      }
    ]
  }
}

const database = createSeed()

function result(body?: unknown, status = 200): MockResult {
  return { body, status }
}

function noContent(): MockResult {
  return { status: 204 }
}

function notFound(message = 'Registro mock não encontrado'): MockResult {
  return result({ message }, 404)
}

async function readBody(request: Request) {
  const text = await request.text()
  return text ? JSON.parse(text) : {}
}

function fullName(user?: User) {
  return user ? `${user.name.value} ${user.surname.value}` : 'N/A'
}

function model(product: Product) {
  return database.productModels.find((item) => item.id === product.modelId)
}

function batch(batchId: string) {
  return database.batches.find((item) => item.id === batchId)
}

function productsById(productIds: string[]) {
  return productIds
    .map((productId) =>
      database.products.find((product) => product.id === productId)
    )
    .filter(Boolean) as Product[]
}

function saleProduct(product: Product) {
  return {
    id: product.id,
    serialNumber: product.serialNumber,
    modelId: product.modelId,
    modelName: model(product)?.name ?? vo('Modelo removido'),
    salePrice: product.salePrice,
    unitCost: product.unitCost,
    status: product.status
  }
}

function batchDto(item: Batch) {
  const items = database.products
    .filter((product) => product.batchId === item.id)
    .map((product) => ({
      ...saleProduct(product),
      batchId: item.id,
      quantity: 1
    }))
  const supplier = database.suppliers.find(
    (entry) => entry.id === item.supplierId
  )
  return {
    ...item,
    supplierName: supplier?.name.value ?? 'Fornecedor removido',
    totalItems: items.length,
    totalCost: money(
      items.reduce((sum, product) => sum + Number(product.unitCost.value), 0)
    ),
    items
  }
}

function saleDto(sale: Sale) {
  const customer = database.customers.find(
    (item) => item.id === sale.customerId
  )
  const reseller = database.users.find((item) => item.id === sale.resellerId)
  return {
    ...sale,
    customerName: customer?.name ?? vo('Cliente removida'),
    customerPhone: customer?.phone ?? vo(''),
    resellerName: fullName(reseller),
    products: productsById(sale.productIds).map(saleProduct)
  }
}

function kpiSaleDto(sale: Sale) {
  const customer = database.customers.find(
    (item) => item.id === sale.customerId
  )
  const reseller = database.users.find((item) => item.id === sale.resellerId)

  return {
    id: sale.id,
    customerId: sale.customerId,
    customerName: customer?.name.value ?? 'Cliente removida',
    customerPhone: customer?.phone.value ?? '',
    resellerId: sale.resellerId,
    resellerName: fullName(reseller),
    resellerPhone: reseller?.phone.value ?? '',
    products: productsById(sale.productIds).map((product) => ({
      productId: product.id,
      productModelId: product.modelId,
      productModelName: model(product)?.name.value ?? 'Modelo removido',
      salePrice: Number(product.salePrice.value)
    })),
    saleDate: sale.saleDate,
    totalAmount: sale.totalAmount.value,
    paymentMethod: sale.paymentMethod,
    numberInstallments: sale.numberInstallments.value,
    installmentsInterval: sale.installmentsInterval.value,
    installmentsPaid: sale.installmentsPaid.value,
    status: sale.status
  }
}

function shipmentDto(shipment: Shipment) {
  const reseller = database.users.find(
    (user) => user.id === shipment.resellerId
  )
  return {
    id: shipment.id,
    resellerId: shipment.resellerId,
    resellerName: fullName(reseller),
    createdAt: shipment.createdAt,
    status: shipment.status,
    products: productsById(shipment.productIds).map((product) => ({
      id: product.id,
      serialNumber: product.serialNumber.value,
      modelId: product.modelId,
      modelName: model(product)?.name.value ?? 'Modelo removido',
      salePrice: product.salePrice.value,
      status: product.status
    }))
  }
}

function returnDto(item: ReturnRequest) {
  const reseller = database.users.find((user) => user.id === item.resellerId)
  return {
    id: item.id,
    resellerId: item.resellerId,
    resellerName: fullName(reseller),
    createdAt: item.createdAt,
    status: item.status,
    products: productsById(item.productIds).map((product) => ({
      id: product.id,
      productId: product.id,
      serialNumber: product.serialNumber.value,
      modelId: product.modelId,
      productModelId: product.modelId,
      modelName: model(product)?.name.value ?? 'Modelo removido',
      productModelName: model(product)?.name.value ?? 'Modelo removido',
      salePrice: product.salePrice.value,
      status: product.status
    }))
  }
}

function transferDto(item: Transfer) {
  const product = database.products.find((entry) => entry.id === item.productId)
  const from = database.users.find((user) => user.id === item.fromResellerId)
  const to = database.users.find((user) => user.id === item.toResellerId)
  return {
    ...item,
    serialNumber: product?.serialNumber.value ?? 'N/A',
    fromResellerName: fullName(from),
    toResellerName: fullName(to)
  }
}

function inventoryFor(userId: string) {
  const products = database.products.filter(
    (product) => product.ownerId === userId && product.status === 'ASSIGNED'
  )
  return database.productModels
    .map((item) => {
      const modelProducts = products.filter(
        (product) => product.modelId === item.id
      )
      return {
        modelId: item.id,
        modelName: item.name.value,
        quantity: modelProducts.length,
        products: modelProducts.map((product) => ({
          id: product.id,
          serialNumber: product.serialNumber.value,
          modelId: item.id,
          modelName: item.name.value,
          salePrice: product.salePrice.value,
          dateAcquired: batch(product.batchId)?.arrivalDate ?? iso(0)
        }))
      }
    })
    .filter((item) => item.quantity > 0)
}

function availableProducts() {
  const available = database.products.filter(
    (product) => product.status === 'IN_STOCK'
  )
  return {
    data: database.categories
      .map((category) => ({
        categoryId: category.id,
        categoryName: category.name,
        models: database.productModels
          .filter((item) => item.categoryId === category.id)
          .map((item) => ({
            id: item.id,
            modelName: item.name,
            imageUrl: item.photoUrl,
            products: available
              .filter((product) => product.modelId === item.id)
              .map(saleProduct)
          }))
          .filter((item) => item.products.length > 0)
      }))
      .filter((category) => category.models.length > 0)
  }
}

function updateProductOwnership(
  productIds: string[],
  status: Product['status'],
  ownerId?: string
) {
  for (const productId of productIds) {
    const product = database.products.find((item) => item.id === productId)
    if (product) {
      product.status = status
      product.ownerId = ownerId
      product.soldAt =
        status === 'SOLD' ? new Date().toISOString() : product.soldAt
    }
  }
}

function totalSalesValue(sales = database.sales) {
  return sales.reduce((sum, sale) => sum + Number(sale.totalAmount.value), 0)
}

function adminKpi(pathname: string): MockResult | undefined {
  const assignedProducts = database.products.filter(
    (product) => product.status === 'ASSIGNED'
  )
  const inStockProducts = database.products.filter(
    (product) => product.status === 'IN_STOCK'
  )

  if (pathname === '/kpi/admin/products/in-stock/total')
    return result(inStockProducts.length)
  if (
    pathname === '/kpi/admin/products/in-stock' ||
    pathname.includes('/kpi/admin/products/in-stock/for-more-than/')
  ) {
    if (pathname.endsWith('/total')) return result(inStockProducts.length)
    return result(
      inStockProducts.map((product) => ({
        id: product.id,
        serialNumber: product.serialNumber.value,
        modelId: product.modelId,
        modelName: model(product)?.name.value ?? 'Modelo removido',
        status: product.status,
        salePrice: product.salePrice.value,
        dateAcquired: batch(product.batchId)?.arrivalDate ?? iso(0)
      }))
    )
  }
  if (pathname === '/kpi/admin/products/with-resellers/total')
    return result(assignedProducts.length)
  if (pathname === '/kpi/admin/products/with-resellers') {
    return result(
      assignedProducts.map((product) => ({
        id: product.id,
        serialNumber: product.serialNumber.value,
        modelId: product.modelId,
        modelName: model(product)?.name.value ?? 'Modelo removido',
        resellerId: product.ownerId,
        resellerName: fullName(
          database.users.find((user) => user.id === product.ownerId)
        ),
        status: product.status,
        salePrice: product.salePrice.value
      }))
    )
  }
  if (pathname === '/kpi/admin/sales/total') {
    return result({
      totalSales: database.sales.length,
      totalAmount: money(totalSalesValue())
    })
  }
  if (pathname === '/kpi/admin/sales') {
    return result({
      sales: database.sales.map(kpiSaleDto),
      total: database.sales.length
    })
  }
  if (pathname === '/kpi/admin/sales/aggregated-by-day') {
    return result({
      data: database.sales.map((sale) => ({
        date: sale.saleDate.slice(0, 10),
        total: Number(sale.totalAmount.value),
        count: 1
      }))
    })
  }
  if (pathname === '/kpi/admin/sales/resellers/total') {
    return result({
      totalSales: database.sales.length,
      totalAmount: money(totalSalesValue())
    })
  }
  if (pathname === '/kpi/admin/sales/resellers') {
    return result(
      database.users
        .filter((user) => user.role === 'RESELLER')
        .map((user) => {
          const sales = database.sales.filter(
            (sale) => sale.resellerId === user.id
          )
          return {
            resellerId: user.id,
            resellerName: fullName(user),
            totalSales: sales.length,
            totalAmount: money(totalSalesValue(sales))
          }
        })
    )
  }
  if (pathname.includes('/kpi/admin/sales/resellers/')) {
    const parts = pathname.split('/')
    const resellerId = parts.at(-1) === 'total' ? parts.at(-2) : parts.at(-1)
    const sales = database.sales.filter(
      (sale) => sale.resellerId === resellerId
    )
    return pathname.endsWith('/total')
      ? result({
          totalSales: sales.length,
          totalAmount: money(totalSalesValue(sales))
        })
      : result(sales.map(kpiSaleDto))
  }
  if (pathname.includes('/kpi/admin/sales/billing/')) {
    return result({
      totalBilling: money(totalSalesValue()),
      totalAmount: money(totalSalesValue())
    })
  }
  if (pathname.includes('/kpi/admin/ownership-transfers/')) {
    return pathname.endsWith('/total')
      ? result(database.transfers.length)
      : result(database.transfers.map(transferDto))
  }
  if (pathname.includes('/kpi/admin/returns/')) {
    return pathname.endsWith('/total')
      ? result({ totalReturns: database.returns.length })
      : result({
          returns: database.returns.map(returnDto),
          total: database.returns.length
        })
  }

  return undefined
}

function mySpaceKpi(pathname: string, userId: string): MockResult | undefined {
  const sales = database.sales.filter((sale) => sale.resellerId === userId)

  if (pathname === '/kpi/my-space/sales/monthly') {
    return result(
      sales.map((sale) => ({
        year: new Date(sale.saleDate).getFullYear(),
        month: new Date(sale.saleDate).getMonth() + 1,
        total: Number(sale.totalAmount.value),
        count: 1
      }))
    )
  }
  if (pathname === '/kpi/my-space/sales/average-ticket') {
    return result(sales.length ? totalSalesValue(sales) / sales.length : 0)
  }
  if (pathname === '/kpi/my-space/inventory/current')
    return result(inventoryFor(userId))
  if (pathname === '/kpi/my-space/products/top-selling') {
    return result(
      database.productModels.map((item) => ({
        modelId: item.id,
        modelName: item.name.value,
        quantity: sales
          .flatMap((sale) => sale.productIds)
          .filter(
            (productId) =>
              database.products.find((product) => product.id === productId)
                ?.modelId === item.id
          ).length,
        salePrice: item.suggestedPrice.value,
        totalValue: money(Number(item.suggestedPrice.value)).value
      }))
    )
  }
  if (pathname === '/kpi/my-space/products/longest-time-in-inventory') {
    return result(inventoryFor(userId).flatMap((item) => item.products))
  }
  if (pathname === '/kpi/my-space/returns/count') {
    return result(
      database.returns.filter((item) => item.resellerId === userId).length
    )
  }

  return undefined
}

function currentUser() {
  return (
    database.users.find((user) => user.id === currentUserId) ??
    database.users[0]
  )
}

async function route(pathname: string, request: Request): Promise<MockResult> {
  const method = request.method.toUpperCase()
  const body = ['POST', 'PUT', 'PATCH'].includes(method)
    ? await readBody(request)
    : {}
  const user = currentUser()

  if (pathname === '/health') return result({ status: 'ok', mode: 'msw' })
  if (pathname === '/auth/verify') return result({ user })
  if (
    pathname === '/auth/change-password' ||
    pathname === '/auth/reset-password'
  )
    return noContent()
  if (pathname === '/auth/forgot-password') {
    database.passwordResetRequests.unshift({
      id: id('reset'),
      email: vo(String(body.email ?? 'mock@luxis.local')),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    })
    return result({ message: 'Solicitação mock criada' })
  }
  if (pathname === '/auth/password-reset-requests')
    return result(database.passwordResetRequests)
  if (pathname.includes('/auth/password-reset-requests/')) {
    const resetId = pathname.split('/').at(-2)
    const item = database.passwordResetRequests.find(
      (entry) => entry.id === resetId
    )
    if (!item) return notFound()
    item.status = pathname.endsWith('/approve') ? 'APPROVED' : 'REJECTED'
    return result(item)
  }

  if (pathname === '/suppliers') {
    if (method === 'GET') return result(database.suppliers)
    const supplier: Supplier = {
      id: id('sup'),
      name: vo(body.name),
      phone: vo(body.phone)
    }
    database.suppliers.push(supplier)
    return result(supplier, 201)
  }
  if (pathname.startsWith('/suppliers/')) {
    const supplier = database.suppliers.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!supplier) return notFound()
    if (method === 'DELETE') {
      database.suppliers = database.suppliers.filter(
        (item) => item.id !== supplier.id
      )
      return noContent()
    }
    supplier.name = vo(body.name ?? supplier.name.value)
    supplier.phone = vo(body.phone ?? supplier.phone.value)
    return result(supplier)
  }

  if (pathname === '/categories') {
    if (method === 'GET') return result(database.categories)
    const category: Category = {
      id: id('cat'),
      name: vo(body.name),
      description: body.description ? vo(body.description) : undefined,
      status: 'ACTIVE'
    }
    database.categories.push(category)
    return result(category, 201)
  }
  if (pathname.startsWith('/categories/')) {
    const category = database.categories.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!category) return notFound()
    category.status = body.status ?? category.status
    category.name = vo(body.name ?? category.name.value)
    category.description = body.description
      ? vo(body.description)
      : category.description
    return result(category)
  }

  if (pathname === '/product-models') {
    if (method === 'GET') return result(database.productModels)
    const item: ProductModel = {
      id: id('model'),
      name: vo(body.name),
      categoryId: body.categoryId,
      suggestedPrice: money(Number(body.suggestedPrice ?? 0)),
      description: body.description ? vo(body.description) : undefined,
      photoUrl: body.photoUrl ? vo(body.photoUrl) : undefined,
      status: body.status ?? 'ACTIVE'
    }
    database.productModels.push(item)
    return result(item, 201)
  }
  if (pathname === '/product-models/cloudinary-signature') {
    return result({
      signature: 'mock-signature',
      timestamp: Date.now(),
      apiKey: 'mock'
    })
  }
  if (pathname.startsWith('/product-models/')) {
    const item = database.productModels.find(
      (entry) => entry.id === pathname.split('/')[2]
    )
    if (!item) return notFound()
    if (method === 'DELETE') {
      database.productModels = database.productModels.filter(
        (entry) => entry.id !== item.id
      )
      return noContent()
    }
    item.name = vo(body.name ?? item.name.value)
    item.categoryId = body.categoryId ?? item.categoryId
    item.suggestedPrice = money(
      Number(body.suggestedPrice ?? item.suggestedPrice.value)
    )
    item.description = body.description
      ? vo(body.description)
      : item.description
    item.photoUrl = body.photoUrl ? vo(body.photoUrl) : item.photoUrl
    item.status = body.status ?? item.status
    return result(item)
  }

  if (pathname === '/batches') {
    if (method === 'GET') return result(database.batches.map(batchDto))
    const newBatch: Batch = {
      id: id('batch'),
      supplierId: body.supplierId,
      arrivalDate: body.arrivalDate
    }
    database.batches.push(newBatch)
    for (const entry of body.entries ?? []) {
      const modelId = entry.modelId ?? id('model')
      if (!database.productModels.some((item) => item.id === modelId)) {
        database.productModels.push({
          id: modelId,
          name: vo(entry.modelName ?? 'Novo modelo'),
          categoryId: entry.categoryId ?? database.categories[0].id,
          suggestedPrice: money(Number(entry.salePrice ?? 0)),
          photoUrl: entry.photoUrl ? vo(entry.photoUrl) : undefined,
          status: 'ACTIVE'
        })
      }
      for (let index = 0; index < Number(entry.quantity ?? 1); index += 1) {
        database.products.push({
          id: id('prod'),
          serialNumber: vo(entry.serialNumber ?? `MOCK-${Date.now()}-${index}`),
          modelId,
          batchId: newBatch.id,
          unitCost: money(Number(entry.unitCost ?? 0)),
          salePrice: money(Number(entry.salePrice ?? 0)),
          status: 'IN_STOCK'
        })
      }
    }
    return result(batchDto(newBatch), 201)
  }
  if (pathname.startsWith('/batches/')) {
    const batchId = pathname.split('/')[2]
    database.batches = database.batches.filter((item) => item.id !== batchId)
    database.products = database.products.filter(
      (product) => product.batchId !== batchId
    )
    return noContent()
  }

  if (pathname === '/products') return result(database.products)
  if (pathname === '/products/available/in-stock') {
    return result(
      database.products.filter((product) => product.status === 'IN_STOCK')
    )
  }
  if (pathname.startsWith('/products/')) {
    const product = database.products.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!product) return notFound()
    product.salePrice = body.salePrice
      ? money(Number(body.salePrice))
      : product.salePrice
    product.status = pathname.endsWith('/sell')
      ? 'SOLD'
      : (body.status ?? product.status)
    return result(product)
  }

  if (pathname === '/customers') {
    if (method === 'GET') return result(database.customers)
    const customer: Customer = {
      id: id('cust'),
      name: vo(body.name),
      phone: vo(body.phone)
    }
    database.customers.push(customer)
    return result(customer, 201)
  }
  if (pathname.startsWith('/customers/')) {
    const customer = database.customers.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!customer) return notFound()
    if (method === 'DELETE') {
      database.customers = database.customers.filter(
        (item) => item.id !== customer.id
      )
      return noContent()
    }
    customer.name = vo(body.name ?? customer.name.value)
    customer.phone = vo(body.phone ?? customer.phone.value)
    return result(customer)
  }

  if (pathname === '/sales/available-products')
    return result(availableProducts())
  if (pathname === '/sales') {
    if (method === 'GET') return result(database.sales.map(saleDto))
    const selectedProducts = productsById(body.productIds ?? [])
    const sale: Sale = {
      id: id('sale'),
      customerId: body.customerId,
      resellerId: user.id,
      productIds: body.productIds ?? [],
      saleDate: body.saleDate ?? new Date().toISOString(),
      totalAmount: money(
        selectedProducts.reduce(
          (sum, product) => sum + Number(product.salePrice.value),
          0
        )
      ),
      paymentMethod: body.paymentMethod ?? 'PIX',
      numberInstallments: vo(Number(body.numberInstallments ?? 1)),
      installmentsInterval: vo(Number(body.installmentsInterval ?? 0)),
      installmentsPaid: vo(0),
      status: 'PENDING'
    }
    updateProductOwnership(sale.productIds, 'SOLD', user.id)
    database.sales.unshift(sale)
    return result(saleDto(sale), 201)
  }
  if (pathname.startsWith('/sales/')) {
    const sale = database.sales.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!sale) return notFound()
    if (method === 'GET') return result(saleDto(sale))
    if (method === 'DELETE') {
      updateProductOwnership(sale.productIds, 'IN_STOCK')
      database.sales = database.sales.filter((item) => item.id !== sale.id)
      return noContent()
    }
    if (pathname.endsWith('/confirm')) sale.status = 'CONFIRMED'
    else if (pathname.endsWith('/installments/mark-paid'))
      sale.installmentsPaid = vo(
        Number(body.installmentsPaid ?? sale.installmentsPaid.value + 1)
      )
    else if (pathname.endsWith('/status'))
      sale.status = body.status ?? sale.status
    else {
      sale.paymentMethod = body.paymentMethod ?? sale.paymentMethod
      sale.saleDate = body.saleDate ?? sale.saleDate
      sale.numberInstallments = vo(
        Number(body.numberInstallments ?? sale.numberInstallments.value)
      )
      sale.installmentsInterval = vo(
        Number(body.installmentsInterval ?? sale.installmentsInterval.value)
      )
    }
    return result(saleDto(sale))
  }

  if (pathname === '/shipments') {
    if (method === 'GET') return result(database.shipments.map(shipmentDto))
    const shipment: Shipment = {
      id: id('ship'),
      resellerId: body.resellerId,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      productIds: body.items ?? body.productIds ?? []
    }
    updateProductOwnership(shipment.productIds, 'ASSIGNED', shipment.resellerId)
    database.shipments.unshift(shipment)
    return result(shipmentDto(shipment), 201)
  }
  if (pathname.startsWith('/shipments/')) {
    const shipment = database.shipments.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!shipment) return notFound()
    if (method === 'DELETE') {
      updateProductOwnership(shipment.productIds, 'IN_STOCK')
      database.shipments = database.shipments.filter(
        (item) => item.id !== shipment.id
      )
      return noContent()
    }
    shipment.status = body.status ?? shipment.status
    return result(shipmentDto(shipment))
  }

  if (pathname === '/returns') {
    if (method === 'GET') return result(database.returns.map(returnDto))
    const item: ReturnRequest = {
      id: id('ret'),
      resellerId: body.resellerId ?? user.id,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      productIds: body.productIds ?? []
    }
    database.returns.unshift(item)
    return result(returnDto(item), 201)
  }
  if (pathname.startsWith('/returns/reseller/')) {
    const resellerId = pathname.split('/').at(-1)
    return result(
      database.returns
        .filter((item) => item.resellerId === resellerId)
        .map(returnDto)
    )
  }
  if (pathname.startsWith('/returns/')) {
    const item = database.returns.find(
      (entry) => entry.id === pathname.split('/')[2]
    )
    if (!item) return notFound()
    if (method === 'DELETE') {
      database.returns = database.returns.filter(
        (entry) => entry.id !== item.id
      )
      return noContent()
    }
    item.status = pathname.endsWith('/status')
      ? (body.status ?? item.status)
      : item.status
    item.productIds = pathname.endsWith('/status')
      ? item.productIds
      : (body.items ?? body.productIds ?? item.productIds)
    return result(returnDto(item))
  }

  if (pathname === '/ownership-transfers') {
    if (method === 'GET') return result(database.transfers.map(transferDto))
    const transfer: Transfer = {
      id: id('trans'),
      productId: body.productId,
      fromResellerId: body.fromResellerId ?? user.id,
      toResellerId: body.toResellerId,
      transferDate: new Date().toISOString(),
      status: 'PENDING'
    }
    database.transfers.unshift(transfer)
    return result(transferDto(transfer), 201)
  }
  if (pathname.startsWith('/ownership-transfers/')) {
    const transfer = database.transfers.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!transfer) return notFound()
    if (method === 'DELETE') {
      database.transfers = database.transfers.filter(
        (item) => item.id !== transfer.id
      )
      return noContent()
    }
    transfer.status = body.status ?? transfer.status
    return result(transferDto(transfer))
  }

  if (pathname === '/inventory/current') return result(inventoryFor(user.id))
  if (pathname.startsWith('/inventory/'))
    return result(inventoryFor(pathname.split('/')[2]))

  if (pathname === '/users') {
    if (method === 'GET') return result(database.users)
    const newUser: User = {
      ...database.users[0],
      id: id('user'),
      name: vo(body.name ?? 'Nova'),
      surname: vo(body.surname ?? 'Revendedora'),
      email: vo(body.email ?? `user-${Date.now()}@luxis.local`),
      phone: vo(body.phone ?? '+5511000000000'),
      role: body.role ?? 'RESELLER',
      status: body.status ?? 'ACTIVE'
    }
    database.users.push(newUser)
    return result(newUser, 201)
  }
  if (pathname === '/users/signup') {
    const newUser: User = {
      ...database.users[0],
      id: id('user'),
      name: vo(body.name ?? 'Cadastro'),
      surname: vo(body.surname ?? 'Pendente'),
      email: vo(body.email ?? `signup-${Date.now()}@luxis.local`),
      phone: vo(body.phone ?? '+5511000000000'),
      role: 'UNASSIGNED',
      status: 'PENDING'
    }
    database.users.push(newUser)
    return result(newUser, 201)
  }
  if (pathname === '/users/pending')
    return result(database.users.filter((user) => user.status === 'PENDING'))
  if (pathname.startsWith('/users/')) {
    const targetUser = database.users.find(
      (item) => item.id === pathname.split('/')[2]
    )
    if (!targetUser) return notFound()
    if (pathname.endsWith('/products'))
      return result(
        inventoryFor(targetUser.id).flatMap((item) => item.products)
      )
    if (method === 'DELETE' || pathname.endsWith('/disable'))
      targetUser.status = 'DISABLED'
    else if (pathname.endsWith('/role'))
      targetUser.role = body.role ?? targetUser.role
    else if (pathname.endsWith('/status'))
      targetUser.status = body.status ?? targetUser.status
    else {
      targetUser.name = vo(body.name ?? targetUser.name.value)
      targetUser.surname = vo(body.surname ?? targetUser.surname.value)
      targetUser.phone = vo(body.phone ?? targetUser.phone.value)
    }
    return result(targetUser)
  }

  const adminResponse = adminKpi(pathname)
  if (adminResponse) return adminResponse

  const mySpaceResponse = mySpaceKpi(pathname, user.id)
  if (mySpaceResponse) return mySpaceResponse

  return notFound(`Endpoint mock não implementado: ${method} ${pathname}`)
}

function toHttpResponse(response: MockResult) {
  if (response.status === 204) {
    return new HttpResponse(null, { status: 204 })
  }

  return HttpResponse.json(response.body, { status: response.status ?? 200 })
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await readBody(request)
    const email = String(body.email ?? 'admin@luxis.local')
    currentUserId =
      database.users.find((user) => user.email.value === email)?.id ??
      'user-admin'
    return new HttpResponse(null, { status: 204 })
  }),
  http.post('/api/auth/logout', () => {
    currentUserId = 'user-admin'
    return new HttpResponse(null, { status: 204 })
  }),
  http.post('/api/auth/forgot-password', async ({ request }) =>
    toHttpResponse(await route('/auth/forgot-password', request))
  ),
  http.post('/api/auth/reset-password', async ({ request }) =>
    toHttpResponse(await route('/auth/reset-password', request))
  ),
  http.all('/api/backend/*', async ({ request }) => {
    const url = new URL(request.url)
    const pathname = url.pathname.replace(/^\/api\/backend/, '') || '/'
    return toHttpResponse(await route(pathname, request))
  })
]
