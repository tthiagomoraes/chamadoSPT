#!/bin/bash

echo "Building Chamados Backend..."
cd backend
mvn clean package -DskipTests
cd ..

echo "Building Chamados Frontend..."
cd frontend  
npm ci --only=production
npm run build
cd ..

echo "Build completed successfully!"