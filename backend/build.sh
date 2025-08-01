#!/bin/bash
echo "🔨 Building Backend..."
mvn clean package -DskipTests
echo "✅ Backend build completed!"