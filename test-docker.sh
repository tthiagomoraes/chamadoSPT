#!/bin/bash

echo "🐳 Testando build Docker do projeto Chamados..."

echo "📦 Fazendo build das imagens..."
docker-compose build --no-cache

echo "🚀 Iniciando os serviços..."
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 30

echo "🔍 Verificando status dos containers..."
docker-compose ps

echo "📋 Logs do backend:"
docker-compose logs backend --tail=20

echo "📋 Logs do frontend:"  
docker-compose logs frontend --tail=20

echo "🌐 Serviços disponíveis:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:8080"
echo "  - Database: localhost:5432"

echo "🔑 Credenciais padrão:"
echo "  - Admin: username=admin, password=admin"

echo "🛑 Para parar os serviços: docker-compose down"