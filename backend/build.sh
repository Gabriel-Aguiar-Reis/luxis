#!/usr/bin/env bash
set -e  # Faz o script parar se algum comando falhar

# Instala dependências
npm install

# Build do projeto
npm run build

# Roda as migrations do TypeORM
npm run prod:migration:run