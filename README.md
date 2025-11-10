<div align="center">

# 🌟 Luxis

### Smart Inventory Management System for Resellers

[![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

**A complete and modern platform to transform inventory management into a competitive advantage.**

[📖 Documentation](#-documentation) • [✨ Features](#-key-features) • [🚀 Getting Started](#-getting-started) • [🏗️ Architecture](#️-architecture)

---

</div>

> **Language**: [English](#) | [Português (BR)](README.PT_BR.md)

## 🎯 About Luxis

Luxis is a **complete business solution** designed specifically for resellers and distributors who need total control over their inventory, sales, and operations. Built with the most modern technologies on the market, Luxis combines **performance**, **security**, and **scalability** in an intuitive and powerful platform.

### 💡 Why Luxis?

- **🎨 Modern Interface**: Exceptional user experience with responsive and intuitive design
- **🔐 Enterprise-Level Security**: JWT authentication, role-based access control (RBAC), and attack protection
- **📊 Real-Time Analytics**: KPIs and metrics that transform data into strategic decisions
- **🌐 Multi-language**: Full support for Portuguese and English
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and smartphone
- **⚡ Exceptional Performance**: Architecture optimized for thousands of simultaneous operations
- **🔄 Total Traceability**: Complete control of product lifecycle, from inventory to sale

---

## ✨ Key Features

### 👥 User and Permission Management

- Multiple access profiles (Administrator, Reseller, Assistant)
- New user approval system
- Granular permission control with CASL
- Complete action history

### 📦 Smart Inventory Control

- Product management by model, category, and batch
- Location and status tracking for each item
- Ownership transfer system between resellers
- Real-time inventory with automatic alerts
- Minimum and maximum stock control

### 💰 Complete Sales Management

- Cash and installment sales processing
- Automatic price and margin calculation
- Receipt and invoice issuance
- Installment and payment control
- Detailed transaction history

### 📊 Analytics and Reports

- **Executive Dashboard**: 360° view of your business
- **Real-Time KPIs**:
  - Products in stock
  - Average time in inventory
  - Average sales ticket
  - Performance by reseller
  - Return and refund rate
- **Custom Reports**: PDF and CSV exports

### 📮 Shipping and Logistics System

- Shipment and delivery control
- Shipping status tracking
- Integration with logistics systems
- Automatic notifications

### 🔄 Returns Management

- Simplified returns processing
- Automatic stock reintegration
- Return reason analysis
- Financial impact calculated automatically

### 🏢 Customer and Supplier Management

- Complete customer registration
- Purchase history and preferences
- Supplier management
- Customer portfolio by reseller

### 🖼️ Image Management

- Optimized upload via Cloudinary
- Automatic image compression
- Multiple images per product
- Responsive visualization

### 📧 Smart Notifications

- Transactional email system via MailerSend
- Password recovery
- Sales and transfer notifications
- Customizable alerts

---

## 🏗️ Architecture

Luxis is built on a modern, scalable, and maintainable architecture:

### Backend - Clean Architecture + DDD

```
backend/
├── src/
│   ├── modules/              # Domain modules
│   │   ├── auth/            # Authentication and authorization
│   │   ├── user/            # User management
│   │   ├── product/         # Products
│   │   ├── category/        # Categories
│   │   ├── batch/           # Batches
│   │   ├── inventory/       # Inventory
│   │   ├── sale/            # Sales
│   │   ├── shipment/        # Shipments
│   │   ├── return/          # Returns
│   │   ├── customer/        # Customers
│   │   ├── supplier/        # Suppliers
│   │   ├── ownership-transfer/  # Transfers
│   │   └── kpi/             # Performance indicators
│   │       ├── admin/       # Administrative KPIs
│   │       └── reseller/    # Reseller KPIs
│   └── shared/              # Shared code
│       ├── config/          # Configurations
│       ├── infra/           # Infrastructure
│       │   ├── auth/        # JWT, CASL, Guards
│       │   ├── database/    # TypeORM, Migrations
│       │   └── logging/     # Logging system
│       └── events/          # Event-driven architecture
└── test/                    # Complete tests
    ├── unit/               # Unit tests
    ├── integration/        # Integration tests
    └── e2e/                # End-to-end tests
```

**Architectural Patterns:**

- ✅ Clean Architecture (well-defined layers)
- ✅ Domain-Driven Design (DDD)
- ✅ SOLID Principles
- ✅ Repository Pattern
- ✅ Strategy Pattern
- ✅ Factory Pattern
- ✅ Event-Driven Architecture

### Frontend - Next.js 15 + React 19

```
frontend/
├── src/
│   ├── app/                 # App Router (Next.js 15)
│   │   ├── [locale]/       # Internationalized routes
│   │   ├── login/          # Authentication
│   │   ├── admin-login/    # Administrative login
│   │   ├── sign-up/        # Registration
│   │   └── my-space/       # User area
│   ├── components/         # React components
│   │   ├── ui/            # Base components (shadcn/ui)
│   │   ├── dashboard/     # Dashboard
│   │   ├── products/      # Products
│   │   ├── sales/         # Sales
│   │   └── ...
│   ├── hooks/             # Custom hooks
│   ├── stores/            # Global state (Zustand)
│   ├── lib/               # Utilities
│   │   ├── api-client.ts  # HTTP client
│   │   ├── api-types.ts   # TypeScript types
│   │   └── i18n/          # Internationalization
│   └── messages/          # Translations (pt, en)
└── middleware.ts          # Route protection
```

**Frontend Stack:**

- ✅ Next.js 15 with App Router and Turbopack
- ✅ React 19 with Server Components
- ✅ Strict TypeScript
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui for components
- ✅ Zustand for global state
- ✅ React Hook Form + Zod for forms
- ✅ TanStack Query for data caching
- ✅ next-intl for i18n

---

## 🚀 Technology Stack

### Backend

- **Framework**: NestJS 11
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT + Passport
- **Autorização**: CASL (Role-Based Access Control)
- **Documentação**: Swagger/OpenAPI
- **Upload de Arquivos**: Cloudinary
- **Email**: MailerSend
- **Testes**: Jest (Unit, Integration, E2E)
- **Logs**: Pino
- **Cache**: Cache Manager
- **Segurança**: Throttler (Rate Limiting)

### Frontend

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui + Radix UI
- **Estado**: Zustand
- **Formulários**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Internacionalização**: next-intl
- **Temas**: next-themes (Dark/Light mode)
- **Ícones**: Lucide React
- **PDF**: React PDF Renderer

### DevOps & Tools

- **Controle de Versão**: Git
- **Monorepo**: Yarn Workspaces
- **CI/CD**: GitHub Actions
- **Containerização**: Docker (pronto para deploy)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** 14+
- **Yarn** 4+
- Accounts on:
  - [Cloudinary](https://cloudinary.com/) (image upload)
  - [MailerSend](https://www.mailersend.com/) (email sending)

### Quick Installation

```bash
# 1. Clone the repository
git clone https://github.com/gabriel-aguiar-reis/luxis.git
cd luxis

# 2. Install dependencies
yarn install

# 3. Configure Backend
cd backend
cp .env.example .env
# Edit .env with your credentials

# 4. Run migrations
yarn migration:run

# 5. Create superuser
yarn seed:superuser

# 6. Configure Frontend
cd ../frontend
cp .env.example .env
# Edit .env with backend URL

# 7. Go back to root and start everything
cd ..
yarn start
```

Done! 🎉

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3001
- **API Docs**: http://localhost:3000/api/docs

---

## 📖 Documentation

### Backend

After starting the backend server, access the interactive API documentation:

🔗 **Swagger UI**: http://localhost:3000/api/docs

Documentation includes:

- All available endpoints
- Request/response schemas
- Authentication and authorization
- Usage examples
- Interactive tests

### Available Scripts

#### Backend

```bash
yarn start:dev          # Start in development mode
yarn start:prod         # Start in production mode
yarn build              # Compile project
yarn test:unit          # Unit tests
yarn test:integration   # Integration tests
yarn test:e2e           # End-to-end tests
yarn test:cov           # Test coverage
yarn migration:generate # Generate new migration
yarn migration:run      # Run migrations
yarn seed:superuser     # Create superuser
```

#### Frontend

```bash
yarn dev                # Start in development (Turbopack)
yarn build              # Production build
yarn start              # Start production version
yarn lint               # Check code
yarn generate:types     # Generate OpenAPI types
```

#### Monorepo

```bash
yarn start              # Start backend + frontend simultaneously
```

---

## 🔒 Security

Luxis implements security best practices:

- ✅ **JWT Authentication** with refresh tokens
- ✅ **RBAC (Role-Based Access Control)** with CASL
- ✅ **Rate Limiting** to prevent attacks
- ✅ **Data validation** at all layers
- ✅ **Input sanitization**
- ✅ **HTTPS** required in production
- ✅ **SQL Injection protection**
- ✅ **XSS protection**
- ✅ **CORS** properly configured
- ✅ **Helmet** for security headers
- ✅ **Complete audit logs**

---

## 🧪 Testing

Luxis has comprehensive test coverage:

```bash
# Backend
yarn test:unit          # Fast unit tests
yarn test:integration   # Integration tests with database
yarn test:e2e           # Complete end-to-end tests
yarn test:cov           # Coverage report
```

**Test Types:**

- **Unit**: Test isolated components (use cases, services)
- **Integration**: Test integration with database
- **E2E**: Test complete application flows

---

## 🌍 Internationalization

Luxis is multilingual from its conception:

- 🇧🇷 **Português (pt)**
- 🇺🇸 **English (en)**

Adding new languages is simple:

1. Create message file in `frontend/src/messages/{locale}.json`
2. Configure locale in `frontend/src/lib/i18n/routing.ts`
3. Done! ✨

---

## 🎨 Themes

Full support for **Dark Mode** and **Light Mode**:

- Instant switching
- Preference saved locally
- Respects system preference
- Components optimized for both themes

---

## 📊 Monitoring

### Logs

Structured logging system with **Pino**:

- Logs by level (debug, info, warn, error)
- JSON format for parsing
- Pretty print in development
- Request tracking
- Audit logs

### Performance

- Smart caching of frequent queries
- Component lazy loading
- Image optimization
- Automatic code splitting
- Server-side rendering when appropriate

---

## 🤝 Contributing

Contributions are very welcome! To contribute:

1. **Fork** the project
2. Create a **branch** for your feature (`git checkout -b feature/MyFeature`)
3. **Commit** your changes (`git commit -m 'feat: Add MyFeature'`)
4. **Push** to the branch (`git push origin feature/MyFeature`)
5. Open a **Pull Request**

### Code Standards

- Follow SOLID principles
- Use TypeScript strict mode
- Write tests for new features
- Follow commit patterns (Conventional Commits)
- Document complex functions and components

---

## 📝 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0**.

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Gabriel Aguiar**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-aguiar-reis/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gabriel-aguiar-reis)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lugafeagre@gmail.com)

---

## 🙏 Acknowledgments

Luxis was built using incredible open-source technologies. Special thanks to the communities of:

- [NestJS](https://nestjs.com/)
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- And all other libraries that make this project possible

---

<div align="center">

**Built with ❤️ by Gabriel Aguiar**

⭐ If this project was useful to you, consider giving it a star!

</div>
