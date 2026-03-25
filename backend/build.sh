#!/usr/bin/env bash
set -e  # Faz o script parar se algum comando falhar

# Instala dependências
npm install

# Build do projeto
npm run build

# Roda as migrations do TypeORM
npm run prod:migration:run

# Cria ou atualiza o superusuário inicial
npm run prod:seed:superuser