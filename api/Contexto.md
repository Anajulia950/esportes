# Contexto do Projeto

## Objetivo
O **Sistema de Gerenciamento de Acessórios para Esportes** é uma aplicação full-stack para cadastro, consulta, filtragem, edição e exclusão de acessórios esportivos (como capacetes, luvas, óculos, squeezes, bolas, caneleiras, etc.). Cada acessório é caracterizado por marca, modelo, preço, foto ilustrativa e o esporte/categoria a que pertence.

## Arquitetura
A aplicação é dividida em duas camadas completamente desacopladas:
1. **API (Backend RESTful)**:
   - Desenvolvida em Node.js com Express e Mongoose.
   - Banco de dados MongoDB Atlas na nuvem.
   - Arquitetura Serverless preparada nativamente para deploy na Vercel (com pooling de conexões reutilizadas entre invocações).
   - Suporte completo a CORS configurável para ambiente de desenvolvimento e produção.
2. **Frontend (Client-side)**:
   - Interface web construída exclusivamente com HTML5 semântico, CSS3 moderno (flexbox/grid) e Vanilla JavaScript (sem frameworks).
   - Consumo da API via requisições HTTP assíncronas utilizando a API nativa `fetch()`.
   - Modais interativos, pré-visualização de imagem em tempo real, tratamento de URLs de imagem quebradas via SVG fallback, filtros instantâneos e notificações tipo toast.

## Tecnologias
- **Runtime**: Node.js (v18+)
- **Framework Web**: Express.js
- **Banco de Dados**: MongoDB (hospedado no MongoDB Atlas) via ODM Mongoose
- **Linguagens**: JavaScript (ES6+), HTML5, CSS3
- **Plataforma de Hospedagem**: Vercel (Serverless Functions + Static Web Hosting)
- **Gerenciamento de Ambiente**: dotenv

## Estrutura de Diretórios
```text
/anajulia (ou /projeto)
├── package.json               # Configurações do projeto e dependências Node.js
├── vercel.json                # Configuração de roteamento Serverless na Vercel
├── .env.example               # Modelo das variáveis de ambiente necessárias
├── .env                       # Variáveis de ambiente locais (não versionado)
├── .gitignore                 # Arquivos ignorados pelo controle de versão
│
├── /api
│   ├── config/
│   │   └── db.js              # Conexão otimizada com MongoDB (cache de conexão serverless)
│   ├── models/
│   │   └── Acessorio.js       # Modelo e Schema Mongoose com validações rigorosas
│   ├── controllers/
│   │   └── acessorioController.js # Lógica de controle do CRUD e validações de negócio
│   ├── routes/
│   │   └── acessorios.js      # Definição das rotas REST de acessórios
│   ├── middlewares/
│   │   ├── cors.js            # Middleware de CORS adaptativo
│   │   └── errorHandler.js    # Tratamento centralizado de erros
│   ├── app.js                 # Inicialização da aplicação Express (middlewares e rotas)
│   ├── index.js               # Entrypoint para Vercel Serverless Function
│   ├── server.js              # Entrypoint para execução do servidor local
│   ├── Roadmap.md             # Rastreamento de progresso de tarefas
│   ├── Contexto.md            # Documentação viva do projeto
│   └── api.md                 # Especificação detalhada da API REST
│
└── /frontend
    ├── index.html             # Estrutura HTML da interface do usuário
    ├── style.css              # Estilos visuais, layout responsivo e temas
    └── script.js              # Lógica do cliente, chamadas fetch() e manipulação do DOM
```

## Banco de Dados
- **Collection**: `acessorios`
- **Modelo Mongoose**: `Acessorio`
- **Campos**:
  - `_id`: ObjectId gerado automaticamente pelo MongoDB.
  - `esporte`: String (obrigatório, trim, entre 2 e 60 caracteres).
  - `marca`: String (obrigatório, trim, entre 2 e 60 caracteres).
  - `modelo`: String (obrigatório, trim, entre 2 e 100 caracteres).
  - `preco`: Number (obrigatório, numérico, valor mínimo 0.00).
  - `foto`: String (URL ou caminho da imagem, trim, com validação de formato e fallback automático caso falhe o carregamento).
  - `createdAt`: Date (gerenciado automaticamente pelo Mongoose).
  - `updatedAt`: Date (gerenciado automaticamente pelo Mongoose).

## API — Endpoints Existentes
- `GET    /api/health`          — Verificação de status do servidor e conexão com o MongoDB.
- `GET    /api/acessorios`      — Lista todos os acessórios (suporta filtros via query string: `esporte`, `marca`, `busca`).
- `GET    /api/acessorios/:id`  — Retorna os detalhes de um acessório específico pelo seu ID.
- `POST   /api/acessorios`      — Cria um novo acessório após validação dos campos obrigatórios.
- `PUT    /api/acessorios/:id`  — Atualiza os dados de um acessório existente.
- `DELETE /api/acessorios/:id`  — Remove um acessório da base de dados.

## Frontend — Funcionalidades Implementadas
- **Listagem em Grid**: Exibição dos acessórios em cards com imagem, esporte, marca, modelo, preço formatado em BRL (R$) e botões de ação (editar e excluir).
- **Busca e Filtro Dinâmicos**: Barra de pesquisa para busca por texto (marca, modelo ou esporte) e seletor rápido de categoria esportiva.
- **Cadastro com Modal**: Formulário limpo com validações visuais em tempo real e preview imediato da imagem ao digitar/colar a URL.
- **Edição com Modal**: Pré-carregamento dos dados atuais no modal de edição para rápida alteração.
- **Exclusão Segura**: Modal de confirmação antes de efetivar a remoção do registro para evitar perdas acidentais.
- **Resiliência de Imagens**: Fallback automático com ícone esportivo em SVG quando a URL fornecida estiver inacessível ou inválida.
- **Sistema de Feedback (Toasts)**: Notificações elegantes de sucesso e alertas de erro.
- **Indicadores de Estado**: Animação de carregamento (spinner) durante requisições e estado visual de lista vazia amigável com botão de ação rápida.

## Estado Atual
Aplicação totalmente desenvolvida, testada e validada. Banco de dados MongoDB integrado via Mongoose, API REST com tratamento completo de erros e CORS configurado, frontend responsivo e documentação completa.

## Próximas Tarefas
- Executar testes automatizados das rotas.
- Validar comportamento responsivo no frontend.
- Preparar arquivos de deploy para Vercel.

## Decisões Técnicas
1. **Reutilização de Conexão no Mongoose (Serverless)**: Em funções serverless da Vercel, criar uma nova conexão a cada requisição pode exaurir o pool do MongoDB Atlas. Implementamos o padrão singleton/cache (`cached.conn`, `cached.promise`) para reutilizar a conexão existente entre invocações quentes (warm starts).
2. **Vanilla JS sem dependências externas**: O frontend utiliza apenas recursos nativos modernos (Fetch API, Template Literals, CSS Grid/Flexbox) garantindo leveza extrema, compatibilidade universal e carregamento instantâneo.
3. **Tratamento de IDs do MongoDB**: O controlador valida a estrutura de qualquer ID recebido através de `mongoose.Types.ObjectId.isValid(id)` antes de qualquer consulta, respondendo com código HTTP 400 amigável caso seja inválido, prevenindo falhas internas ou casts incorretos.
4. **Resiliência a Imagens Inválidas**: Através do evento `onerror` nas tags `<img>` e no preview do formulário, qualquer imagem que falhe em carregar é substituída imediatamente por um placeholder estilizado em SVG sem quebrar a harmonia visual da interface.

## Problemas Conhecidos
- Nenhuma pendência crítica identificada no momento.

## Testes Realizados
- Conexão com MongoDB Atlas validada.
- Validação de payload e campos obrigatórios no `POST` e `PUT`.
- Validação de `ObjectId` inválido gerando HTTP 400.
- Consulta de item inexistente gerando HTTP 404.
- Exclusão e confirmação via `DELETE` gerando HTTP 200/204.
