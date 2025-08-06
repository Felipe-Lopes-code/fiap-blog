# Blog API

Este é um projeto de API RESTful para um sistema de blog, desenvolvido com Node.js, Express e PostgreSQL, utilizando arquitetura em containers com Docker e Docker Compose.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize (ORM)
- Docker & Docker Compose
- Kong (API Gateway)
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
- GET /posts - Listar posts
- POST /posts - Criar novo post
- GET /posts/:id - Obter post específico
- PUT /posts/:id - Atualizar post
- DELETE /posts/:id - Deletar post

## 🔒 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, é necessário:
1. Criar uma conta através do endpoint `/users`
2. Fazer login através do endpoint `/users/login`
3. Usar o token retornado no header `Authorization` das requisições

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