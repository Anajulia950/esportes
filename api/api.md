# Documentação da API — Acessórios Esportivos

Esta documentação descreve todos os endpoints, métodos HTTP, parâmetros, corpos de requisição e respostas da API REST de Gerenciamento de Acessórios para Esportes.

---

## URL Base

- **Ambiente Local**: `http://localhost:3000`
- **Ambiente Vercel**: `https://<seu-projeto>.vercel.app`

Todas as rotas da API iniciam pelo prefixo `/api`.

---

## Autenticação

A API atualmente é pública e não exige tokens ou chaves de autenticação nos cabeçalhos para o escopo deste MVP.

---

## Cabeçalhos Comuns (Headers)

- `Content-Type: application/json` (obrigatório para requisições com corpo: `POST` e `PUT`)
- `Accept: application/json`

---

## Endpoints

### 1. Status da API & Conexão

#### `GET /api/health`

Verifica a saúde da API e o status da conexão ativa com o MongoDB.

- **Método**: `GET`
- **Códigos de Resposta**:
  - `200 OK`: Serviço ativo e conectado ao banco.
  - `500 Internal Server Error`: Falha ao conectar ao banco.

##### Exemplo de Resposta (200 OK)
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 124.5,
  "timestamp": "2026-09-28T18:45:00.000Z"
}
```

##### Exemplo com cURL
```bash
curl -X GET http://localhost:3000/api/health
```

---

### 2. Listar Acessórios

#### `GET /api/acessorios`

Retorna todos os acessórios cadastrados no banco de dados, ordenados do mais recente para o mais antigo. Suporta parâmetros de busca e filtro opcionais via query string.

- **Método**: `GET`
- **Query Parameters (opcionais)**:
  - `esporte` (string): Filtra acessórios por esporte específico (ex: `Futebol`, `Ciclismo`, `Natação`).
  - `marca` (string): Filtra acessórios por marca (ex: `Nike`, `Adidas`).
  - `busca` (string): Busca textual case-insensitive em marca, modelo ou esporte.
- **Códigos de Resposta**:
  - `200 OK`: Sucesso na consulta.
  - `500 Internal Server Error`: Erro interno no servidor ou banco.

##### Exemplo de Resposta (200 OK)
```json
[
  {
    "_id": "66f7f2b1c8e9b41a3e5c9101",
    "esporte": "Ciclismo",
    "marca": "Giro",
    "modelo": "Capacete Foray MIPS",
    "preco": 349.9,
    "foto": "https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=500&auto=format&fit=crop",
    "createdAt": "2026-09-28T17:30:00.000Z",
    "updatedAt": "2026-09-28T17:30:00.000Z"
  },
  {
    "_id": "66f7f2b1c8e9b41a3e5c9102",
    "esporte": "Natação",
    "marca": "Speedo",
    "modelo": "Óculos Hydrotech Pro",
    "preco": 129.5,
    "foto": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop",
    "createdAt": "2026-09-28T17:32:00.000Z",
    "updatedAt": "2026-09-28T17:32:00.000Z"
  }
]
```

##### Exemplo com cURL
```bash
curl -X GET "http://localhost:3000/api/acessorios?esporte=Ciclismo"
```

---

### 3. Obter Acessório por ID

#### `GET /api/acessorios/:id`

Retorna um único acessório correspondente ao `_id` informado.

- **Método**: `GET`
- **Parâmetros de Rota**:
  - `:id` (string de 24 caracteres hexadecimais): ObjectId do acessório.
- **Códigos de Resposta**:
  - `200 OK`: Acessório localizado com sucesso.
  - `400 Bad Request`: Formato de ID inválido.
  - `404 Not Found`: Acessório não encontrado.
  - `500 Internal Server Error`: Erro interno no servidor.

##### Exemplo de Resposta (200 OK)
```json
{
  "_id": "66f7f2b1c8e9b41a3e5c9101",
  "esporte": "Ciclismo",
  "marca": "Giro",
  "modelo": "Capacete Foray MIPS",
  "preco": 349.9,
  "foto": "https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=500&auto=format&fit=crop",
  "createdAt": "2026-09-28T17:30:00.000Z",
  "updatedAt": "2026-09-28T17:30:00.000Z"
}
```

##### Exemplo de Resposta (404 Not Found)
```json
{
  "erro": "Acessório não encontrado."
}
```

##### Exemplo de Resposta (400 Bad Request)
```json
{
  "erro": "Identificador (ID) inválido."
}
```

##### Exemplo com cURL
```bash
curl -X GET http://localhost:3000/api/acessorios/66f7f2b1c8e9b41a3e5c9101
```

---

### 4. Cadastrar Novo Acessório

#### `POST /api/acessorios`

Cadastra um novo acessório esportivo no banco de dados.

- **Método**: `POST`
- **Headers**: `Content-Type: application/json`
- **Corpo da Requisição (Body JSON)**:
  - `esporte` (string, obrigatório): Categoria esportiva (entre 2 e 60 caracteres).
  - `marca` (string, obrigatório): Marca fabricante (entre 2 e 60 caracteres).
  - `modelo` (string, obrigatório): Nome do modelo (entre 2 e 100 caracteres).
  - `preco` (number, obrigatório): Valor numérico maior ou igual a 0.
  - `foto` (string, opcional): URL válida ou caminho da imagem. Caso omitido ou vazio, um placeholder padrão é atribuído.

##### Exemplo de Requisição (Body JSON)
```json
{
  "esporte": "Futebol",
  "marca": "Penalty",
  "modelo": "Luva de Goleiro Delta Pro",
  "preco": 189.90,
  "foto": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop"
}
```

- **Códigos de Resposta**:
  - `201 Created`: Acessório cadastrado com sucesso.
  - `400 Bad Request`: Dados inválidos ou campos obrigatórios ausentes.
  - `500 Internal Server Error`: Erro ao gravar no banco de dados.

##### Exemplo de Resposta (201 Created)
```json
{
  "mensagem": "Acessório cadastrado com sucesso.",
  "acessorio": {
    "_id": "66f7f3a2c8e9b41a3e5c9105",
    "esporte": "Futebol",
    "marca": "Penalty",
    "modelo": "Luva de Goleiro Delta Pro",
    "preco": 189.9,
    "foto": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop",
    "createdAt": "2026-09-28T18:00:00.000Z",
    "updatedAt": "2026-09-28T18:00:00.000Z"
  }
}
```

##### Exemplo de Resposta (400 Bad Request - Erro de validação)
```json
{
  "erro": "Falha na validação dos dados.",
  "detalhes": [
    "O campo 'preco' deve ser um valor numérico maior ou igual a zero."
  ]
}
```

##### Exemplo com cURL
```bash
curl -X POST http://localhost:3000/api/acessorios \
  -H "Content-Type: application/json" \
  -d '{"esporte":"Futebol","marca":"Penalty","modelo":"Luva Delta Pro","preco":189.90,"foto":"https://exemplo.com/foto.jpg"}'
```

---

### 5. Atualizar Acessório

#### `PUT /api/acessorios/:id`

Atualiza as informações de um acessório existente.

- **Método**: `PUT`
- **Parâmetros de Rota**:
  - `:id` (string): ObjectId do acessório.
- **Headers**: `Content-Type: application/json`
- **Corpo da Requisição (Body JSON)**:
  - Campos a serem alterados (`esporte`, `marca`, `modelo`, `preco`, `foto`).
- **Códigos de Resposta**:
  - `200 OK`: Acessório atualizado com sucesso.
  - `400 Bad Request`: Dados inválidos ou ID inválido.
  - `404 Not Found`: Acessório não encontrado.
  - `500 Internal Server Error`: Erro interno no servidor.

##### Exemplo de Requisição (Body JSON)
```json
{
  "esporte": "Futebol",
  "marca": "Penalty",
  "modelo": "Luva de Goleiro Delta Pro Edição Ouro",
  "preco": 209.90,
  "foto": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop"
}
```

##### Exemplo de Resposta (200 OK)
```json
{
  "mensagem": "Acessório atualizado com sucesso.",
  "acessorio": {
    "_id": "66f7f3a2c8e9b41a3e5c9105",
    "esporte": "Futebol",
    "marca": "Penalty",
    "modelo": "Luva de Goleiro Delta Pro Edição Ouro",
    "preco": 209.9,
    "foto": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop",
    "createdAt": "2026-09-28T18:00:00.000Z",
    "updatedAt": "2026-09-28T18:15:00.000Z"
  }
}
```

##### Exemplo com cURL
```bash
curl -X PUT http://localhost:3000/api/acessorios/66f7f3a2c8e9b41a3e5c9105 \
  -H "Content-Type: application/json" \
  -d '{"preco":209.90,"modelo":"Luva de Goleiro Delta Pro Edição Ouro"}'
```

---

### 6. Excluir Acessório

#### `DELETE /api/acessorios/:id`

Remove permanentemente um acessório esportivo da base de dados.

- **Método**: `DELETE`
- **Parâmetros de Rota**:
  - `:id` (string): ObjectId do acessório.
- **Códigos de Resposta**:
  - `200 OK`: Acessório excluído com sucesso.
  - `400 Bad Request`: ID fornecido é inválido.
  - `404 Not Found`: Acessório não encontrado ou já excluído.
  - `500 Internal Server Error`: Erro interno no servidor.

##### Exemplo de Resposta (200 OK)
```json
{
  "mensagem": "Acessório excluído com sucesso.",
  "id": "66f7f3a2c8e9b41a3e5c9105"
}
```

##### Exemplo com cURL
```bash
curl -X DELETE http://localhost:3000/api/acessorios/66f7f3a2c8e9b41a3e5c9105
```

---

## Formato Padrão de Erro

Todas as mensagens de erro retornadas pela API seguem uma estrutura JSON padronizada:

```json
{
  "erro": "Descrição clara e amigável da falha.",
  "detalhes": [
    "Informação complementar ou lista de validações que falharam"
  ]
}
```
