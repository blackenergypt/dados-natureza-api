# Registo de Alterações

Todas as alterações significativas neste projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-PT/1.0.0/),
e este projeto segue o [Versionamento Semântico](https://semver.org/lang/pt-PT/).

## [1.1.0] - 2024-04-11

### Adicionado
- Reorganização completa da estrutura do projeto
- Nova estrutura de pastas:
  - `src/` para código fonte
  - `src/config/` para configurações
  - `src/controllers/` para controladores
  - `src/routes/` para rotas
  - `src/services/` para serviços
  - `data/` para ficheiros de dados
  - `tests/` para testes (preparação)
- Configuração centralizada em `src/config/config.js`
- Serviço dedicado para operações com ficheiros
- Controlador separado para lógica de negócio
- Rotas organizadas e modularizadas
- Suporte a diferentes ambientes (desenvolvimento/produção)
- Scripts npm separados para dev e produção
- Configuração Docker otimizada para diferentes ambientes

### Alterado
- Endpoints atualizados para usar prefixo `oc/v1`
- Rota de saúde simplificada (removido prefixo `oc/v1`)
- Melhor tratamento de erros e logging
- Configuração de ambiente mais robusta
- Docker Compose atualizado para suportar diferentes ambientes

### Removido
- Ficheiro `index.js` antigo
- Configurações inline no código
- Duplicação de código

## [1.0.0] - 2024-04-11

### Adicionado
- Criação inicial da API
- Endpoint `/oc/v1/natureza` para leitura de dados do ficheiro Excel
- Endpoint `/oc/v1/categories` para leitura de dados do ficheiro CSV
- Endpoint `/health` para verificação de saúde
- Configuração Docker e Docker Compose
- Suporte a ambientes de desenvolvimento e produção
- Documentação completa no README.md
- Implementação com Node.js 20
- Utilização do PNPM como gestor de pacotes
- Integração com Express.js
- Suporte a leitura de ficheiros XLSX e CSV
- Implementação em produção em oc.codefusion.pt/oc/v1 