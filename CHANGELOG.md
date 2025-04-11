# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.5] - 2025-04-11

### Corrigido
- Hotfix para erro de inicialização do servidor em ambiente Docker
- Problema com o caminho `/app` no container
- Tratamento de sinal SIGTERM durante a inicialização
- Erro de comando falhado no script de inicialização

### Alterado
- Script de inicialização para lidar com erros de ambiente
- Configuração de caminhos no container Docker
- Tratamento de sinais de término
- Logs de erro do npm

## [1.3.4] - 2025-04-11

### Adicionado
- Logs detalhados de inicialização do servidor
- Mensagens de status do Redis na inicialização
- Configuração de ambiente de produção
- Lista de endpoints disponíveis no log de inicialização

### Corrigido
- Problemas de inicialização do servidor em ambiente Docker
- Configuração de rede entre serviços no Docker
- Tratamento de sinais SIGTERM
- Logs de debug do npm

### Alterado
- Mensagens de inicialização do servidor
- Formato dos logs de configuração
- Estrutura de inicialização da aplicação
- Documentação de ambiente de produção

## [1.3.3] - 2025-04-11

### Adicionado
- Dependência `dotenv` para gerenciamento de variáveis de ambiente
- Configuração centralizada de ambiente no `config.js`
- Suporte a variáveis de ambiente para Redis
- Valores padrão para configurações críticas

### Corrigido
- Erro de módulo não encontrado para `dotenv`
- Configuração de ambiente no Docker
- Carregamento de variáveis de ambiente
- Dependências faltantes no package.json

### Alterado
- Estrutura de configuração do projeto
- Gerenciamento de variáveis de ambiente
- Documentação de configuração
- Scripts de inicialização

## [1.3.2] - 2025-04-11

### Adicionado
- Dependência `cors` para permitir requisições cross-origin
- Dependências de desenvolvimento:
  - `jest` para testes
  - `nodemon` para desenvolvimento
- Configuração de engines para Node.js >= 20.0.0

### Corrigido
- Erro de módulo não encontrado para `cors`
- Scripts de desenvolvimento e testes
- Configuração de dependências no package.json

### Alterado
- Estrutura de scripts no package.json
- Configuração de ambiente de desenvolvimento
- Documentação atualizada com novas dependências

## [1.3.1] - 2025-04-11

### Adicionado
- Formato de data e hora em português (Lisboa) para todos os logs
- Registro do IP do cliente em todas as requisições
- Logs detalhados para operações de cache incluindo IP do cliente
- Middleware para captura e registro do IP do cliente
- Função centralizada de formatação de data

### Corrigido
- Padronização dos formatos de data em todos os serviços
- Melhoria na consistência das mensagens de log
- Ajuste no formato das chaves de cache
- Correção no tratamento de erros com IP do cliente

### Alterado
- Estrutura dos logs para incluir data, IP e detalhes da operação
- Mensagens de erro mais descritivas e padronizadas
- Formato das mensagens de cache para melhor legibilidade
- Documentação atualizada com novos formatos de log

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
- Arquivo `.env.example`