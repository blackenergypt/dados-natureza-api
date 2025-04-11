# Dados Natureza API

API para fornecer dados sobre natureza e categorias em formato JSON.

## 🚀 Sobre o Projeto

Esta API fornece endpoints para aceder a dados de natureza e categorias a partir de ficheiros Excel (.xlsx) e CSV. A API está disponível em produção em [oc.codefusion.pt/api](https://oc.codefusion.pt/api).

## 📋 Endpoints

### GET /api/natureza
Retorna dados do ficheiro `natureza.xlsx` em formato JSON.

### GET /api/categories
Retorna dados do ficheiro `categories.csv` em formato JSON.

## 🛠️ Tecnologias

- Node.js 20
- Express.js
- XLSX (para leitura de ficheiros Excel)
- CSV-Parser (para leitura de ficheiros CSV)
- PNPM (gestor de pacotes)

## 🚀 Como Executar

### Pré-requisitos

- Docker
- Docker Compose

### Desenvolvimento

```bash
# Iniciar ambiente de desenvolvimento
docker-compose up dev
```

### Produção

```bash
# Iniciar ambiente de produção
docker-compose up app
```

A API estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
.
├── Dockerfile
├── docker-compose.yml
├── index.js
├── natureza.xlsx
├── categories.csv
├── package.json
└── README.md
```

## 🔧 Configuração

O projeto utiliza duas configurações principais:

1. **Desenvolvimento**: NODE_ENV=development
2. **Produção**: NODE_ENV=production

## 📝 Ficheiros de Dados

- `natureza.xlsx`: Contém dados sobre natureza
- `categories.csv`: Contém dados sobre categorias

## 🔒 Segurança

A API está configurada para execução em ambiente Docker, garantindo isolamento e segurança.

## 📄 Licença

Este projeto está sob a licença ISC.
