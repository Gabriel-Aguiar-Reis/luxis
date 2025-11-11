# Bounded Contexts - Value Objects de Nome

## 📋 Visão Geral

O sistema Luxis utiliza **diferentes Value Objects** para representar "nome" dependendo do **contexto de negócio** (Bounded Context). Isso segue os princípios de **Domain-Driven Design (DDD)**.

## 🎯 Bounded Contexts Identificados

### 1. **User Context** (`modules/user`)

**Value Object**: `Name`  
**Arquivo**: `modules/user/domain/value-objects/name.vo.ts`

**Propósito**: Representa nomes de **pessoas físicas** (usuários do sistema)

**Regras de Negócio**:

- ✅ Aceita nomes com primeira letra maiúscula
- ✅ Aceita acentos e caracteres especiais (á, é, í, ó, ú, ç, ñ, etc.)
- ✅ Aceita hífens (`Ana-Paula`)
- ✅ Aceita apóstrofos (`D'Angelo`)
- ✅ Aceita preposições em minúsculas (`de`, `da`, `do`, `dos`, `das`, `e`)
- ❌ Rejeita nomes totalmente em minúsculas
- ❌ Rejeita nomes totalmente em maiúsculas

**Exemplos Válidos**:

```typescript
new Name('João Silva') // ✅
new Name('Maria de Souza') // ✅
new Name('Ana-Paula Costa') // ✅
new Name("José D'Angelo") // ✅
new Name('Tatiane Fagundes') // ✅
```

**Usado em**:

- `Customer` (Clientes)
- `User` (Usuários do sistema)

---

### 2. **Supplier Context** (`modules/supplier`)

**Value Object**: `SupplierName`  
**Arquivo**: `modules/supplier/domain/value-objects/supplier-name.vo.ts`

**Propósito**: Representa nomes de **empresas/fornecedores**

**Regras de Negócio**:

- ✅ Aceita qualquer string entre 2 e 100 caracteres
- ✅ **Sem validação de formato** (empresas podem ter nomes variados)
- ✅ Aceita números (`3M`, `7-Eleven`)
- ✅ Aceita caracteres especiais (`Apple Inc.`, `AT&T`)
- ✅ Aceita nomes totalmente em maiúsculas (`IBM`, `HP`)

**Exemplos Válidos**:

```typescript
new SupplierName('Apple Inc.') // ✅
new SupplierName('3M') // ✅
new SupplierName('AT&T') // ✅
new SupplierName('IBM') // ✅
new SupplierName('Lojas Americanas S.A.') // ✅
```

**Usado em**:

- `Supplier` (Fornecedores)

---

### 3. **Product Model Context** (`modules/product-model`)

**Value Object**: `ModelName`  
**Arquivo**: `modules/product-model/domain/value-objects/model-name.vo.ts`

**Propósito**: Representa nomes de **modelos de produtos**

**Regras de Negócio**:

- ✅ Aceita letras Unicode (`\p{L}`)
- ✅ Aceita números
- ✅ Aceita hífens entre palavras (`iPhone-13-Pro`)
- ✅ Aceita preposições (`de`, `e`, `com`, `sem`)
- ✅ Flexível para nomes técnicos de produtos

**Exemplos Válidos**:

```typescript
new ModelName('iPhone 13 Pro Max') // ✅
new ModelName('Galaxy-S21-Ultra') // ✅
new ModelName('MacBook Pro 16') // ✅
new ModelName('AirPods Pro 2') // ✅
```

**Usado em**:

- `ProductModel` (Modelos de produtos)

---

### 4. **Category Context** (`modules/category`)

**Value Object**: `CategoryName`  
**Arquivo**: `modules/category/domain/value-objects/category-name.vo.ts`

**Propósito**: Representa nomes de **categorias de produtos**

**Regras de Negócio**:

- ✅ Primeira letra de cada palavra em maiúscula (Title Case)
- ✅ Resto em minúsculas
- ✅ Aceita múltiplas palavras separadas por espaço
- ❌ Rejeita nomes totalmente em minúsculas ou maiúsculas

**Exemplos Válidos**:

```typescript
new CategoryName('Smartphones') // ✅
new CategoryName('Tablets E Acessórios') // ✅
new CategoryName('Computadores') // ✅
```

**Exemplos Inválidos**:

```typescript
new CategoryName('smartphones') // ❌ minúsculas
new CategoryName('SMARTPHONES') // ❌ maiúsculas
new CategoryName('smartPhones') // ❌ camelCase
```

**Usado em**:

- `Category` (Categorias)

---

## 🏛️ Arquitetura - Por que Value Objects diferentes?

### Princípios DDD Aplicados:

1. **Ubiquitous Language** (Linguagem Ubíqua)
   - Cada contexto tem sua própria linguagem de negócio
   - "Nome de pessoa" ≠ "Nome de empresa" ≠ "Nome de categoria"

2. **Bounded Contexts** (Contextos Delimitados)
   - Cada módulo é um contexto isolado
   - As regras de validação refletem as necessidades específicas do negócio

3. **Domain Integrity** (Integridade do Domínio)
   - Validações específicas garantem dados consistentes
   - Previne dados inválidos no nível de domínio

### Benefícios:

✅ **Clareza**: Cada Value Object tem responsabilidade única  
✅ **Manutenibilidade**: Mudanças em um contexto não afetam outros  
✅ **Testabilidade**: Testes específicos para cada regra de negócio  
✅ **Tipo-Segurança**: TypeScript garante uso correto em tempo de compilação

---

## 📊 Quadro Comparativo

| Contexto          | Value Object   | Validação                | Aceita Números | Case-Sensitive | Comprimento |
| ----------------- | -------------- | ------------------------ | -------------- | -------------- | ----------- |
| **User**          | `Name`         | Regex restrita (pessoas) | ❌             | ✅ (Título)    | Flexível    |
| **Supplier**      | `SupplierName` | Apenas tamanho           | ✅             | ❌             | 2-100 chars |
| **Product Model** | `ModelName`    | Unicode + hífen          | ✅             | ❌             | Flexível    |
| **Category**      | `CategoryName` | Title Case               | ❌             | ✅ (Title)     | Flexível    |

---

## 🔄 Quando Usar Cada Um?

### Use `Name` (User Context):

- Nomes de **clientes** (Customer)
- Nomes de **usuários** do sistema (User)
- Qualquer **pessoa física**

### Use `SupplierName`:

- Nomes de **empresas fornecedoras**
- Razões sociais
- Nomes comerciais

### Use `ModelName`:

- Modelos de **produtos**
- Nomenclaturas técnicas
- SKUs com descrição

### Use `CategoryName`:

- **Categorias** de produtos
- Classificações padronizadas
- Agrupamentos de produtos

---

## 🛠️ Exemplo de Uso

```typescript
// ✅ CORRETO - Contextos separados
const customer = new Customer(
  id,
  new Name('João Silva'), // Nome de pessoa
  new PhoneNumber('11987654321')
)

const supplier = new Supplier(
  id,
  new SupplierName('Apple Inc.'), // Nome de empresa
  new PhoneNumber('11987654321')
)

const category = new Category(
  id,
  new CategoryName('Smartphones') // Nome de categoria
)

const model = new ProductModel(
  id,
  new ModelName('iPhone 13 Pro'), // Nome de modelo
  categoryId
)
```

---

## ⚠️ Anti-Padrões (Evite)

```typescript
// ❌ ERRADO - Não compartilhe Value Objects entre contextos
const supplier = new Supplier(
  id,
  new Name('Apple Inc.'), // ❌ Name é para pessoas, não empresas!
  phone
)

// ❌ ERRADO - Não use string diretamente
const customer = new Customer(
  id,
  'João Silva', // ❌ Deveria ser new Name('João Silva')
  phone
)
```

---

## 🎯 Recomendações

### Para Fornecedores (Supplier):

O `SupplierName` é **propositalmente flexível** porque:

- Empresas têm nomes muito variados (razão social, nome fantasia)
- Podem conter números (`3M`, `7-Eleven`)
- Podem ter caracteres especiais (`AT&T`, `C&A`)
- Podem estar em maiúsculas (`IBM`, `HP`)

**Mantenha apenas a validação de tamanho (2-100 caracteres)** para evitar:

- ✅ Nomes vazios
- ✅ Nomes muito grandes
- ✅ Flexibilidade máxima para casos reais

### Para Pessoas (Name):

O `Name` tem validação mais restrita porque:

- Nomes de pessoas seguem padrões mais consistentes
- Primeira letra maiúscula é convenção brasileira
- Validação ajuda a manter consistência nos dados

---

## 📚 Referências

- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design - Vaughn Vernon](https://vaughnvernon.com/?page_id=168)
- [Bounded Context - Martin Fowler](https://martinfowler.com/bliki/BoundedContext.html)
