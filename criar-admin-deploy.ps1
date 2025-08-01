# Script PowerShell para criar usuário admin no deploy

Write-Host "Script para Criar Usuario Admin no Deploy" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# URL do backend no Render
$BACKEND_URL = "https://chamados-backend.onrender.com"

Write-Host "Verificando se o backend esta respondendo..." -ForegroundColor Yellow

try {
    $healthCheck = Invoke-WebRequest -Uri "$BACKEND_URL/api/admin/check-admin" -Method GET -ErrorAction Stop
    Write-Host "Backend esta respondendo!" -ForegroundColor Green
    Write-Host "Status: $($healthCheck.StatusCode)" -ForegroundColor Green
    
    # Converter resposta para JSON
    $response = $healthCheck.Content | ConvertFrom-Json
    
    if ($response.success -and $response.data -eq $true) {
        Write-Host "Usuario admin ja existe!" -ForegroundColor Green
        Write-Host "Voce pode fazer login com:" -ForegroundColor Cyan
        Write-Host "Username: admin" -ForegroundColor White
        Write-Host "Password: admin" -ForegroundColor White
    } else {
        Write-Host "Usuario admin nao existe. Criando..." -ForegroundColor Yellow
        
        # Criar usuário admin
        try {
            $createResponse = Invoke-WebRequest -Uri "$BACKEND_URL/api/admin/create-admin" -Method POST -ErrorAction Stop
            $createResult = $createResponse.Content | ConvertFrom-Json
            
            if ($createResult.success) {
                Write-Host "Usuario admin criado com sucesso!" -ForegroundColor Green
                Write-Host "Username: admin" -ForegroundColor White
                Write-Host "Password: admin" -ForegroundColor White
            } else {
                Write-Host "Erro ao criar usuario admin: $($createResult.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "Erro ao criar usuario admin: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "Backend nao esta respondendo ou ha erro de conexao" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "" -ForegroundColor White
    Write-Host "Possiveis solucoes:" -ForegroundColor Yellow
    Write-Host "1. Verifique se o servico esta rodando no Render" -ForegroundColor White
    Write-Host "2. Acesse https://dashboard.render.com/ e va em 'chamados-backend'" -ForegroundColor White
    Write-Host "3. Se o servico estiver 'Failed', clique em 'Deploy Latest Commit'" -ForegroundColor White
    Write-Host "4. Aguarde alguns minutos para o servico inicializar" -ForegroundColor White
    exit 1
}

Write-Host "" -ForegroundColor White
Write-Host "Testando login com as credenciais admin..." -ForegroundColor Yellow

try {
    $loginBody = @{
        username = "admin"
        password = "admin"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "$BACKEND_URL/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginResult.success) {
        Write-Host "LOGIN FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
        Write-Host "Token obtido com sucesso" -ForegroundColor Green
        
        # Testar endpoint protegido
        $token = $loginResult.data.token
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        try {
            $dashboardResponse = Invoke-WebRequest -Uri "$BACKEND_URL/api/dashboard/stats" -Headers $headers -ErrorAction Stop
            $dashboardResult = $dashboardResponse.Content | ConvertFrom-Json
            
            if ($dashboardResult.success) {
                Write-Host "Endpoints protegidos funcionando!" -ForegroundColor Green
            } else {
                Write-Host "Problema com endpoints protegidos" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Erro ao testar endpoint protegido: $($_.Exception.Message)" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "Problema no login: $($loginResult.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Erro no teste de login: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "" -ForegroundColor White
Write-Host "Resumo:" -ForegroundColor Cyan
Write-Host "- URL do Backend: $BACKEND_URL" -ForegroundColor White
Write-Host "- Username: admin" -ForegroundColor White
Write-Host "- Password: admin" -ForegroundColor White
Write-Host "- Frontend: https://chamados-frontend.onrender.com" -ForegroundColor White

Write-Host "" -ForegroundColor White
Write-Host "Se ainda houver problemas:" -ForegroundColor Yellow
Write-Host "1. Acesse o dashboard do Render" -ForegroundColor White
Write-Host "2. Verifique os logs do backend" -ForegroundColor White
Write-Host "3. Procure por erros de conexão com banco" -ForegroundColor White
Write-Host "4. Considere fazer redeploy se necessário" -ForegroundColor White