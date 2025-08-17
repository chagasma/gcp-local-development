#!/bin/bash

echo "🚀 Iniciando ambiente GCP local..."
docker-compose up -d

echo ""
echo "✅ Ambiente rodando em:"
echo "- 🔥 Firestore: http://localhost:8080"
echo "- 📁 Storage: http://localhost:4443"
echo "- 🌐 Test API: http://localhost:3000"
echo "- 📊 Firebase UI: http://localhost:4000"
echo ""
echo "🧪 Endpoints de teste:"
echo "- POST /api/upload - Upload de arquivo"
echo "- GET /api/firestore/uploads - Listar uploads"
echo "- GET /api/storage/files - Listar arquivos"
echo "- GET /health - Health check"
echo ""
echo "Use './scripts/stop.sh' para parar o ambiente."