#!/bin/bash

# Script para testar o login admin no deploy

echo "🔍 Testando Login Admin no Deploy"
echo "================================="

# URL do backend no Render (ajuste se necessário)
BACKEND_URL="https://chamados-backend.onrender.com"

echo "📡 Testando conexão com o backend..."
curl -s "$BACKEND_URL/api/auth/me" -o /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend está respondendo"
else
    echo "❌ Backend não está respondendo"
    echo "Verifique se o serviço está rodando no Render"
    exit 1
fi

echo ""
echo "🔐 Testando login com admin/admin..."

# Fazer login
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}')

echo "Resposta do servidor:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

# Verificar se o login foi bem-sucedido
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo ""
    echo "✅ LOGIN FUNCIONANDO!"
    echo "As credenciais admin/admin estão funcionando corretamente."
    
    # Extrair token se disponível
    TOKEN=$(echo "$RESPONSE" | jq -r '.data.token' 2>/dev/null)
    if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
        echo "🎫 Token obtido com sucesso"
        
        # Testar endpoint protegido
        echo ""
        echo "🛡️ Testando endpoint protegido..."
        PROTECTED_RESPONSE=$(curl -s "$BACKEND_URL/api/dashboard/stats" \
          -H "Authorization: Bearer $TOKEN")
        
        if echo "$PROTECTED_RESPONSE" | grep -q '"success":true'; then
            echo "✅ Endpoint protegido funcionando!"
        else
            echo "⚠️ Problema com endpoint protegido"
            echo "$PROTECTED_RESPONSE"
        fi
    fi
else
    echo ""
    echo "❌ PROBLEMA COM LOGIN!"
    echo "As credenciais admin/admin não estão funcionando."
    echo ""
    echo "Possíveis causas:"
    echo "1. Usuário admin não foi criado no banco"
    echo "2. Problema de conexão com banco de dados"
    echo "3. Erro na configuração do backend"
    echo ""
    echo "Verifique os logs do backend no Render:"
    echo "https://dashboard.render.com/"
fi

echo ""
echo "📋 Próximos passos se houver problema:"
echo "1. Acesse o dashboard do Render"
echo "2. Vá em 'chamados-backend' > Logs"
echo "3. Procure por 'Usuário admin criado com sucesso!'"
echo "4. Se não encontrar, o DataInitializer não executou"
echo "5. Considere fazer redeploy do backend"