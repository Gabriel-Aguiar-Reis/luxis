# Luxis - Inventory Management System (BACKEND)

[![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)](https://swagger.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

Inventory management system built with NestJS, following Clean Architecture and Domain-Driven Design (DDD) principles.

## ✨ Features

- 🔐 Authentication and authorization with JWT and CASL
- 👥 User and role management
- 📦 Product and category management
- 📊 Inventory and batch control
- 💰 Sales and shipping management
- 📧 Email notification system
- 📱 Image upload with Cloudinary
- 📝 API documentation with Swagger
- 🔒 Rate limiting and security
- 📈 Logging and monitoring

## 🚀 Technologies

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [CASL](https://casl.js.org/)
- [Cloudinary](https://cloudinary.com/)
- [MailerSend](https://www.mailersend.com/)
- [Swagger](https://swagger.io/)
- [Jest](https://jestjs.io/)

## 📋 Prerequisites

- Node.js (LTS version recommended)
- PostgreSQL
- Yarn ou NPM
- Cloudinary account (for image uploads)
- MailerSend account (for sending emails)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/gabriel-aguiar-reis/luxis.git
cd luxis
```

### 2. Install dependencies

```bash
cd backend
yarn install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration values.

### 4. Run migrations

```bash
yarn migration:run
```

### 5. Create a superuser

```bash
yarn seed:superuser
```

## 🚀 Running the Project

### Development

```bash
yarn start:dev
```

### Production

```bash
yarn build
yarn start:prod
```

## 🧪 Testing

### Unit Tests

```bash
yarn test:unit
```

### Integration Tests

```bash
yarn test:integration
```

### End-to-End (E2E) Tests

```bash
yarn test:e2e
```

### Test Coverage

```bash
yarn test:cov
```

## 📦 Available Scripts

- `yarn build`: Compile the project
- `yarn start:dev`: Start the server in development mode
- `yarn start:debug`: Start the server in debug mode
- `yarn start:prod`: Start the server in production mode
- `yarn test`: Run all tests
- `yarn migration:generate`: Generate a new migration
- `yarn migration:run`: Run pending migrations
- `yarn migration:revert`: Revert the last migration
- `yarn seed:superuser`: Create a superuser

## 📚 API Documentation

API documentation is available through Swagger UI when the server is running:

```html
http://localhost:3000/api
```

## 🏗️ Architecture

This project follows Clean Architecture and DDD principles, with the following structure:

```bash
├── backend/                  # Application backend
│   ├── src/
│   │   ├── modules/          # Application modules
│   │   │   ├── auth/         # Authentication and authorization
│   │   │   ├── user/         # User management
│   │   │   │   ├── application/ # Business logic
│   │   │   │   │   └── use-cases/ # Use cases
│   │   │   │   ├── domain/   # Domain layer
│   │   │   │   │   ├── entities/ # Entities
│   │   │   │   │   ├── enums/ # Enums
│   │   │   │   │   ├── values-objects/ # Value objects
│   │   │   │   │   └── repositories/ # Repositories
│   │   │   │   └── presentation/ # Presentation layer
│   │   │   │   │   ├── dtos/ # Data Transfer Objects
│   │   │   │   │   └── user.controller.ts/ # User controller
│   │   │   │   └── user.module.ts # User module
│   │   │   ├── product/      # Product management
│   │   │   ├── category/     # Product categories
│   │   │   ├── batch/        # Product batches
│   │   │   ├── sale/         # Sales
│   │   │   ├── shipment/     # Shipments
│   │   │   └── ...
│   │   ├── shared/           # Shared code
│   │   │   ├── config/       # Configuration
│   │   │   ├── infra/        # Infrastructure
│   │   │   │   ├── auth/     # Authentication implementations
│   │   │   │   ├── database/ # Database configuration
│   │   │   │   └── logging/  # Logging configuration
│   │   │   └── ...
│   │   └── main.ts           # Application entry point
│   ├── test/                 # Tests
│   │   ├── unit/             # Unit tests
│   │   ├── integration/      # Integration tests
│   │   └── e2e/              # End-to-end tests
│   └── ...
└── ...
```

## 🔒 Security

- JWT authentication
- CASL-based authorization
- Rate Limiting
- Input validation with class-validator
- Data sanitization
- Security logging

## 📧 Contact

Gabriel Aguiar - [@gabriel-aguiar-reis](https://github.com/gabriel-aguiar-reis)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-aguiar-reis/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lugafeagre@gmail.com)

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Contribution

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
