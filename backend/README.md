# Backend - Sistema de Gerenciamento de Chamados

Este é o backend do sistema de gerenciamento de chamados, desenvolvido em Spring Boot com Java 21 e PostgreSQL.

## 🚀 Tecnologias Utilizadas

- **Java 21**: Linguagem de programação
- **Spring Boot 3.2.0**: Framework principal
- **Spring Data JPA**: Para persistência de dados
- **PostgreSQL**: Banco de dados
- **Maven**: Gerenciador de dependências

## 📋 Pré-requisitos

- Java 21 instalado
- Maven 3.6+ instalado
- PostgreSQL 12+ instalado e rodando
- Banco de dados `chamdospt` criado

## ⚙️ Configuração do Banco de Dados

1. **Criar o banco de dados:**
   ```sql
   CREATE DATABASE chamdospt;
   ```

2. **Configurar credenciais no `application.yml`:**
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/chamdospt
       username: postgres
       password: root
   ```

## 🔧 Como Executar

1. **Clone o repositório e navegue até a pasta backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   mvn clean install
   ```

3. **Execute a aplicação:**
   ```bash
   mvn spring-boot:run
   ```

4. **A aplicação estará disponível em:**
   ```
   http://localhost:8080
   ```

## 📡 Endpoints da API

### Chamados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/chamados` | Listar todos os chamados |
| GET | `/api/chamados/{id}` | Buscar chamado por ID |
| POST | `/api/chamados` | Criar novo chamado |
| PUT | `/api/chamados/{id}` | Atualizar chamado |
| DELETE | `/api/chamados/{id}` | Excluir chamado |
| GET | `/api/chamados/dashboard/stats` | Estatísticas do dashboard |
| GET | `/api/chamados/filter` | Filtrar chamados |

### Exemplos de Requisições

#### Criar Chamado
```json
POST /api/chamados
{
  "numero": "CH001",
  "prioridade": "ALTA",
  "abertoPor": "João Silva",
  "responsavel": "Maria Santos",
  "descricaoResumida": "Problema no sistema de login"
}
```

#### Resposta Padrão
```json
{
  "data": {
    "id": 1,
    "numero": "CH001",
    "prioridade": "ALTA",
    "abertoPor": "João Silva",
    "responsavel": "Maria Santos",
    "dataAbertura": "2024-01-15T10:30:00",
    "ultimaAtualizacao": "2024-01-15T10:30:00",
    "descricaoResumida": "Problema no sistema de login"
  },
  "success": true,
  "message": "Chamado criado com sucesso"
}
```

## 🏗️ Estrutura do Projeto

```
src/main/java/com/petrobras/chamados/
├── config/           # Configurações (CORS, etc.)
├── controller/       # Controllers REST
├── dto/             # Data Transfer Objects
├── entity/          # Entidades JPA
├── exception/       # Exceções customizadas
├── repository/      # Repositórios JPA
├── service/         # Lógica de negócio
└── ChamadosBackendApplication.java
```

## 🔧 Configurações

### CORS
O CORS está configurado para aceitar requisições do frontend em `http://localhost:3000`.

### Banco de Dados
- **Hibernate DDL**: `update` (cria/atualiza tabelas automaticamente)
- **Show SQL**: `true` (mostra queries no console)

### Logging
- Level DEBUG habilitado para `com.petrobras.chamados`
- Level DEBUG habilitado para `org.springframework.web`

## 🧪 Validações

### Chamado
- **numero**: Obrigatório e único
- **prioridade**: Obrigatório (BAIXA, MODERADA, ALTA)
- **abertoPor**: Obrigatório
- **responsavel**: Obrigatório
- **descricaoResumida**: Obrigatório

## 🚨 Tratamento de Erros

A API retorna respostas padronizadas para diferentes tipos de erro:

- **404**: Recurso não encontrado
- **409**: Conflito de dados (ex: número duplicado)
- **400**: Erro de validação
- **500**: Erro interno do servidor

## 🔍 Filtros Disponíveis

O endpoint `/api/chamados/filter` aceita os seguintes parâmetros:

- `prioridade`: Filtrar por prioridade (BAIXA, MODERADA, ALTA)
- `responsavel`: Buscar por nome do responsável (busca parcial)
- `abertoPor`: Buscar por nome de quem abriu (busca parcial)
- `dataInicio`: Data de início (formato: YYYY-MM-DD)
- `dataFim`: Data de fim (formato: YYYY-MM-DD)

## 🔗 Integração com Frontend

Este backend foi desenvolvido para trabalhar integralmente com o frontend React localizado na pasta `../frontend`. As APIs seguem exatamente o contrato esperado pelo frontend, mantendo compatibilidade total.

## 📊 Dashboard

O endpoint `/api/chamados/dashboard/stats` retorna estatísticas completas:
- Total de chamados
- Chamados em aberto (estimativa)
- Contagem por prioridade
- Distribuição percentual por prioridade
- Lista dos 5 chamados mais recentes