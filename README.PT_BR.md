<div align="center">

# 🌟 Luxis

### Sistema Inteligente de Gestão de Estoque para Revendedores

[![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

**Uma plataforma completa e moderna para transformar a gestão de estoque em vantagem competitiva.**

[📖 Documentação](#-documentação) • [✨ Funcionalidades](#-funcionalidades-principais) • [🚀 Começar](#-começar-agora) • [🏗️ Arquitetura](#️-arquitetura)

---

</div>

> **Idioma**: [English](README.md) | [Português (BR)](#)

## 🎯 Sobre o Luxis

Luxis é uma **solução empresarial completa** projetada especificamente para revendedores e distribuidores que precisam de controle total sobre seu estoque, vendas e operações. Desenvolvido com as tecnologias mais modernas do mercado, Luxis combina **performance**, **segurança** e **escalabilidade** em uma plataforma intuitiva e poderosa.

### 💡 Por que Luxis?

- **🎨 Interface Moderna**: Experiência de usuário excepcional com design responsivo e intuitivo
- **🔐 Segurança de Nível Empresarial**: Autenticação JWT, controle de acesso baseado em funções (RBAC) e proteção contra ataques
- **📊 Analytics em Tempo Real**: KPIs e métricas que transformam dados em decisões estratégicas
- **🌐 Multi-idioma**: Suporte completo para português e inglês
- **📱 Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e smartphone
- **⚡ Performance Excepcional**: Arquitetura otimizada para milhares de operações simultâneas
- **🔄 Rastreabilidade Total**: Controle completo do ciclo de vida dos produtos, do estoque à venda

---

## ✨ Funcionalidades Principais

### 👥 Gestão de Usuários e Permissões

- Múltiplos perfis de acesso (Administrador, Revendedor, Assistente)
- Sistema de aprovação de novos usuários
- Controle granular de permissões com CASL
- Histórico completo de ações

### 📦 Controle de Inventário Inteligente

- Gerenciamento de produtos por modelo, categoria e lote
- Rastreamento de localização e status de cada item
- Sistema de transferência de propriedade entre revendedores
- Inventário em tempo real com alertas automáticos
- Controle de estoque mínimo e máximo

### 💰 Gestão Completa de Vendas

- Processamento de vendas à vista e parceladas
- Cálculo automático de preços e margens
- Emissão de comprovantes e notas
- Controle de parcelas e recebimentos
- Histórico detalhado de transações

### 📊 Analytics e Relatórios

- **Dashboard Executivo**: Visão 360° do seu negócio
- **KPIs em Tempo Real**:
  - Produtos em estoque
  - Tempo médio de permanência no estoque
  - Ticket médio de vendas
  - Performance por revendedor
  - Taxa de retorno e devoluções
- **Relatórios Personalizados**: Exports em PDF e CSV

### 📮 Sistema de Envios e Logística

- Controle de remessas e entregas
- Rastreamento de status de envio
- Integração com sistemas de logística
- Notificações automáticas

### 🔄 Gestão de Devoluções

- Processamento simplificado de devoluções
- Reintegração automática ao estoque
- Análise de motivos de devolução
- Impacto financeiro calculado automaticamente

### 🏢 Gestão de Clientes e Fornecedores

- Cadastro completo de clientes
- Histórico de compras e preferências
- Gestão de fornecedores
- Portfólio de clientes por revendedor

### 🖼️ Gestão de Imagens

- Upload otimizado via Cloudinary
- Compressão automática de imagens
- Múltiplas imagens por produto
- Visualização responsiva

### 📧 Notificações Inteligentes

- Sistema de emails transacionais via MailerSend
- Recuperação de senha
- Notificações de vendas e transferências
- Alertas personalizáveis

---

## 🏗️ Arquitetura

Luxis é construído sobre uma arquitetura moderna, escalável e mantível:

### Backend - Clean Architecture + DDD

```
backend/
├── src/
│   ├── modules/              # Módulos de domínio
│   │   ├── auth/            # Autenticação e autorização
│   │   ├── user/            # Gestão de usuários
│   │   ├── product/         # Produtos
│   │   ├── category/        # Categorias
│   │   ├── batch/           # Lotes
│   │   ├── inventory/       # Inventário
│   │   ├── sale/            # Vendas
│   │   ├── shipment/        # Envios
│   │   ├── return/          # Devoluções
│   │   ├── customer/        # Clientes
│   │   ├── supplier/        # Fornecedores
│   │   ├── ownership-transfer/  # Transferências
│   │   └── kpi/             # Indicadores de performance
│   │       ├── admin/       # KPIs administrativos
│   │       └── reseller/    # KPIs de revendedores
│   └── shared/              # Código compartilhado
│       ├── config/          # Configurações
│       ├── infra/           # Infraestrutura
│       │   ├── auth/        # JWT, CASL, Guards
│       │   ├── database/    # TypeORM, Migrations
│       │   └── logging/     # Sistema de logs
│       └── events/          # Event-driven architecture
└── test/                    # Testes completos
    ├── unit/               # Testes unitários
    ├── integration/        # Testes de integração
    └── e2e/                # Testes end-to-end
```

**Padrões Arquiteturais:**

- ✅ Clean Architecture (camadas bem definidas)
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
│   │   ├── [locale]/       # Rotas internacionalizadas
│   │   ├── login/          # Autenticação
│   │   ├── admin-login/    # Login administrativo
│   │   ├── sign-up/        # Cadastro
│   │   └── my-space/       # Área do usuário
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   ├── dashboard/     # Dashboard
│   │   ├── products/      # Produtos
│   │   ├── sales/         # Vendas
│   │   └── ...
│   ├── hooks/             # Custom hooks
│   ├── stores/            # Estado global (Zustand)
│   ├── lib/               # Utilitários
│   │   ├── api-client.ts  # Cliente HTTP
│   │   ├── api-types.ts   # Tipos TypeScript
│   │   └── i18n/          # Internacionalização
│   └── messages/          # Traduções (pt, en)
└── middleware.ts          # Proteção de rotas
```

**Stack Frontend:**

- ✅ Next.js 15 com App Router e Turbopack
- ✅ React 19 com Server Components
- ✅ TypeScript estrito
- ✅ Tailwind CSS para estilização
- ✅ shadcn/ui para componentes
- ✅ Zustand para estado global
- ✅ React Hook Form + Zod para formulários
- ✅ TanStack Query para cache de dados
- ✅ next-intl para i18n

---

## 🚀 Stack Tecnológica

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
- **CI/CD**: GitHub Actions
- **Containerização**: Docker (pronto para deploy)

---

## 🚀 Começar Agora

### Pré-requisitos

- **Node.js** 18+ (LTS recomendado)
- **PostgreSQL** 14+
- Contas em:
  - [Cloudinary](https://cloudinary.com/) (upload de imagens)
  - [MailerSend](https://www.mailersend.com/) (envio de emails)

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/gabriel-aguiar-reis/luxis.git
cd luxis

# 2. Instale as dependências
npm install

# 3. Configure o Backend
cd backend
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Execute as migrações
npm run migration:run

# 5. Crie o superusuário
npm run seed:superuser

# 6. Configure o Frontend
cd ../frontend
cp .env.example .env
# Edite o .env com a URL do backend

# 7. Volte para a raiz e inicie tudo
cd ..
npm run start
```

Pronto! 🎉

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3001
- **API Docs**: http://localhost:3000/api/docs

---

## 📖 Documentação

### Backend

Após iniciar o servidor backend, acesse a documentação interativa da API:

🔗 **Swagger UI**: http://localhost:3000/api/docs

A documentação inclui:

- Todos os endpoints disponíveis
- Schemas de request/response
- Autenticação e autorização
- Exemplos de uso
- Testes interativos

### Scripts Disponíveis

#### Backend

```bash
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:prod         # Inicia em modo produção
npm run build              # Compila o projeto
npm run test:unit          # Testes unitários
npm run test:integration   # Testes de integração
npm run test:e2e           # Testes end-to-end
npm run test:cov           # Cobertura de testes
npm run migration:generate # Gera nova migration
npm run migration:run      # Executa migrations
npm run seed:superuser     # Cria superusuário
```

#### Frontend

```bash
npm run dev                # Inicia em desenvolvimento (Turbopack)
npm run build              # Build de produção
npm run start              # Inicia versão de produção
npm run lint               # Verifica código
npm run generate:types     # Gera tipos do OpenAPI
```

#### Monorepo

```bash
npm run start              # Inicia backend + frontend simultaneamente
```

---

## 🔒 Segurança

Luxis implementa as melhores práticas de segurança:

- ✅ **Autenticação JWT** com refresh tokens
- ✅ **RBAC (Role-Based Access Control)** com CASL
- ✅ **Rate Limiting** para prevenir ataques
- ✅ **Validação de dados** em todas as camadas
- ✅ **Sanitização de inputs**
- ✅ **HTTPS** obrigatório em produção
- ✅ **Proteção contra SQL Injection**
- ✅ **Proteção contra XSS**
- ✅ **CORS** configurado adequadamente
- ✅ **Helmet** para headers de segurança
- ✅ **Logs de auditoria** completos

---

## 🧪 Testes

Luxis possui cobertura de testes abrangente:

```bash
# Backend
npm run test:unit          # Testes unitários rápidos
npm run test:integration   # Testes de integração com banco
npm run test:e2e           # Testes end-to-end completos
npm run test:cov           # Relatório de cobertura
```

**Tipos de Testes:**

- **Unit**: Testam componentes isolados (use cases, services)
- **Integration**: Testam integração com banco de dados
- **E2E**: Testam fluxos completos da aplicação

---

## 🌍 Internacionalização

Luxis é multilíngue desde sua concepção:

- 🇧🇷 **Português (pt)**
- 🇺🇸 **English (en)**

Adicionar novos idiomas é simples:

1. Crie o arquivo de mensagens em `frontend/src/messages/{locale}.json`
2. Configure o locale em `frontend/src/lib/i18n/routing.ts`
3. Pronto! ✨

---

## 🎨 Temas

Suporte completo para **Dark Mode** e **Light Mode**:

- Alternância instantânea
- Preferência salva localmente
- Respeita preferência do sistema
- Componentes otimizados para ambos os temas

---

## 📊 Monitoramento

### Logs

Sistema de logs estruturados com **Pino**:

- Logs por nível (debug, info, warn, error)
- Formato JSON para parsing
- Pretty print em desenvolvimento
- Rastreamento de requests
- Logs de auditoria

### Performance

- Cache inteligente de queries frequentes
- Lazy loading de componentes
- Otimização de imagens
- Code splitting automático
- Server-side rendering quando apropriado

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Padrões de Código

- Siga os princípios SOLID
- Use TypeScript strict mode
- Escreva testes para novas funcionalidades
- Siga os padrões de commit (Conventional Commits)
- Documente funções e componentes complexos

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

## 🙏 Agradecimentos

Luxis foi construído utilizando tecnologias open-source incríveis. Agradecimentos especiais às comunidades de:

- [NestJS](https://nestjs.com/)
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- E todas as outras bibliotecas que tornam este projeto possível

---

<div align="center">

**Construído com ❤️ por Gabriel Aguiar**

⭐ Se este projeto foi útil para você, considere dar uma estrela!

</div>
