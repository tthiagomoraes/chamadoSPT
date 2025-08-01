#!/bin/bash
echo "🔨 Building Frontend..."
npm ci --only=production
npm run build
echo "✅ Frontend build completed!"