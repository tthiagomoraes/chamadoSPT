# Sistema de Chamados - Deploy com Docker

Este projeto foi containerizado para facilitar o deploy. Aqui estão as instruções para diferentes ambientes.

## 🐳 Executar com Docker Compose (Desenvolvimento)

### Pré-requisitos
- Docker
- Docker Compose

### Passos
1. Clone o repositório
2. Na raiz do projeto, execute:
```bash
docker-compose up --build
```

### Acessos
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Banco**: localhost:5432

### Credenciais padrão
- **Admin**: username: `admin`, password: `admin`

## ☁️ Deploy no Render

### Opção 1: Using render.yaml (Recomendado)
1. Faça fork deste repositório
2. Conecte seu GitHub ao Render
3. Crie um novo "Blueprint" no Render
4. Aponte para o arquivo `render.yaml`
5. Deploy automático será feito

### Opção 2: Deploy Manual

#### Backend
1. Crie novo Web Service no Render
2. Conecte ao repositório
3. Configure:
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/chamados-backend-0.0.1-SNAPSHOT.jar`
   - **Environment**: Java
   - **Root Directory**: `backend`

#### Frontend  
1. Crie novo Web Service no Render
2. Configure:
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Start Command**: `cd frontend && npm start` 
   - **Environment**: Node
   - **Root Directory**: `frontend`

#### Database
1. Crie PostgreSQL database no Render
2. Conecte as variáveis de ambiente

### Variáveis de Ambiente

#### Backend
- `DATABASE_URL`: String de conexão PostgreSQL
- `PORT`: Porta do servidor (10000 para Render)

#### Frontend
- `NEXT_PUBLIC_API_URL`: URL da API backend
- `NODE_ENV`: production

## 🛠️ Desenvolvimento Local

### Com Docker
```bash
docker-compose up --build
```

### Sem Docker
1. **Banco**: PostgreSQL rodando na porta 5432
2. **Backend**: `cd backend && mvn spring-boot:run`
3. **Frontend**: `cd frontend && npm run dev`

## 📁 Estrutura do Projeto
```
chamados/
├── backend/              # SpringBoot + PostgreSQL
│   ├── Dockerfile
│   └── src/
├── frontend/             # Next.js
│   ├── Dockerfile
│   └── app/
├── docker-compose.yml    # Para desenvolvimento
├── render.yaml          # Para deploy Render
└── README-DOCKER.md     # Este arquivo
```

## 🔒 Segurança
- JWT para autenticação
- CORS configurado
- Senhas criptografadas com BCrypt
- Variáveis de ambiente para dados sensíveis

## 📊 Funcionalidades
- ✅ Dashboard com estatísticas
- ✅ CRUD de chamados
- ✅ Sistema de usuários (ADMIN/USER)
- ✅ Relatórios com filtros
- ✅ Autenticação JWT
- ✅ Interface responsiva

## 🚀 Deploy Automático
O projeto está configurado para deploy automático no Render usando o arquivo `render.yaml`. Basta conectar o repositório e o deploy será feito automaticamente.