#!/bin/bash

echo "🔧 Configurando ambiente GCP local..."

echo "📦 Instalando dependências da API..."
cd services/test-api
npm install
cd ../..

echo "🏗️ Construindo containers..."
docker-compose build

echo "✅ Setup concluído! Use './scripts/start.sh' para iniciar o ambiente."