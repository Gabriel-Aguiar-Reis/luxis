# Desenvolvimento local

## Requisitos

- Node.js `26.8.2`, gerenciado por nvm.
- npm `11+`.
- Docker Desktop com Docker Compose.
- Conta Cloudinary para upload de imagens.
- Conta MailerSend para emails transacionais.

O projeto declara a versao do Node em `.nvmrc` e no campo `engines` do `package.json`.

## Instalacao

```bash
nvm install
nvm use
npm ci
```

Crie os arquivos de ambiente a partir dos exemplos:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Preencha os valores de JWT, banco, CORS, Cloudinary e MailerSend. Nao versione arquivos `.env`.

## Banco local

Suba PostgreSQL e pgAdmin:

```bash
npm run db:up
```

O PostgreSQL fica exposto em `localhost:5433` por padrao, enquanto o container usa a porta `5432`. O pgAdmin fica em `http://localhost:5050`.

Para derrubar os containers:

```bash
npm run db:down
```

Para apagar o volume e recriar o banco:

```bash
npm run db:reset
```

Ajuste `DB_PORT=5433` no backend quando usar a porta publicada pelo Docker Compose.

## Inicializacao

Execute migracoes e crie o usuario administrador:

```bash
npm --prefix backend run migration:run
npm --prefix backend run seed:superuser
```

Inicie backend e frontend juntos:

```bash
npm start
```

URLs locais:

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Healthcheck: `http://localhost:3000/health`

Para iniciar individualmente:

```bash
npm --prefix backend run start:dev
npm --prefix frontend run dev
```

## Scripts de qualidade

Na raiz:

```bash
npm run check   # Biome: formatacao e lint
npm run lint    # Biome lint
npm run format  # Biome format --write
```

O frontend usa Vitest e o backend usa Jest com SWC:

```bash
npm --prefix frontend run test
npm --prefix backend run test -- --runInBand
```

Builds de producao:

```bash
npm run build --workspace backend
npm run build --workspace frontend
```

## Banco e migracoes

Scripts do backend:

- `migration:generate -- <nome>` cria uma migracao TypeORM.
- `migration:run` executa migracoes pendentes.
- `migration:revert` reverte a ultima migracao.
- `seed` executa dados de desenvolvimento.
- `seed:superuser` cria o administrador inicial.

Sempre revise a migracao gerada antes de executa-la em producao. O banco de testes de integracao usa SQLite em `test.sqlite` quando aplicavel.

## Geracao de contrato e cliente

Gere a especificacao OpenAPI:

```bash
npm --prefix backend run generate:spec
```

Gere os tipos e os hooks do frontend:

```bash
npm --prefix frontend run generate:types
npm --prefix frontend run generate:api
```

Os arquivos em `frontend/src/api` e `frontend/src/types` sao gerados. Evite edita-los manualmente.

## Fluxo recomendado

1. Crie uma branch a partir de `main`.
2. Altere o modulo mais proximo da regra de negocio.
3. Adicione ou atualize testes unitarios/integracao.
4. Execute `npm run check` e os testes afetados.
5. Execute os builds antes de abrir o pull request.
6. Gere novamente o contrato OpenAPI quando endpoints ou DTOs mudarem.
