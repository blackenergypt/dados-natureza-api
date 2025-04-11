# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-PT/1.0.0/),
e este projeto adere a [Semantic Versioning](https://semver.org/lang/pt-PT/spec/v2.0.0.html).

## [1.3.0] - 2025-04-11

### Adicionado
- Implementação do Redis para cache
- Autenticação segura no Redis com usuário e senha
- Serviço de cache centralizado
- Cache para endpoints:
  - /oc/v1/natureza (TTL: 1 hora)
  - /oc/v1/natureza/:code (TTL: 1 hora)
  - /oc/v1/categories (TTL: 1 hora)
  - /oc/v1/search (TTL: 1 hora)
  - /health (TTL: 5 minutos)
- Configuração de ambiente para Redis
- Exemplo de arquivo .env

### Alterado
- Atualização do docker-compose.yml para incluir serviço Redis
- Melhorias na configuração de ambiente
- Otimização de performance com cache

## [1.2.0] - 2025-04-11

### Adicionado
- Melhorias na leitura de ficheiros Excel e CSV
- Logs detalhados para debug do processamento de dados
- Suporte para diferentes formatos de cabeçalhos nos ficheiros
- Validação mais robusta dos dados lidos
- Novo endpoint de busca (/oc/v1/search)
- Endpoint para busca por código (/oc/v1/natureza/:code)

### Corrigido
- Problema na leitura do ficheiro Excel com campos vazios
- Correção do mapeamento de campos entre Excel e CSV
- Melhor tratamento de erros na leitura de ficheiros

## [1.1.0] - 2025-04-11

### Adicionado
- Reorganização completa da estrutura do projeto
- Adição de configurações centralizadas
- Separação de responsabilidades em módulos
- Melhor tratamento de erros e logging
- Suporte para diferentes ambientes (dev/prod)

### Alterado
- Atualização do Dockerfile para Node.js 20
- Mudança de npm para pnpm
- Melhorias na documentação

## [1.0.0] - 2025-04-11

### Adicionado
- API REST para consulta de dados de natureza
- Endpoints:
  - GET /oc/v1/natureza
  - GET /oc/v1/natureza/:code
  - GET /oc/v1/categories
  - GET /oc/v1/search
  - GET /health
- Leitura de ficheiros Excel e CSV
- Documentação em português de Portugal
- Dockerfile e docker-compose.yml
- Configuração de ambiente
- Logging de requisições
- Tratamento de erros
- Validação de dados
- Testes de integração 