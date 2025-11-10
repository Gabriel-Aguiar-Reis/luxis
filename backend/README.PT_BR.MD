# Luxis - Sistema de Gestão de Estoque (BACKEND)

[![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)](https://swagger.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **Idioma**: [English](README.md) | [Português (BR)](#)

Sistema de gestão de estoque desenvolvido com NestJS, seguindo os princípios da Clean Architecture e Domain-Driven Design (DDD).

## ✨ Funcionalidades

- 🔐 Autenticação e autorização com JWT e CASL
- 👥 Gestão de usuários e permissões
- 📦 Gestão de produtos e categorias
- 📊 Controle de estoque e lotes
- 💰 Gestão de vendas e envios
- 📧 Sistema de notificações por email
- 📱 Upload de imagens com Cloudinary
- 📝 Documentação da API com Swagger
- 🔒 Rate limiting e segurança
- 📈 Logs e monitoramento

## 🚀 Tecnologias

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

## 📋 Pré-requisitos

- Node.js (versão LTS recomendada)
- PostgreSQL
- Yarn ou NPM
- Conta no Cloudinary (para upload de imagens)
- Conta no MailerSend (para envio de emails)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/gabriel-aguiar-reis/luxis.git
cd luxis
```

### 2. Instale as dependências

```bash
cd backend
yarn install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 4. Execute as migrações

```bash
yarn migration:run
```

### 5. Crie o superusuário

```bash
yarn seed:superuser
```

## 🚀 Executando o projeto

### Desenvolvimento

```bash
yarn start:dev
```

### Produção

```bash
yarn build
yarn start:prod
```

## 🧪 Testes

### Testes Unitários

```bash
yarn test:unit
```

### Testes de Integração

```bash
yarn test:integration
```

### Testes E2E

```bash
yarn test:e2e
```

### Cobertura de Testes

```bash
yarn test:cov
```

## 📦 Scripts Disponíveis

- `yarn build`: Compila o projeto
- `yarn start:dev`: Inicia o servidor em modo desenvolvimento
- `yarn start:debug`: Inicia o servidor em modo debug
- `yarn start:prod`: Inicia o servidor em modo produção
- `yarn test`: Executa todos os testes
- `yarn migration:generate`: Gera uma nova migração
- `yarn migration:run`: Executa as migrações pendentes
- `yarn migration:revert`: Reverte a última migração
- `yarn seed:superuser`: Cria um superusuário

## 📚 Documentação da API

A documentação da API está disponível através do Swagger UI quando o servidor estiver rodando:

```html
http://localhost:3000/api/docs
```

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture e DDD, com a seguinte estrutura:

```bash
├── backend/                  # Backend da aplicação
│   ├── src/
│   │   ├── modules/          # Módulos da aplicação
│   │   │   ├── auth/         # Autenticação e autorização
│   │   │   ├── user/         # Gestão de usuários
│   │   │   │   ├── application/ # Aplicação de negócio
│   │   │   │   │   ├── dtos/ # Data Transfer Objects
│   │   │   │   │   └── use-cases/ # Casos de uso
│   │   │   │   ├── domain/   # Domínio da aplicação
│   │   │   │   │   ├── entities/ # Entidades
│   │   │   │   │   ├── enums/ # Enums
│   │   │   │   │   ├── values-objects/ # Valores de objeto
│   │   │   │   │   └── repositories/ # Repositórios
│   │   │   │   └── presentation/ # Camadas de apresentação
│   │   │   │   │   └── user.controller.ts/ # Controlador de usuários
│   │   │   │   └── user.module.ts # Módulo de usuários
│   │   │   ├── product/      # Gestão de produtos
│   │   │   ├── category/     # Categorias de produtos
│   │   │   ├── batch/        # Lotes de produtos
│   │   │   ├── sale/         # Vendas
│   │   │   ├── shipment/     # Envios
│   │   │   └── ...
│   │   ├── shared/           # Código compartilhado
│   │   │   ├── config/       # Configurações
│   │   │   ├── infra/        # Infraestrutura
│   │   │   │   ├── auth/     # Implementações de autenticação
│   │   │   │   ├── database/ # Configurações do banco de dados
│   │   │   │   └── logging/  # Configurações de logging
│   │   │   └── ...
│   │   └── main.ts           # Ponto de entrada da aplicação
│   ├── test/                 # Testes
│   │   ├── unit/             # Testes unitários
│   │   ├── integration/      # Testes de integração
│   │   └── e2e/              # Testes end-to-end
│   └── ...
└── ...
```

## 🔒 Segurança

- Autenticação via JWT
- Autorização via CASL
- Rate Limiting
- Validação de entrada com class-validator
- Sanitização de dados
- Logging de segurança

## 📧 Contato

Gabriel Aguiar - [@gabriel-aguiar-reis](https://github.com/gabriel-aguiar-reis)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabriel-aguiar-reis/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lugafeagre@gmail.com)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
