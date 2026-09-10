# Operacao e deploy

## Topologia

O ambiente publicado separa frontend e backend:

- Backend: Render, definido em `render.yaml`.
- Banco: PostgreSQL gerenciado pelo Render.
- Frontend: Vercel, configurado em `frontend/vercel.json`.
- Imagens: Cloudinary.
- Emails: MailerSend.

O backend escuta em `0.0.0.0` e usa `PORT` fornecida pelo ambiente. O healthcheck do Render e `GET /health`.

## Deploy do backend

O `render.yaml` cria:

1. banco `luxis-db`;
2. servico Node `luxis-backend` com `rootDir: backend`;
3. build por `backend/build.sh`;
4. start por `npm run start:prod`;
5. variaveis de banco e aplicacao.

Segredos preenchidos manualmente no Render:

- `JWT_SECRET`;
- `CORS_ORIGINS`;
- credenciais Cloudinary;
- credenciais do superusuario inicial;
- MailerSend e `EMAIL_FROM`;
- `EMAIL_RESET_PASSWORD_URL`.

Nunca armazene esses valores no Git.

## Deploy do frontend

Configure no provedor do frontend:

```env
NEXT_PUBLIC_API_URL=https://<backend-publico>
NEXT_PUBLIC_CLOUDINARY_API_KEY=<chave-publica>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud-name>
```

`NEXT_PUBLIC_*` fica exposto ao navegador; use apenas valores que podem ser publicos. Segredos permanecem no backend.

## Banco em producao

Fluxo recomendado:

```bash
npm run build --workspace backend
npm --prefix backend run prod:migration:run
```

Revise o plano da migracao e mantenha backup antes de alteracoes destrutivas. A aplicacao nao deve executar `migration:revert` automaticamente no deploy.

## Logs e observabilidade

O backend usa Pino:

- desenvolvimento: `pino-pretty` para leitura local;
- producao: logs estruturados para o provedor;
- nivel configuravel por `LOG_LEVEL`.

Use `GET /health` para disponibilidade basica. Erros de aplicacao devem ser acompanhados pelos logs do Render e pelos logs do frontend/Vercel.

## Operacoes locais

```bash
npm run db:up
npm run db:logs
npm run db:down
npm run db:reset
```

O volume `postgres_data` persiste os dados entre reinicios. `db:reset` remove esse volume e e destrutivo.

## Troubleshooting

### O frontend nao acessa a API

1. Confira `NEXT_PUBLIC_API_URL`.
2. Confira `CORS_ORIGINS` no backend.
3. Confirme que `credentials: true` e aceito pela origem configurada.
4. Teste `GET /health` diretamente.

### Erro de banco ao iniciar

1. Confirme `docker compose ps`.
2. Verifique se o backend usa `DB_PORT=5433` quando conecta ao PostgreSQL publicado localmente.
3. Confira usuario, senha e nome do banco.
4. Execute `npm --prefix backend run migration:run`.

### Sessao expirada ou redirecionamento inesperado

1. Limpe o cookie de autenticacao do dominio.
2. Confirme `AUTH_COOKIE_NAME` entre ambientes.
3. Verifique `JWT_SECRET`, expiracao e status do usuario.
4. Confirme se o papel e `ADMIN` ou `RESELLER` conforme a area acessada.

### Dependencias com engine incompatível

```bash
nvm install
nvm use
node --version
npm ci
```

A versao esperada e a definida em `.nvmrc`.
