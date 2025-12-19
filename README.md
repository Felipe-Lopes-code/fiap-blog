# Blog API

Este é um projeto de API RESTful para um sistema de blog, desenvolvido com Node.js, Express e PostgreSQL, utilizando arquitetura em containers com Docker e Docker Compose.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize (ORM)
- Docker & Docker Compose
- Kong (API Gateway)
  - Rate Limiting (limitação de requisições)
  - CORS (Cross-Origin Resource Sharing)
  - Autenticação via API Key
- JWT para autenticação
- Swagger para documentação
- BCrypt para criptografia

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js (para desenvolvimento local)
- Git

## 🔧 Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/Felipe-Lopes-code/fiap-blog.git
cd fiap-blog
```

2. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
# Configurações do PostgreSQL
POSTGRES_DB=tech_challenge
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Configurações da Aplicação
DB_HOST=db
DB_PORT=5432
DB_NAME=tech_challenge
DB_USER=postgres
DB_PASSWORD=postgres

# Configurações do PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin

# JWT Secret
JWT_SECRET=274003c4cfe07312ff4be753a7b0901886a8d69f3e588c438d
```

## 🐳 Como Executar

```bash
# Subir toda a infraestrutura
docker-compose up -d

# Verificar status dos containers
docker-compose ps

# Ver logs dos serviços
docker-compose logs -f
```

## 📡 **Kong API Gateway - Configurado e Funcionando**

### **Endpoints Disponíveis:**

#### **📋 Documentação (Acesso Livre)**
- **Swagger UI**: `http://localhost:8000/api-docs`
- **Acesso Direto**: `http://localhost:3000/api-docs`

#### **🔐 APIs Protegidas (Requer API Key)**
- **Usuários**: `http://localhost:8000/api/users`
- **Posts**: `http://localhost:8000/api/posts`

### **🔑 Autenticação**
Para acessar as APIs protegidas, use a API Key configurada:
- **Chave**: `admin-key-123456`
- **Header**: `apikey: admin-key-123456`

### **📝 Exemplos de Uso**

#### **Via cURL:**
```bash
# Acessar documentação (sem autenticação)
curl http://localhost:8000/api-docs

# Listar usuários (com autenticação)
curl -H "apikey: admin-key-123456" http://localhost:8000/api/users

# Listar posts (com autenticação)
curl -H "apikey: admin-key-123456" http://localhost:8000/api/posts

# Criar usuário (com autenticação)
curl -X POST http://localhost:8000/api/users \
  -H "apikey: admin-key-123456" \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@email.com", "password": "123456"}'
```

#### **Via PowerShell:**
```powershell
# Acessar documentação
Invoke-WebRequest -Uri "http://localhost:8000/api-docs" -UseBasicParsing

# Listar usuários (com autenticação)  
Invoke-WebRequest -Uri "http://localhost:8000/api/users" -Headers @{"apikey"="admin-key-123456"} -UseBasicParsing
```

### **🛡️ Recursos de Segurança Configurados:**
- ✅ **Rate Limiting**: 100 req/min, 1000 req/hora
- ✅ **CORS**: Configurado para aceitar requisições de qualquer origem
- ✅ **API Key Authentication**: Autenticação obrigatória para endpoints sensíveis
- ✅ **Request/Response Headers**: Headers de segurança configurados

### **📊 Monitoramento**
- **Kong Admin API**: `http://localhost:8001`
- **Rate Limiting Headers**: Incluídos automaticamente nas respostas
- **Request IDs**: Para rastreamento de requisições

## 🔗 Serviços Disponíveis

- **API Principal**: `http://localhost:3000`
- **API via Kong**: `http://localhost:8000` 
- **Documentação Swagger**: `http://localhost:8000/api-docs`
- **PgAdmin**: `http://localhost:5050`
- **Kong Admin**: `http://localhost:8001`

# JWT Configuration (OBRIGATÓRIO para autenticação)
JWT_SECRET=b429262429f595579db7f3906c600de6060e069d6ab13287ff5af7a4c6cd11c0b0dcd8894111745359cdb86d3302ea14981c70e5892709c8d93b6c7f98268bcf
```

> **Importante**: Substitua o valor de `JWT_SECRET` por uma chave secreta forte. Você pode gerar uma usando:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

3. Inicie os containers:
```bash
docker-compose up -d
```

## 🏃‍♂️ Executando o Projeto

### Com Docker (Recomendado)
```bash
docker-compose up -d
```

### Localmente (para desenvolvimento)
```bash
cd app
npm install
npm run dev
```

## 🧪 Testes

O projeto utiliza Jest para testes unitários e de integração.

### Executando os Testes
```bash
cd app
npm test                 # Executa todos os testes
npm run test:unit       # Executa apenas testes unitários
npm run test:coverage   # Executa testes com relatório de cobertura
```

### Estrutura dos Testes
```
app/src/tests/
├── setup.js                          # Configuração global dos testes
├── testServer.js                     # Servidor de teste
├── integration/                      # Testes de integração
│   └── posts.test.js                 # Testes das rotas de posts
├── unit/                            # Testes unitários
│   ├── middlewares/                 # Testes de middlewares
│   │   └── authMiddleware.test.js   # Testes de autenticação
│   └── services/                    # Testes de serviços
│       └── post-services.test.js    # Testes do serviço de posts
```

### Cobertura de Testes

#### Testes Unitários de Autenticação (authMiddleware.test.js)
- ✅ Login com credenciais corretas
- ✅ Tratamento de usuário não encontrado
- ✅ Validação de senha incorreta
- ✅ Autenticação de token JWT válido
- ✅ Tratamento de token ausente
- ✅ Validação de token inválido
- ✅ Tratamento de usuário inexistente após validação do token

#### Testes Unitários de Posts (post-services.test.js)
- ✅ Busca de posts por termo
- ✅ Criação de post com dados válidos
- ✅ Validação de campos obrigatórios na criação de posts

### Mocks e Fixtures
Os testes utilizam mocks para:
- Modelo de Usuário (User)
  - Simulação de busca por email e ID
  - Validação de senha com bcrypt
- Modelo de Post
  - Operações CRUD
  - Busca por termo
- Autenticação JWT
  - Geração e verificação de tokens
```
app/src/tests/
├── setup.js              # Configuração global dos testes
├── testServer.js         # Servidor de teste
├── integration/          # Testes de integração
│   └── posts.test.js     # Testes das rotas de posts
├── unit/                 # Testes unitários
│   └── middlewares/      # Testes de middlewares
└── mocks/               # Mocks para testes
```

### Escrevendo Testes

1. **Testes Unitários** (exemplo de middleware):
```javascript
const { authenticate } = require('../../middlewares/authMiddleware');

describe('Auth Middleware', () => {
  it('should validate JWT token', async () => {
    // seu teste aqui
  });
});
```

2. **Testes de Integração** (exemplo de rota):
```javascript
const request = require('supertest');
const app = require('../_testServer');

describe('Post Routes', () => {
  it('should create a new post', async () => {
    // seu teste aqui
  });
});
```

## 🚀 Deploy

### Deploy para Docker Hub

1. **Login no Docker Hub**:
```bash
docker login
```

2. **Build da Imagem**:
```bash
docker build -t seu-usuario/fiap-blog:latest ./app
```

3. **Push para Docker Hub**:
```bash
docker push seu-usuario/fiap-blog:latest
```

### Deploy para Fly.io

1. **Instalar Flyctl**:
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login no Fly.io**:
```bash
fly auth login
```

3. **Configurar Segredos**:
```bash
fly secrets set JWT_SECRET=seu-segredo-aqui
fly secrets set DB_PASSWORD=sua-senha-aqui
```

4. **Deploy**:
```bash
fly deploy
```

### CI/CD com GitHub Actions

O projeto usa GitHub Actions para CI/CD automático. Para configurar:

1. **Adicionar Segredos no GitHub**:
   - `FLY_API_TOKEN`: Token de API do Fly.io
   - `FLY_APP_NAME`: Nome do seu app no Fly.io

2. **Pipeline de CI/CD**:
   - ✅ Checkout do código
   - ✅ Setup Node.js
   - ✅ Instalação de dependências
   - ✅ Execução de testes
   - ✅ Build da imagem Docker
   - ✅ Deploy para Fly.io

## 📚 Estrutura do Projeto

```
.
├── app/                    # Código fonte da aplicação
│   ├── src/
│   │   ├── controllers/   # Controladores da aplicação
│   │   ├── doc/          # Documentação Swagger
│   │   ├── middlewares/  # Middlewares da aplicação
│   │   ├── model/        # Modelos do banco de dados
│   │   ├── routes/       # Rotas da aplicação
│   │   ├── services/     # Lógica de negócios
│   │   └── tests/        # Testes da aplicação
│   │       ├── integration/  # Testes de integração
│   │       ├── mocks/       # Mocks para testes
│   │       └── unit/        # Testes unitários
├── docker-compose.yml     # Configuração do Docker Compose
└── kong/                  # Configuração do API Gateway
```

## 📝 Documentação da API

A documentação da API está disponível através do Swagger UI após iniciar a aplicação:
```
http://localhost:3000/api-docs
```

## 🛣️ Principais Endpoints

### Usuários
- POST /users - Criar novo usuário
- POST /users/login - Login de usuário
- GET /users - Listar usuários

### Posts

> ⚠️ **Nota**: Os endpoints marcados com 🔒 requerem autenticação (Bearer Token)

#### Listar Posts
- 🔒 `GET /posts` - Lista todos os posts disponíveis
  ```bash
  curl -H "Authorization: Bearer seu-token" http://localhost:3000/posts
  ```

#### Criar Post
- 🔒 `POST /posts` - Criar novo post (apenas para professores)
  ```json
  {
    "title": "Título do Post",
    "content": "Conteúdo do post"
  }
  ```
  > **Nota**: O autor será automaticamente definido com base no usuário autenticado.

#### Obter Post Específico
- `GET /posts/:id` - Obter post por ID
  ```bash
  curl http://localhost:3000/posts/1
  ```

#### Buscar Posts por Autor
- `GET /posts/author/:authorId` - Lista posts de um autor
  ```bash
  curl http://localhost:3000/posts/author/1
  ```

#### Pesquisar Posts
- `GET /posts/search?q=termo` - Pesquisa posts por título ou conteúdo
  ```http
  GET http://localhost:8000/api/posts/search?q=tecnologia
  Header: apikey: BLOG-API-KEY-2025
  ```

  > **IMPORTANTE**: A rota de busca deve ser chamada exatamente como mostrado acima. 
  > A ordem é importante: primeiro `/posts`, depois `/search`, e por fim o parâmetro `?q=termo`.

  **Exemplos de busca:**
  - ✅ Correto: `http://localhost:8000/api/posts/search?q=tecnologia`
  - ❌ Incorreto: `http://localhost:8000/api/posts?search=tecnologia`
  - ❌ Incorreto: `http://localhost:8000/api/posts/?search?q=tecnologia`

  **Resposta de Sucesso:**
  ```json
  {
    "results": [
      {
        "id": 1,
        "title": "Tecnologia na Educação",
        "content": "...",
        "author": "Nome do Autor",
        "createdAt": "2025-08-08T..."
      }
    ],
    "count": 1,
    "searchTerm": "tecnologia"
  }
  ```

  **Possíveis Erros:**
  - 400: Termo de busca não fornecido
  - 404: Nenhum resultado encontrado
  - 500: Erro interno do servidor

#### Atualizar Post
- 🔒 `PUT /posts/:id` - Atualizar post existente
  ```json
  {
    "title": "Título Atualizado",
    "content": "Conteúdo atualizado",
    "available": true
  }
  ```

#### Deletar Post
- 🔒 `DELETE /posts/:id` - Remover post
  ```bash
  curl -X DELETE -H "Authorization: Bearer seu-token" http://localhost:3000/posts/1
  ```

## 🔒 Autenticação

A API utiliza dois níveis de autenticação:
1. API Key (Kong Gateway)
2. JWT (JSON Web Tokens)

### API Key Authentication

Todas as requisições através do Kong Gateway (porta 8000) precisam incluir uma API Key:

```http
apikey: BLOG-API-KEY-2025
```

### JWT Authentication

Para endpoints protegidos, além da API Key, você precisa do token JWT. Siga estes passos:

### 1. Criar uma conta (caso ainda não tenha)
```http
POST /users
Content-Type: application/json

{
    "name": "Seu Nome",
    "email": "seu-email@exemplo.com",
    "password": "sua-senha",
    "role": "user"
}
```

### 2. Fazer login para obter o token
```http
POST /users/login
Content-Type: application/json

{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
}
```

Você receberá uma resposta como:
```json
{
    "token": "seu-token-jwt-aqui"
}
```

### 3. Usar o token nas requisições protegidas

#### No Insomnia:
1. Na requisição desejada, vá até a aba "Auth"
2. Selecione "Bearer Token"
3. Cole o token recebido no campo "Token"

OU

1. Vá até a aba "Headers"
2. Adicione um header:
   - Nome: `Authorization`
   - Valor: `Bearer seu-token-jwt-aqui`

### Configurando o Insomnia

#### 1. Configuração Base
1. Abra o Insomnia
2. Crie um novo Environment (Ambiente) com as variáveis base:
   ```json
   {
     "baseUrl": "http://localhost:8000/api",
     "apiKey": "BLOG-API-KEY-2025"
   }
   ```

#### 2. Configuração dos Headers
Para cada requisição, você precisará configurar:

1. Na aba "Headers":
   - Nome: `apikey`
   - Valor: `{% raw %}{{ _.apiKey }}{% endraw %}`

2. Para endpoints protegidos, adicione também:
   - Nome: `Authorization`
   - Valor: `Bearer seu-jwt-token`

#### 3. Exemplo de Fluxo Completo

1. **Login (Obter JWT)**:
   - Método: `POST`
   - URL: `{% raw %}{{ _.baseUrl }}{% endraw %}/users/login`
   - Header: `apikey: {% raw %}{{ _.apiKey }}{% endraw %}`
   - Body (JSON):
     ```json
     {
         "email": "seu-email@exemplo.com",
         "password": "sua-senha"
     }
     ```

2. **Criar Post (Usando JWT)**:
   - Método: `POST`
   - URL: `{% raw %}{{ _.baseUrl }}{% endraw %}/posts`
   - Headers:
     ```
     apikey: {% raw %}{{ _.apiKey }}{% endraw %}
     Authorization: Bearer seu-jwt-token
     ```
   - Body (JSON):
     ```json
     {
         "title": "Título do Post",
         "content": "Conteúdo do post"
     }
     ```

#### Via cURL:
```bash
curl -X GET \
  http://localhost:8000/api/posts \
  -H 'apikey: BLOG-API-KEY-2025' \
  -H 'Authorization: Bearer seu-jwt-token'
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## � Troubleshooting

### Problemas Comuns

1. **Erro de conexão com o banco de dados**
   - Verifique se as variáveis de ambiente no `.env` estão corretas
   - Certifique-se de que o container do PostgreSQL está rodando
   - Aguarde alguns segundos após iniciar os containers para o banco estar pronto

2. **Erro na autenticação**
   - Verifique se a variável `JWT_SECRET` está definida no `.env`
   - Certifique-se de que o usuário existe no banco de dados
   - Verifique se as credenciais (email e senha) estão corretas

3. **Container não inicia**
   - Verifique os logs usando `docker-compose logs -f`
   - Certifique-se de que as portas necessárias estão disponíveis
   - Tente reconstruir os containers com `docker-compose up -d --build`

4. **Erro 500 na busca de posts**
   - Certifique-se de usar o parâmetro `q` na URL: `/posts/search?q=termo`
   - Verifique se o termo de busca está codificado corretamente para URL
   - Se o erro persistir, verifique os logs do servidor usando `docker-compose logs app`
   
   Exemplo de busca correta:
   ```http
   GET http://localhost:8000/api/posts/search?q=tecnologia
   ```

4. **Erro "secretOrPrivateKey must have a value"**
   - Certifique-se de que a variável JWT_SECRET está definida no arquivo `.env`
   - Verifique se o arquivo `.env` está na raiz do projeto
   - Após alterar o `.env`, reinicie os containers:
     ```bash
     docker-compose down
     docker-compose up -d --build
     ```
   - Para verificar se a variável está sendo carregada:
     ```bash
     docker-compose exec app sh -c 'echo $JWT_SECRET'
     ```

## �📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.