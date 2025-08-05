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
git clone https://github.com/Felipe-Lopes-code/fiap_fullStackDevelopment_techChallenge_fase2.git
cd fiap_fullStackDevelopment_techChallenge_fase2
```

2. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
POSTGRES_DB=seu_banco
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
DB_HOST=db
DB_PORT=5432
DB_NAME=seu_banco
```

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
│   │   ├── config/        # Configurações do projeto
│   │   ├── controllers/   # Controladores da aplicação
│   │   ├── doc/          # Documentação Swagger
│   │   ├── middlewares/  # Middlewares da aplicação
│   │   ├── model/        # Modelos do banco de dados
│   │   ├── routes/       # Rotas da aplicação
│   │   └── services/     # Lógica de negócios
│   └── tests/            # Testes da aplicação
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

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.