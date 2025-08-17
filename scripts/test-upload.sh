#!/bin/bash

echo "🧪 Testando fluxo completo de upload..."

echo "1. Verificando se API está rodando..."
curl -s http://localhost:3000/health | jq '.'

echo -e "\n2. Criando arquivo de teste..."
echo "Este é um arquivo de teste criado em $(date)" > test-file.txt

echo -e "\n3. Fazendo upload do arquivo..."
UPLOAD_RESPONSE=$(curl -s -X POST \
  -F "file=@test-file.txt" \
  http://localhost:3000/api/upload)

echo $UPLOAD_RESPONSE | jq '.'

FILE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.fileId')

echo -e "\n4. Verificando dados no Firestore..."
curl -s http://localhost:3000/api/firestore/uploads/$FILE_ID | jq '.'

echo -e "\n5. Listando arquivos no Storage..."
curl -s http://localhost:3000/api/storage/files | jq '.'

echo -e "\n6. Processando arquivo..."
curl -s -X POST http://localhost:3000/api/firestore/process/$FILE_ID | jq '.'

echo -e "\n7. Verificando status processado..."
curl -s http://localhost:3000/api/firestore/uploads/$FILE_ID | jq '.'

rm test-file.txt

echo -e "\n✅ Teste completo finalizado!"