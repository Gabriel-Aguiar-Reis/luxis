# API

## Enderecos

Em desenvolvimento:

- Base URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`
- Healthcheck: `GET /health`

O contrato versionado localmente fica em `backend/openapi.json` e e gerado pelo script `generate:spec`.

## Autenticacao

A sessao de navegador usa cookie JWT httpOnly configurado por `AUTH_COOKIE_NAME`.

Endpoints centrais:

- `POST /auth/login`: autentica credenciais e cria a sessao.
- `POST /auth/verify`: verifica a sessao atual; Bearer token tambem e aceito para clientes compativeis.
- `POST /auth/logout`: encerra a sessao e limpa o cookie.
- `POST /auth/change-password`: troca a senha do usuario autenticado.

Para clientes que nao usam cookies:

```http
Authorization: Bearer <jwt>
```

Nunca envie `JWT_SECRET` ao frontend e nunca persista tokens de sessao em localStorage.

## Convencoes HTTP

- JSON e o formato padrao de entrada/saida.
- DTOs rejeitam campos desconhecidos.
- Erros sao normalizados pelo filtro global de excecoes.
- `204 No Content` e usado em operacoes que nao retornam corpo, como login/logout conforme o endpoint.
- Datas devem ser enviadas em formato ISO quando o DTO solicitar uma data.
- UUIDs devem ser enviados como strings UUID validas.

## Areas de endpoints

Os controllers sao agrupados por contexto:

- `auth`: autenticacao, senha e sessao.
- `users`: administracao de usuarios e papeis.
- `categories`: categorias.
- `product-models`: modelos de produto.
- `products`: unidades, status e catalogo.
- `batches`: lotes e entradas.
- `inventory`: consultas e disponibilidade.
- `sales`: vendas e pagamentos.
- `returns`: devolucoes.
- `shipments`: envios.
- `ownership-transfers`: transferencias entre revendedores.
- `customers`: clientes e carteira.
- `suppliers`: fornecedores.
- `admins-kpis-*`: indicadores administrativos.
- `reseller-kpis-*`: indicadores do revendedor.

Consulte o Swagger para parametros, respostas e autorizacao de cada operacao. O arquivo `backend/openapi.json` deve ser atualizado junto com mudancas publicas na API.

## Geracao do cliente frontend

```bash
npm --prefix backend run generate:spec
npm --prefix frontend run generate:types
npm --prefix frontend run generate:api
```

O Orval gera hooks React Query e modelos em `frontend/src/api`. Alteracoes manuais nesses arquivos serao perdidas na proxima geracao.

## CORS

O backend le `CORS_ORIGINS` como lista separada por virgulas. Exemplos:

```env
CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
```

Em desenvolvimento controlado, `CORS_ORIGINS=*` habilita qualquer origem. Em producao, prefira uma lista explicita com HTTPS.

## Healthcheck

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

O timestamp e variavel; o exemplo mostra apenas o formato.
