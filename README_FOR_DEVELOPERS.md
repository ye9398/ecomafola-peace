# EcoMafola Peace - 开发者快速启动指南

## 项目简介

EcoMafola Peace 是一个跨境贸易独立站，主营南太平洋岛国（萨摩亚）手工艺品。采用 Vite + React + Tailwind CSS 前端技术栈，通过 Shopify Storefront API 获取商品数据。

## 技术栈

- **前端**: Vite + React + TypeScript + Tailwind CSS
- **后端**: Node.js + Express (可选，用于本地开发)
- **电商集成**: Shopify Storefront API (版本 2026-01)
- **状态管理**: React Hooks
- **路由**: React Router v6

## 快速开始

### 1. 环境要求

```bash
Node.js: >= 16.x
npm: >= 8.x
```

### 2. 安装依赖

```bash
cd ecomafola-peace
npm install
```

### 3. 配置环境变量

复制 `env-config.txt` 中的内容到 `.env` 文件（如果需要本地开发服务器）：

```bash
cp env-config.txt .env
```

**重要**: Shopify API 配置已在代码中硬编码，无需额外配置：
- Store Domain: `ecomafola-peace.myshopify.com`
- API Version: `2026-01`
- SDK: `@shopify/storefront-api-client`

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:4173 查看网站。

### 5. 构建生产版本

```bash
npm run build
npm run preview
```

## 项目结构

```
ecomafola-peace/
├── public/                 # 静态资源
│   ├── images/            # 主页图片（Banner、Features、Impact 等）
│   └── product-images/    # 商品详情页配图
├── src/
│   ├── components/        # 可复用组件
│   │   ├── HeroBanner.tsx       # 首页 Banner
│   │   ├── Features.tsx         # Features 区块
│   │   ├── Products.tsx         # 产品列表
│   │   ├── BrandStory.tsx       # 品牌故事
│   │   ├── Impact.tsx           # 影响力统计
│   │   └── Newsletter.tsx       # 订阅表单
│   ├── pages/             # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── ProductListPage.tsx
│   │   └── ProductDetailPage.tsx
│   ├── lib/               # 工具库
│   │   └── shopify.ts     # Shopify API 客户端
│   ├── App.tsx            # 主应用和路由配置
│   └── main.tsx           # 入口文件
├── package.json           # 项目依赖和脚本
├── tailwind.config.js     # Tailwind CSS 配置
├── vite.config.ts         # Vite 配置
└── tsconfig.json          # TypeScript 配置
```

## 核心功能

### 路由规范

- **商品详情**: `/product/:id` (单数)
- **产品分类**: `/products/:category` (复数)

**注意**: 务必区分单复数，避免路由冲突。

### Handle 双层映射机制

项目使用两层 handle 映射来增强灵活性：

1. **URL_TO_SHOPIFY_HANDLE**: 将 URL 参数映射到 Shopify handle
2. **SHOPIFY_HANDLE_TO_DESCRIPTION**: 将 Shopify handle 映射到本地描述内容

这样可以实现：
- URL 友好（如 `/product/coconutbowl`）
- 本地化描述内容
- 灵活的商品管理

### 商品详情页模块

已实现的模块：
- 商品主图 + 缩略图切换
- 价格 + 加入购物车
- Our Mission（工匠赋能理念）
- Environmental Impact（环保影响）
- Partnership Model（合作模式）
- Specifications（规格参数）
- Quality Guarantee（质量保证）
- FAQ（常见问题）
- Reviews（用户评价）
- Product Story（产品故事）

## 设计原则

1. **极简主义**: 纯色背景，移除装饰性纹理和图标
2. **Empowerment + Partnership**: 强调与工匠的合作而非慈善援助
3. **字体统一**: 全页面使用衬线体 (serif)
4. **响应式设计**: 适配移动端和桌面端

## 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# TypeScript 类型检查
npm run check

# 清理构建产物
rm -rf dist/
```

## 已知问题和注意事项

1. **路由冲突**: 确保商品详情页使用 `/product/:id`，分类页使用 `/products/:category`
2. **图片资源**: 所有图片位于 `public/images/` 目录，构建时会自动复制到 dist
3. **Shopify API**: 当前使用 GraphQL Storefront API，需确保网络可访问 Shopify 服务

## 扩展开发建议

### 新增商品

1. 在 Shopify 后台添加商品
2. 更新 `src/lib/shopify.ts` 中的查询逻辑（如需自定义字段）
3. 如有需要，在 `src/pages/ProductDetailPage.tsx` 中添加新的展示模块

### 新增页面

1. 在 `src/pages/` 创建新页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 确保遵循现有的路由命名规范

### 修改样式

1. 在对应组件中使用 Tailwind CSS 类名
2. 全局样式变量定义在 `src/index.css` 中
3. 颜色主题：ocean-blue, tropical-green, sand-beige, white

## 技术支持

- 项目文档：`README.md`, `PROJECT_STATUS.md`, `SHOPIFY_SETUP.md`
- 部署说明：`DEPLOYMENT_SUMMARY.md`
- 商品内容更新：`PRODUCT_CONTENT_UPDATE.md`

---

**最后更新**: 2026-03-29
