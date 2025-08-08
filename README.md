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