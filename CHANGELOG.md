# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-04-11

### Adicionado
- Implementação do Redis para cache com autenticação segura
- Serviço centralizado de cache (`CacheService`)
- Configuração de TTL (Time to Live) para diferentes endpoints:
  - `/oc/v1/natureza` (TTL: 1 hora)
  - `/oc/v1/natureza/:code` (TTL: 1 hora)
  - `/oc/v1/categories` (TTL: 1 hora)
  - `/oc/v1/search` (TTL: 1 hora)
  - `/health` (TTL: 5 minutos)
- Arquivo `.env.example` com configurações de ambiente
- Autenticação Redis com usuário e senha
- Logs detalhados para operações de cache

### Corrigido
- Correção na definição dos endpoints da API
- Ajuste nos métodos do controller para instância ao invés de estáticos
- Correção no tratamento de erros nas rotas
- Melhoria nas mensagens de erro em português
- Correção na estrutura de cache para diferentes endpoints

### Alterado
- Atualização do `docker-compose.yml` para incluir serviço Redis
- Melhoria na configuração de ambiente
- Otimização no processamento de dados
- Atualização da documentação com endpoints corretos

## [1.2.0] - 2025-04-10

### Adicionado
- Implementação de cache com Redis
- Serviço centralizado de cache
- Configuração de TTL para diferentes endpoints
- Documentação de endpoints no README

### Corrigido
- Correção no processamento de dados do Excel
- Melhoria no tratamento de erros
- Ajuste nas mensagens de erro em português

### Alterado
- Otimização no processamento de dados
- Melhoria na estrutura de cache
- Atualização da documentação

## [1.1.0] - 2025-04-09

### Adicionado
- Suporte a arquivos CSV
- Endpoint para categorias
- Endpoint de busca
- Health check
- Logs detalhados

### Corrigido
- Tratamento de erros
- Processamento de dados
- Mensagens de erro em português

### Alterado
- Melhoria na estrutura do projeto
- Otimização no processamento de dados
- Atualização da documentação

## [1.0.0] - 2025-04-08

### Adicionado
- Leitura de arquivos Excel
- Endpoint para listar todos os dados
- Endpoint para buscar por código
- Configuração básica do projeto
- Documentação inicial 