# Dados Natureza API

API para fornecer dados sobre natureza e categorias em formato JSON.

## 🚀 Sobre o Projeto

Esta API fornece endpoints para aceder a dados de natureza e categorias a partir de ficheiros Excel (.xlsx) e CSV. A API está disponível em produção em [data.codefusion.pt/oc/v1](https://data.codefusion.pt/oc/v1).

## 📋 Endpoints

### GET /oc/v1/natureza
Retorna todos os dados do ficheiro `natureza.xlsx` em formato JSON.

### GET /oc/v1/natureza/:code
Retorna um dado específico baseado no código fornecido.

### GET /oc/v1/categories
Retorna dados do ficheiro `categories.csv` em formato JSON.

### GET /oc/v1/search
Realiza uma busca nos dados de natureza.

### GET /health
Retorna o estado de saúde da API.

## 🛠️ Tecnologias

- Node.js 20
- Express.js
- XLSX (para leitura de ficheiros Excel)
- CSV-Parser (para leitura de ficheiros CSV)
- Redis (para cache)
- PNPM (gestor de pacotes)

## 🚀 Como Executar

### Pré-requisitos

- Docker
- Docker Compose
- Redis

### Desenvolvimento

```bash
# Copiar arquivo de exemplo de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env

# Iniciar ambiente de desenvolvimento
docker-compose up dev
```

### Produção

```bash
# Copiar arquivo de exemplo de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env

# Iniciar ambiente de produção
docker-compose up app
```

A API estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   └── naturezaController.js
│   ├── routes/
│   │   └── naturezaRoutes.js
│   ├── services/
│   │   ├── cacheService.js
│   │   └── fileService.js
│   └── app.js
├── data/
│   ├── natureza.xlsx
│   └── categories.csv
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

## 🔧 Configuração

O projeto utiliza as seguintes configurações:

1. **Ambiente**:
   - Desenvolvimento: NODE_ENV=development
   - Produção: NODE_ENV=production

2. **Redis**:
   - REDIS_HOST=redis
   - REDIS_PORT=6379
   - REDIS_USER=default
   - REDIS_PASSWORD=seu_password

3. **API**:
   - PORT=3000
   - API_PREFIX=/oc/v1

## 📝 Ficheiros de Dados

- `natureza.xlsx`: Contém dados sobre natureza
- `categories.csv`: Contém dados sobre categorias

## 🔒 Segurança

- A API está configurada para execução em ambiente Docker
- Redis com autenticação por usuário e senha
- Isolamento de serviços
- Cache com TTL configurável

## 📄 Licença

Este projeto está sob a licença ISC.
