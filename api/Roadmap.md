# Roadmap — Sistema de Gerenciamento de Acessórios para Esportes

## Fase 1 — Análise e Planejamento
- [x] Analisar requisitos e regras do projeto
- [x] Definir arquitetura de software (Separação API / Frontend / Serverless Vercel)
- [x] Definir estrutura de diretórios e padrões de código
- [x] Criar documentação inicial (Roadmap.md, Contexto.md, api.md)

## Fase 2 — Backend & Banco de Dados
- [x] Configurar Node.js e `package.json`
- [x] Configurar variáveis de ambiente (`.env.example` e `.env`)
- [x] Configurar conexão MongoDB com cache para ambiente serverless Vercel
- [x] Criar modelo de dados Mongoose (`Acessorio`) com validações rigorosas
- [x] Implementar middleware de CORS e tratamento centralizado de erros
- [x] Implementar endpoints RESTful da API (`GET`, `POST`, `PUT`, `DELETE`, `GET /:id`, `GET /health`)
- [x] Implementar validações de entrada e sanitização de IDs MongoDB (ObjectId)
- [x] Configurar compatibilidade com Vercel Serverless (`vercel.json` e handler de entrada)

## Fase 3 — Frontend
- [x] Criar interface HTML semântica e responsiva (`frontend/index.html`)
- [x] Criar folha de estilos CSS moderna, responsiva com tema esportivo (`frontend/style.css`)
- [x] Criar scripts JavaScript puro (Vanilla JS) para consumo da API via `fetch()` (`frontend/script.js`)
- [x] Implementar listagem dinâmica de acessórios em cards informativos
- [x] Implementar modal de cadastro com preview de imagem em tempo real
- [x] Implementar modal de edição de acessórios pré-preenchido
- [x] Implementar modal de confirmação para exclusão segura
- [x] Implementar filtro por esporte e busca textual em tempo real
- [x] Implementar sistema de toasts para feedback visual (sucesso / erro)
- [x] Implementar tratamento de imagem inválida/quebrada com fallback elegante
- [x] Implementar indicador de carregamento (spinner/skeleton) e estado de lista vazia

## Fase 4 — Testes & Validação
- [x] Testar conexão com o MongoDB Atlas
- [x] Testar endpoint GET `/api/acessorios` (lista vazia e com registros)
- [x] Testar endpoint GET `/api/acessorios/:id` (id válido e id inexistente)
- [x] Testar endpoint POST `/api/acessorios` (corpo válido e validação de campos obrigatórios)
- [x] Testar endpoint PUT `/api/acessorios/:id` (atualização válida e dados inválidos)
- [x] Testar endpoint DELETE `/api/acessorios/:id` (exclusão e tentativa em id já excluído)
- [x] Testar validações de ObjectId inválido (400 Bad Request)
- [x] Testar tratamento de erros e segurança de respostas (sem vazamento de dados sensíveis)
- [x] Testar responsividade e comportamento do frontend em resoluções mobile e desktop

## Fase 5 — Deploy & Finalização
- [x] Preparar estrutura para Vercel (`vercel.json` com rotas para frontend estático e serverless API)
- [x] Documentar configuração de variáveis de ambiente na Vercel
- [x] Atualizar documentação viva (`Contexto.md`)
- [x] Atualizar especificação técnica da API (`api.md`)
- [x] Realizar entrega final consolidada
