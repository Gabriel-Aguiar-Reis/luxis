# Documentacao do Luxis

Este diretorio concentra a documentacao tecnica e operacional do projeto.

## Guias

- [Desenvolvimento local](DEVELOPMENT.md): requisitos, instalacao, ambiente, comandos e testes.
- [Arquitetura](ARCHITECTURE.md): limites dos modulos, camadas, fluxos e responsabilidades.
- [API](API.md): Swagger, OpenAPI, autenticacao e convencoes HTTP.
- [Operacao e deploy](OPERATIONS.md): Docker, Render, frontend, observabilidade e troubleshooting.
- [Onboarding do frontend](../frontend/ONBOARDING.md): tour guiado e sua configuracao.
- [Utilitarios de telefone](../backend/docs/PHONE_UTILITIES.md): regras e uso dos utilitarios de telefone.
- [Nomes de bounded contexts](../backend/docs/BOUNDED_CONTEXTS_NAMES.md): convencoes de dominio.

## Fontes de verdade

- Dependencias e scripts: `package.json`, `backend/package.json` e `frontend/package.json`.
- Ambiente: `backend/.env.example` e `frontend/.env.example`.
- Contrato OpenAPI: `backend/openapi.json`.
- Infraestrutura local: `docker-compose.yml`.
- Deploy: `render.yaml` e `frontend/vercel.json`.

Quando esta documentacao divergir do codigo, os arquivos de configuracao e os contratos gerados devem ser considerados a fonte primaria.
