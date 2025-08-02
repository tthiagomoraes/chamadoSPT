# Script simples para testar se o backend esta ativo

Write-Host "Testando Backend no Render..." -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$BACKEND_URL = "https://chamados-backend.onrender.com"

Write-Host "URL do Backend: $BACKEND_URL" -ForegroundColor White
Write-Host "" -ForegroundColor White

# Teste 1: URL base
Write-Host "1. Testando URL base..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $BACKEND_URL -Method GET -TimeoutSec 30 -ErrorAction Stop
    Write-Host "   Status: $($response.StatusCode) - Backend esta respondendo!" -ForegroundColor Green
} catch {
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 2: Health check (se existir)
Write-Host "2. Testando health check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "$BACKEND_URL/actuator/health" -Method GET -TimeoutSec 30 -ErrorAction Stop
    Write-Host "   Health Status: $($healthResponse.StatusCode)" -ForegroundColor Green
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   Health Data: $($healthData.status)" -ForegroundColor Green
} catch {
    Write-Host "   Health check nao disponivel: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Teste 3: Endpoint de admin
Write-Host "3. Testando endpoint admin..." -ForegroundColor Yellow
try {
    $adminResponse = Invoke-WebRequest -Uri "$BACKEND_URL/api/admin/check-admin" -Method GET -TimeoutSec 30 -ErrorAction Stop
    Write-Host "   Admin endpoint: $($adminResponse.StatusCode) - Funcionando!" -ForegroundColor Green
    $adminData = $adminResponse.Content | ConvertFrom-Json
    Write-Host "   Admin existe: $($adminData.data)" -ForegroundColor White
} catch {
    Write-Host "   Admin endpoint erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 4: Endpoint de login
Write-Host "4. Testando endpoint de login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "admin"
        password = "admin"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "$BACKEND_URL/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -TimeoutSec 30 -ErrorAction Stop
    Write-Host "   Login: $($loginResponse.StatusCode) - Funcionando!" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    if ($loginData.success) {
        Write-Host "   Login bem-sucedido! Token obtido." -ForegroundColor Green
    } else {
        Write-Host "   Login falhou: $($loginData.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   Login erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "" -ForegroundColor White
Write-Host "Resumo dos Testes:" -ForegroundColor Cyan
Write-Host "- Se todos os testes falharam, o backend nao esta ativo" -ForegroundColor White
Write-Host "- Se apenas alguns falharam, pode ser problema de configuracao" -ForegroundColor White
Write-Host "- Verifique o dashboard do Render para mais detalhes" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "Dashboard Render: https://dashboard.render.com/" -ForegroundColor Cyan