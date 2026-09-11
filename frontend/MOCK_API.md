# API mock local com MSW

O frontend pode rodar sem backend e sem banco usando uma massa de dados em memoria interceptada pelo [MSW](https://mswjs.io/) no navegador.

As chamadas para `/api/auth/*` e `/api/backend/*` sao respondidas pelo service worker do MSW quando `NEXT_PUBLIC_LUXIS_MOCK_API=true`.

## Como iniciar

```bash
npm --prefix frontend run dev:mock
```

A flag equivalente e:

```bash
NEXT_PUBLIC_LUXIS_MOCK_API=true
```

O mock e desativado automaticamente em `NODE_ENV=production`.

## Login

Qualquer senha e aceita. Use um destes emails para trocar o perfil hidratado:

- `admin@luxis.local` - administrador
- `marina@luxis.local` - revendedora ativa
- `renata@luxis.local` - revendedora ativa

## Dados incluidos

A massa inicial cobre os principais fluxos do frontend:

- usuarios, usuarios pendentes e produtos por usuario
- fornecedores, categorias e modelos
- lotes com produtos em estoque
- clientes
- vendas, confirmacao, status e parcelas pagas
- remessas, devolucoes e transferencias
- KPIs de admin e de my-space
- solicitacoes de reset de senha

## Persistencia

Os dados vivem apenas na memoria da sessao do navegador/service worker. Ao recarregar o worker ou reiniciar o dev server, a massa volta ao seed inicial.

Isso e proposital para desenvolvimento: voce pode criar, editar, apagar e validar telas sem sujar banco local nem depender do backend.

## Arquivos principais

- `src/mocks/handlers.ts`: seed e handlers MSW da API fake.
- `src/mocks/browser.ts`: inicializacao do service worker.
- `src/components/mock-api-provider.tsx`: liga o MSW antes da arvore da aplicacao renderizar.
