# Deploy como Sites Estáticos

## 🌐 **Opções de Deploy Estático**

### **1️⃣ Vercel (RECOMENDADO para Next.js)**

#### **Frontend:**
1. Acesse [vercel.com](https://vercel.com)
2. **Import Project** do GitHub: `tthiagomoraes/chamadoSPT`
3. **Root Directory:** `frontend`
4. **Framework:** Next.js (detectado automaticamente)
5. **Build Command:** `npm run build`
6. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://sua-api-backend.herokuapp.com/api
   ```

#### **Backend:**
- Deploy no Heroku/Railway/Render separadamente
- Usar apenas para API (SpringBoot)

---

### **2️⃣ Netlify**

#### **Configuração:**
1. Acesse [netlify.com](https://netlify.com)
2. **New site from Git**
3. **Repository:** `tthiagomoraes/chamadoSPT`
4. **Base directory:** `frontend`
5. **Build command:** `npm run build`
6. **Publish directory:** `dist`

#### **netlify.toml:**
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### **3️⃣ GitHub Pages**

#### **Build e Deploy:**
```bash
cd frontend
npm run build
# Arquivos estáticos estarão em ./dist
```

#### **GitHub Actions (Auto-deploy):**
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ master ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

---

## 🗄️ **Opções para Backend (API)**

### **Opção A: Manter SpringBoot**
- **Railway:** Deploy gratuito do JAR
- **Heroku:** Deploy gratuito (com hibernação)
- **Render:** Deploy gratuito

### **Opção B: Serverless (Jamstack)**
- **Supabase:** PostgreSQL + APIs automáticas
- **Firebase:** Firestore + Cloud Functions
- **AWS Amplify:** DynamoDB + Lambda

### **Opção C: Headless CMS**
- **Strapi:** CMS completo com API
- **Directus:** CMS visual com PostgreSQL
- **Contentful:** CMS comercial gratuito

---

## 🚀 **Deploy Rápido - Vercel + Railway**

### **1. Frontend (Vercel):**
```bash
# Já configurado para static export
npm run build  # Gera site estático
```

### **2. Backend (Railway):**
```bash
# Manter SpringBoot como está
# Railway fará deploy automático
```

### **3. Configurar CORS:**
Atualizar URLs no backend para incluir domínio do Vercel:
```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://seu-site.vercel.app",
    "http://localhost:3000"
));
```

---

## 📝 **Vantagens Sites Estáticos:**

### **✅ Prós:**
- **Performance:** Muito mais rápido
- **CDN Global:** Distribuição mundial
- **Gratuito:** Vercel/Netlify são gratuitos
- **HTTPS:** Automático
- **Deploy:** Instantâneo após push

### **⚠️ Contras:**
- **SSR:** Sem Server-Side Rendering
- **API Separada:** Backend precisa ser hospedado separadamente
- **Autenticação:** Mais complexa (só client-side)

---

## 🎯 **Recomendação:**

**Para seu projeto:**
1. **Frontend:** Vercel (Next.js estático)
2. **Backend:** Railway (SpringBoot + PostgreSQL)
3. **CORS:** Configurar para aceitar domínio do Vercel

**Resultado:** Site ultra-rápido + API robusta!