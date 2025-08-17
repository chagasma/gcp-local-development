# GCP Local Development Environment

Ambiente de desenvolvimento local que simula serviços do Google Cloud Platform para permitir desenvolvimento sem acesso às clouds reais.

## 🚀 Quick Start

```bash
# Setup inicial (apenas primeira vez)
./scripts/setup.sh

# Iniciar ambiente
./scripts/start.sh

# Parar ambiente
./scripts/stop.sh
```

## 📋 Serviços Incluídos

- **Firestore Emulator** (porta 8080) - Banco NoSQL
- **Cloud Storage Emulator** (porta 4443) - Armazenamento de arquivos  
- **Cloud Pub/Sub Emulator** (porta 8085) - Mensageria/triggers
- **Test API** (porta 3000) - API Fastify/TypeScript
- **Firebase UI** (porta 4000) - Interface web para visualizar dados

## 🔄 Fluxo de Trabalho

1. **Upload** → Arquivo é enviado para o Storage mockado
2. **Trigger** → Pub/Sub publica mensagem sobre o upload
3. **Processamento** → API processa arquivo e atualiza Firestore
4. **Persistência** → Dados ficam salvos no Firestore local

## 🧪 Endpoints da API

### Core

- `GET /health` - Health check
- `POST /api/upload` - Upload de arquivo

### Firestore

- `GET /api/firestore/uploads` - Listar todos uploads
- `GET /api/firestore/uploads/:id` - Buscar upload específico
- `POST /api/firestore/process/:id` - Marcar arquivo como processado

### Storage

- `GET /api/storage/files` - Listar arquivos
- `GET /api/storage/files/:fileName` - Download arquivo
- `DELETE /api/storage/files/:fileName` - Deletar arquivo

## 🧪 Testando

```bash
# Teste automatizado completo
./scripts/test-upload.sh

# Ou teste manual com curl
curl -X POST -F "file=@exemplo.txt" http://localhost:3000/api/upload
```

## 📁 Estrutura do Projeto

```
.
├── docker-compose.yml          # Orquestração dos serviços
├── config/
│   ├── firebase.json          # Configuração Firebase Emulators
│   ├── firestore.rules        # Regras do Firestore
│   ├── firestore.indexes.json # Índices do Firestore
│   └── storage-buckets.json   # Configuração buckets Storage
├── services/
│   └── test-api/              # API TypeScript/Fastify
│       ├── src/
│       │   ├── server.ts      # Servidor principal
│       │   ├── services/      # Clientes GCP
│       │   └── routes/        # Rotas da API
│       ├── package.json
│       ├── tsconfig.json
│       └── Dockerfile
├── scripts/
│   ├── setup.sh              # Setup inicial
│   ├── start.sh              # Iniciar ambiente
│   └── stop.sh               # Parar ambiente
├── test-endpoints.http        # Testes REST Client
└── test-upload.sh            # Script de teste automatizado
```

## 🔧 Requisitos

- Docker & Docker Compose
- Node.js 18+ (para desenvolvimento local)
- curl (para testes)
- jq (para parsing JSON nos testes)

## 💡 Desenvolvimento

Para desenvolver a API localmente:

```bash
cd services/test-api
npm install
npm run dev  # Executa com ts-node
```

## 🐳 Containers

- **Firebase Emulators**: `gcr.io/google.com/cloudsdktool/google-cloud-cli:emulators`
- **Storage Mock**: `fsouza/fake-gcs-server`
- **API**: Build local com Node.js 18 Alpine

## 🔍 URLs Úteis

- API: <http://localhost:3000>
- Firestore UI: <http://localhost:4000>
- Storage: <http://localhost:4443>
- Pub/Sub: <http://localhost:8085>

Pronto para desenvolvimento! 🎉
