#!/bin/bash

echo "🔧 修复 EcoMafola Peace 项目依赖..."

# 1. 安装 Shopify Storefront API SDK
echo "📦 安装 Shopify Storefront API SDK..."
npm install @shopify/storefront-api-client

# 2. 更新 vite.config.ts 端口配置
echo "⚙️ 更新 Vite 配置端口为 4173..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173
  }
})
EOF

# 3. 创建 .env 文件（如果不存在）
if [ ! -f .env ]; then
  echo "📝 创建 .env 文件..."
  cat > .env << 'EOF'
# Shopify Storefront API 配置
VITE_SHOPIFY_STORE_DOMAIN=ecomafola-peace.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=11c0b58bfdee65f96fbbd918d9aeeaa7
EOF
fi

echo "✅ 依赖修复完成！"
echo "🚀 现在可以运行: npm run dev"
echo "🌐 访问: http://localhost:4173"