# EcoMafola.com — SEO 修复行动计划

**生成日期**: 2026-04-13
**总体 SEO 评分**: 66/100
**问题总数**: 28 个（3 个 Critical · 8 个 High · 14 个 Medium · 3 个 Low）

---

## Phase 1: 关键修复（第 1 周）

### P1-1: 修复重复 meta 标签
**严重度**: CRITICAL
**影响页面**: 所有页面
**预估工时**: 1 小时

问题：SSG 插件注入一组 meta 标签后，客户端 React Router 的 Helmet 又注入了一组相同的。

**行动**:
1. 检查 `vite.config.ts` 中 SSG 插件的 `seoBlock` 注入逻辑
2. 检查 `src/components/seo/PageSeo.tsx` 或 Helmet 组件
3. 方案 A：客户端检测到 `<head>` 已有 meta description/canonical 时跳过注入
4. 方案 B：SSG 注入后移除客户端 Helmet 的对应标签

**文件**: `vite.config.ts`, `src/components/seo/PageSeo.tsx`

---

### P1-2: 产品页加入 sitemap.xml
**严重度**: CRITICAL
**影响页面**: 7 个产品详情页
**预估工时**: 2 小时

当前 sitemap 包含分类页但缺少所有 `/product/*` URL。

**行动**:
1. 在 `scripts/generate-ssg-routes.mjs` 中，将产品页 URL 也输出到 sitemap 模板
2. 或在 Vite 构建的 SSG 阶段，自动将预渲染的产品页 URL 追加到 `dist/sitemap.xml`
3. 每个产品页设置 `priority: 0.7`, `changefreq: weekly`

**文件**: `scripts/generate-ssg-routes.mjs`, `vite.config.ts`

---

### P1-3: 压缩横幅图片 + preload
**严重度**: CRITICAL
**预期影响**: LCP ↓ 2.0s
**预估工时**: 1 小时

`banner-main.jpg` = 1.1MB，无任何优化。

**行动**:
1. 将 `public/images/banner-main.jpg` 转换为 WebP 和 AVIF
2. 在 `<head>` 添加：
   ```html
   <link rel="preload" as="image" href="/images/banner-main.avif" fetchpriority="high" />
   ```
3. 在组件中使用 `<picture>` 标签提供多格式
4. 确保 SSG 输出中也包含 preload 标签

**文件**: `public/images/banner-main.jpg`, `index.html`, 首页组件

---

### P1-4: 修复 Product Schema 描述截断
**严重度**: CRITICAL
**影响**: 7 个产品的描述被截断在句子中间
**预估工时**: 2 小时

**行动**:
1. 检查 `scripts/generate-ssg-routes.mjs` 中 product description 的生成逻辑
2. 检查 `vite.config.ts` 中 `generateRouteHTML()` 对 schema JSON 的处理
3. 确保 `JSON.stringify` 不截断长字符串
4. 验证修复后 7 个产品描述完整输出

**文件**: `scripts/generate-ssg-routes.mjs`, `vite.config.ts`

---

### P1-5: 统一数据源
**严重度**: HIGH
**影响**: AI 信任度、用户信任度
**预估工时**: 2 小时

以下数据源存在冲突：
- `vite.config.ts` SSG 注入的 Product Schema
- `public/admin-content/ssg-routes.json`
- `public/admin-content/product-schemas.json`
- `llms.txt`
- `google-merchant-feed.txt`

**行动**:
1. 确定唯一真相源（应为 Shopify API 返回的数据）
2. 所有文件从同一数据源生成
3. 统一联系邮箱为 `hello@ecomafola.com`（更新 llms.txt）
4. 统一产品价格为 Shopify 实时价格

---

## Phase 2: 高优先级修复（第 2-3 周）

### P2-1: 全页 SSG 渲染
**严重度**: HIGH
**影响**: 索引速度、AI 爬虫可见性、性能
**预估工时**: 8-16 小时

当前 SSG 只注入 `<head>` 元数据，`<body>` 仍为 `<div id="root"></div>`。

**行动**:
1. 方案 A（推荐）：迁移到 Next.js App Router，天然支持 SSG/SSR
2. 方案 B：在 Vite SSG 插件中渲染完整 HTML body
   - 需要在 Node.js 环境中渲染 React 组件为静态 HTML
   - 可使用 `ReactDOMServer.renderToString()` 或 `renderToStaticMarkup()`
3. 方案 C（快速折中）：在 `index.html` 中嵌入静态 HTML 骨架，React hydrate 后替换

**文件**: `vite.config.ts`, `src/App.tsx`

---

### P2-2: 添加 BreadcrumbList Schema
**严重度**: HIGH
**预估工时**: 3 小时

**行动**:
1. 在产品详情页 SSG 模板中注入 BreadcrumbList JSON-LD
2. 在分类页 SSG 模板中注入 BreadcrumbList JSON-LD
3. 格式：
   ```json
   {
     "@context": "https://schema.org",
     "@type": "BreadcrumbList",
     "itemListElement": [
       { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ecomafola.com/" },
       { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://ecomafola.com/products" },
       { "@type": "ListItem", "position": 3, "name": "Coconut Bowls", "item": "https://ecomafola.com/products/coconut-bowls" }
     ]
   }
   ```

---

### P2-3: 修复 Schema 属性
**严重度**: HIGH
**预估工时**: 1 小时

**行动**:
1. 将所有 Product schema 中的 `origin` 替换为 `countryOfOrigin`
2. 将 `craftsmanship` 移入 `additionalProperty`
3. 修正 PNG Beach Bag 的 origin 为 "Papua New Guinea"

---

### P2-4: 添加 CSP 安全头 + 修复 CORS
**严重度**: HIGH
**预估工时**: 1 小时

**行动**:
1. 在 `vercel.json` 或 Vercel 项目设置中添加：
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://cdn.vercel-insights.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://cdn.shopify.com data: https:; connect-src 'self' https://ecomafola-peace.myshopify.com https://*.vercel-insights.com https://*.google-analytics.com;"
           }
         ]
       }
     ]
   }
   ```
2. 移除 HTML 响应中的 `access-control-allow-origin: *`

---

### P2-5: 异步加载 Google Fonts
**严重度**: HIGH
**预期影响**: FCP ↓ 0.3s
**预估工时**: 30 分钟

**行动**:
在 `index.html` 中将：
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" />
```
替换为：
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" media="print" onload="this.media='all'" />
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" />
</noscript>
```

---

### P2-6: 添加 FAQPage + BlogPosting Schema
**严重度**: MEDIUM-HIGH
**预估工时**: 2 小时

**行动**:
1. 在 `/faq` 页面的 Helmet 中添加 FAQPage JSON-LD
2. 在博客文章页面添加 BlogPosting JSON-LD
3. 数据从页面内容或 Supabase 中提取

---

### P2-7: IndexNow 实现
**严重度**: MEDIUM-HIGH
**预估工时**: 1 小时

**行动**:
1. 在 Bing Webmaster Tools 获取验证密钥
2. 创建真实的 `public/BingSiteAuth.xml` 静态文件
3. 在内容发布时调用 IndexNow API

---

## Phase 3: 中期优化（第 4 周）

### P3-1: 添加 Person Schema
**预估工时**: 3 小时
- 为创始人创建 Person schema
- 为关键工匠（如 Afioga Mele, Tavita Ioane, Lani Tuatagaloa）创建 Person schema
- 在 `/our-story` 页面关联

### P3-2: 创建真实 llms-full.txt
**预估工时**: 2 小时
- 包含完整产品描述
- FAQ 问答对
- "Our Story" 完整叙述
- 博客文章摘要

### P3-3: 优化字体权重
**预估工时**: 30 分钟
- Audit CSS 确定实际使用的权重
- Playfair Display: 保留 400, 700
- Inter: 保留 400, 600

### P3-4: 添加 noindex 到私有页面
**预估工时**: 30 分钟
- checkout, account, dashboard 页面添加 `<meta name="robots" content="noindex, nofollow">`

### P3-5: 为每个页面生成独特 OG 图片
**预估工时**: 4 小时
- 创建带页面标题的 branded OG 模板
- 至少覆盖：/our-story, /impact, /contact, /faq, /blog, /products

---

## Phase 4: 长期建设

### P4-1: 建立外部品牌存在
- YouTube 频道（工匠工艺展示、产品故事）
- Reddit 社区参与（r/Handmade, r/EcoFriendly）
- LinkedIn 公司页面
- Wikipedia 条目（需第三方可靠来源）

### P4-2: 迁移到 Next.js/Remix
- 彻底解决 CSR 架构问题
- 原生 SSG/SSR 支持
- 更好的 SEO 和性能

### P4-3: 添加 Review/Rating Schema
- 在产品页集成用户评价
- 添加 aggregateRating 到 Product schema

### P4-4: 监控 Core Web Vitals
- 定期通过 PageSpeed Insights 监控
- 设置 CrUX 数据告警

---

## 预期效果

| 时间线 | 行动 | 预期 SEO 评分变化 |
|--------|------|------------------|
| 当前 | - | 66/100 |
| +1 周 | Phase 1 完成 | 72/100 |
| +3 周 | Phase 1+2 完成 | 78/100 |
| +4 周 | Phase 1+2+3 完成 | 83/100 |
| +3 月 | 全部完成 + 品牌建设 | 88+/100 |
