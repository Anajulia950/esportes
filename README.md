# Sistema de Gerenciamento de Acessórios para Esportes

Aplicação full-stack moderna para cadastro, consulta, filtragem, edição e exclusão (CRUD) de acessórios esportivos (marca, modelo, preço, foto e esporte/categoria).

Construído com **Node.js**, **Express**, **MongoDB Atlas**, **Mongoose** e um frontend independente em **HTML5**, **CSS3** e **JavaScript Puro (Vanilla JS)**, totalmente preparado para hospedagem serverless na **Vercel**.

---

## 📁 Estrutura do Projeto

```text
.
├── vercel.json                # Configuração para deploy Serverless na Vercel
├── package.json               # Dependências e scripts do Node.js
├── .env.example               # Exemplo de configuração de variáveis de ambiente
├── .env                       # Variáveis de ambiente locais (não versionado)
├── .gitignore                 # Arquivos ignorados pelo Git
│
├── /api
│   ├── config/
│   │   └── db.js              # Conexão MongoDB com cache para serverless
│   ├── models/
│   │   └── Acessorio.js       # Model e Schema Mongoose com validações
│   ├── controllers/
│   │   └── acessorioController.js # Lógica de negócio do CRUD e validações
│   ├── routes/
│   │   └── acessorios.js      # Rotas RESTful (/api/acessorios)
│   ├── middlewares/
│   │   ├── cors.js            # Middleware de CORS configurável
│   │   └── errorHandler.js    # Tratamento centralizado de erros
│   ├── app.js                 # Inicialização do Express
│   ├── index.js               # Handler Serverless para a Vercel
│   ├── server.js              # Servidor Express para execução local
│   ├── seed.js                # Dados de exemplo para o banco
│   ├── Roadmap.md             # Rastreamento de progresso do projeto
│   ├── Contexto.md            # Documentação viva do sistema
│   └── api.md                 # Documentação detalhada da API REST
│
├── /frontend
│   ├── index.html             # Interface do usuário (HTML5 semântico)
│   ├── style.css              # Estilos responsivos (CSS3 moderno)
│   └── script.js              # Lógica de consumo da API via fetch()
│
└── /tests
    └── test_runner.js         # Bateria de testes automatizados
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js (versão 18 ou superior instalada)
- Conexão com a Internet para o MongoDB Atlas

### 2. Instalação das Dependências
No terminal, na pasta raiz do projeto:
```bash
npm install
```

### 3. Configuração do Arquivo `.env`
O arquivo `.env` já foi configurado com a string de conexão informada. Para conferir ou alterar:
```env
MONGODB_URI=mongodb+srv://biscassianajulia_db_user:Juju300808@cluster0.bckf4kg.mongodb.net/acessorios_esportes?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
CORS_ORIGIN=*
```

### 4. Popular Dados Demonstrativos (Opcional)
Para inserir acessórios esportivos de exemplo no banco:
```bash
node api/seed.js
```

### 5. Iniciar a Aplicação
```bash
npm start
```
Acesse no seu navegador:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Acessórios**: [http://localhost:3000/api/acessorios](http://localhost:3000/api/acessorios)
- **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 6. Executar os Testes Automatizados
```bash
npm test
```

---

## ☁️ Deploy na Vercel

O projeto já contém o arquivo [vercel.json](file:///c:/Users/sonat/Downloads/anajulia/vercel.json) configurado para construir o handler serverless `/api` e servir o frontend estático automaticamente.

### Passos para deploy:
1. Envie o projeto para um repositório no GitHub ou use a Vercel CLI (`vercel`).
2. No painel da Vercel, crie um novo projeto e vincule o repositório.
3. Nas configurações do projeto na Vercel (**Settings > Environment Variables**), adicione a variável:
   - **Nome**: `MONGODB_URI`
   - **Valor**: `mongodb+srv://biscassianajulia_db_user:Juju300808@cluster0.bckf4kg.mongodb.net/acessorios_esportes?retryWrites=true&w=majority&appName=Cluster0`
4. Clique em **Deploy**. A Vercel disponibilizará automaticamente a URL de produção.

---

## 📖 Documentação Adicional
- [Roadmap.md](file:///c:/Users/sonat/Downloads/anajulia/api/Roadmap.md): Fases e status de implementação.
- [Contexto.md](file:///c:/Users/sonat/Downloads/anajulia/api/Contexto.md): Arquitetura, decisões técnicas e histórico.
- [api.md](file:///c:/Users/sonat/Downloads/anajulia/api/api.md): Documentação completa de todos os endpoints REST, parâmetros, erros e exemplos cURL.
