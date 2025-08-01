# Deploy Manual no Render

Se o `render.yaml` não funcionar, use estas configurações para deploy manual:

## 1. Criar Database
1. No dashboard do Render, clique em "New +"
2. Selecione "PostgreSQL"
3. Configure:
   - **Name**: `chamados-postgres`
   - **Plan**: Free
4. Anote a **Internal Database URL** que será gerada

## 2. Deploy Backend
1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte ao repositório GitHub: `tthiagomoraes/chamadoSPT`
4. Configure:
   - **Name**: `chamados-backend`
   - **Environment**: `Java`
   - **Region**: `Oregon (US West)`
   - **Branch**: `master`
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/chamados-backend-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free

### Environment Variables (Backend):
```
DATABASE_URL=postgresql://user:password@host:5432/database_name
PORT=10000
```

## 3. Deploy Frontend
1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service" 
3. Conecte ao mesmo repositório GitHub
4. Configure:
   - **Name**: `chamados-frontend`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)`
   - **Branch**: `master`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Environment Variables (Frontend):
```
NEXT_PUBLIC_API_URL=https://chamados-backend.onrender.com/api
NODE_ENV=production
```

## 4. Configurar URLs
Após o deploy, atualize as URLs do CORS no backend:
- Vá em Settings do backend service
- Adicione a URL do frontend nas variáveis de ambiente se necessário

## 5. Teste
1. Acesse a URL do frontend
2. Faça login com: `admin` / `admin`
3. Teste todas as funcionalidades

## 📝 Comandos de Build Alternativos

### Backend (se der erro):
```bash
./mvnw clean package -DskipTests
# ou
mvn clean compile exec:java -Dexec.mainClass="com.petrobras.chamados.ChamadosBackendApplication"
```

### Frontend (se der erro):
```bash
npm install --production=false && npm run build
# ou  
yarn install && yarn build
```