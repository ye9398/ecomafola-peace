# EcoMafola Peace 网站 v1.0 发布说明

## 📦 发布信息

- **版本号**: v1.0
- **发布日期**: 2026-03-30
- **压缩包大小**: 250MB
- **文件名**: `ecomafola-peace-release-v1.0.zip`

---

## ✨ 核心功能

### 前台功能
- ✅ 品牌主页（Banner、Features、Impact、统计卡片）
- ✅ 产品列表页（按分类展示）
- ✅ 产品详情页（完整的产品规格、环保理念、合作伙伴故事、用户评价）
- ✅ 购物车功能（侧滑式结账）
- ✅ 用户登录/注册
- ✅ 隐私政策页面

### 后台管理（新增）
- ✅ `/admin` 路由 - 管理后台登录页
- ✅ `/admin/products` - 产品详情编辑器
- ✅ 支持编辑 Mission、Environmental Impact、Partnership Model 内容
- ✅ 导出 JSON 配置功能

---

## 🎨 设计特点

### 配色方案
- **海洋蓝**: `text-ocean-blue` - "Where Ocean" 文字
- **热带绿**: `text-tropical-green` (#5B8C3A) - "Meets Craft" 文字
- **沙滩色**: `text-sand-beige` - 副标题和卖点文字
- **自然绿**: `bg-[#5B8C3A]` - 底部模块背景

### UI 风格
- 极简主义设计，移除所有装饰性图标
- 纯文字布局，无 emoji 装饰
- 衬线体 (serif) 统一全站字体
- Specifications 采用表格布局，清晰展示规格参数

---

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- Vite 4.x
- TailwindCSS 3.x
- react-router-dom 6.x
- Shopify Storefront API (@shopify/storefront-api-client 2026-01)

### 后端
- Node.js + Express
- lowdb (本地 JSON 数据库)

---

## 📁 项目结构

```
ecomafola-peace/
├── src/                      # 前端源代码
│   ├── components/           # 可复用组件
│   ├── pages/                # 页面组件
│   ├── hooks/                # 自定义 Hooks
│   ├── lib/                  # 工具库（Shopify SDK、Cart）
│   └── data/                 # 数据配置
├── server/                   # 后端服务器
│   ├── routes/               # API 路由
│   └── db/                   # 数据库文件
├── public/                   # 静态资源
├── docs/                     # 文档
└── scripts/                  # 脚本工具
```

---

## 🚀 快速开始

### 安装依赖
```bash
npm install
cd server && npm install && cd ..
```

### 本地开发
```bash
# 启动前端开发服务器
npm run dev

# 启动后端服务器（新终端窗口）
cd server && node index.js
```

访问地址：http://localhost:4173/

### 生产构建
```bash
npm run build
npm run preview
```

---

## 🔧 配置说明

### Shopify 配置
编辑 `src/lib/shopify.ts`:
```typescript
const config = {
  storeDomain: 'ecomafola-peace.myshopify.com',
  storefrontAccessToken: 'YOUR_API_TOKEN',
  apiVersion: '2026-01'
}
```

### 产品描述映射
编辑 `src/data/productDescriptions.ts`:
- 使用 `URL_TO_SHOPIFY_HANDLE` 映射 URL 到 Shopify handle
- 使用 `SHOPIFY_HANDLE_TO_DESCRIPTION` 映射 handle 到详细描述的 JSON

---

## 📝 管理后台使用说明

### 访问后台
1. 访问 `/admin` 路径
2. 默认账号：`admin` / `admin9396`

### 编辑产品详情
1. 登录后进入产品列表
2. 点击要编辑的产品
3. 修改 Mission、Environmental Impact、Partnership Model 内容
4. 点击"导出 JSON"下载配置文件
5. 手动将导出的 JSON 内容复制到 `src/data/productDescriptions.ts`

### 部署更新
```bash
# 1. 更新 productDescriptions.ts 后
git add .
git commit -m "更新产品详情内容"
git push

# 2. 重新构建并部署
npm run build
# 部署 dist 目录到生产环境
```

---

## ⚠️ 注意事项

### 安全提醒
- 默认密码 `admin9396` 仅用于内部测试，生产环境建议修改
- 当前为单用户模式，如需多用户需集成后端认证系统
- 建议在生产环境配置 HTTPS

### 性能优化
- 图片资源已优化，建议使用 WebP 格式
- 生产环境启用 CDN 加速静态资源
- 开启 Gzip/Brotli 压缩

---

## 📞 技术支持

如有问题，请检查：
1. Shopify API Token 是否正确配置
2. 产品 Handle 映射是否匹配
3. 浏览器控制台是否有错误信息

---

## 📄 许可证

© 2026 EcoMafola Peace. All rights reserved.
