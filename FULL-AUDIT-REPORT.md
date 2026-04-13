# EcoMafola.com — 深度 SEO 审计报告

**审计日期**: 2026-04-13
**审计范围**: 全站 18+ 页面（robots.txt, sitemap.xml, 首页, 产品页, 品牌页, 博客, FAQ, llms.txt）
**审计维度**: 技术 SEO · 内容质量 · 结构化数据 · 性能 · AI 搜索就绪度

---

## 综合 SEO 健康评分: 66/100

| 类别 | 权重 | 得分 | 状态 |
|------|------|------|------|
| 技术 SEO | 22% | 68/100 | ⚠️ 需修复 |
| 内容质量 | 23% | 64/100 | ⚠️ 需优化 |
| 页面 SEO | 20% | 75/100 | ✅ 良好 |
| 结构化数据 | 10% | 52/100 | ❌ 需大修 |
| 性能 (CWV) | 10% | 40/100 | ❌ 严重 |
| AI 搜索就绪度 | 10% | 72/100 | ⚠️ 有潜力 |
| 图片优化 | 5% | 30/100 | ❌ 严重 |

---

## Top 5 关键问题（立即修复）

### 1. 全站 CSR 架构 — 零 HTML 内容 (CRITICAL)

所有页面 `<body>` 仅返回 `<div id="root"></div>`，内容完全依赖 JavaScript 渲染。

**影响**:
- Googlebot 需要二次渲染才能看到内容（延迟索引）
- AI 爬虫（ChatGPT/Perplexity/Claude）无法提取正文
- 社交媒体预览（Slack/Discord）显示空白
- LCP 预估 4.5-6.0s（移动端）

**修复**: 实施 SSG 全页渲染（不仅是 `<head>` 元数据），或迁移到 Next.js/Remix。

---

### 2. 每页重复的 meta description 和 canonical 标签 (CRITICAL)

SSG 注入一组 + 客户端 Helmet 又注入一组相同的标签：
```html
<meta name="description" content="..." />
<link rel="canonical" href="https://ecomafola.com" />
<!-- 完全相同的第二组 -->
<meta name="description" content="..." />
<link rel="canonical" href="https://ecomafola.com" />
```

**影响**: Google 可能选择任意一组，SEO 工具标记为错误。

**修复**: 在 SSG 模板中确保元标签只注入一次，或客户端检测到 SSR 标签时跳过注入。

---

### 3. 产品页未列入 sitemap.xml (CRITICAL)

sitemap 包含分类页但 **0 个产品详情页**：
- `/product/samoan-handcrafted-coconut-bowl`
- `/product/samoan-handwoven-grass-tote-bag`
- 等 7 个产品页全部缺失

**影响**: 产品页只能通过内部链接被发现，延迟索引且可能遗漏。

**修复**: 在构建时自动将所有 `/product/*` URL 添加到 sitemap。

---

### 4. 横幅图片 1.1MB 未优化 (CRITICAL)

`banner-main.jpg` = **1,147,867 字节**（1.1MB），无 WebP/AVIF 变体，无响应式 `srcset`。

**影响**: 移动端 LCP 增加 2-3 秒。

**修复**: 转换为 AVIF (~150KB) 或 WebP (~300KB)，添加 `fetchpriority="high"` 和 `preload`。

---

### 5. Product Schema 描述全部截断 (CRITICAL)

首页 `@graph` 中 7 个产品的 `description` 字段全部在句子中间被截断：
```json
"description": "...every bowl features its own uniq"
"description": "...allows air to circulate, making i"
"description": "...keeping your entryway pr"
```

**影响**: SERP 中显示不完整描述，AI 系统无法正确引用。

**修复**: 检查 SSG 构建中 description 字符限制或缓冲区问题。

---

## HIGH 优先级问题（1 周内修复）

### 6. 数据源不一致 — 多源冲突

| 数据字段 | Schema | llms.txt | Merchant Feed | 状态 |
|----------|--------|----------|---------------|------|
| Grass Tote Bag 价格 | $49.99 | $34.99 | $49.99 | ❌ 冲突 |
| PNG Beach Bag 价格 | $259.99 | $34.99 | $259.99 | ❌ 冲突 |
| Coir Doormat 价格 | $39.99 | $34.99 | $39.99 | ❌ 冲突 |
| 联系邮箱 | hello@ecomafola.com | hello@ecomafola-peace.com | - | ❌ 冲突 |
| 产品数量 | 7 个 | 120+ 项 | 17 个 | ❌ 冲突 |
| Shell Coasters 套装 | 4 个 | 6 个 | 4 个 | ❌ 冲突 |

**影响**: AI 系统交叉引用时发现矛盾数据会降低信任评分。

---

### 7. 非标准 schema.org 属性

所有 Product schema 使用 `origin` 和 `craftsmanship`，这两个**不是** schema.org 标准属性，Google 会静默忽略。

**修复**:
```json
// 正确写法
"countryOfOrigin": { "@type": "Country", "name": "Samoa" },
"additionalProperty": [{
  "@type": "PropertyValue",
  "name": "Craftsmanship",
  "value": "Handcrafted"
}]
```

---

### 8. 缺少 Content-Security-Policy 头

安全头检查：
| 头部 | 状态 |
|------|------|
| HSTS | ✅ `max-age=63072000` |
| X-Frame-Options | ✅ `DENY` |
| X-Content-Type-Options | ✅ `nosniff` |
| X-XSS-Protection | ✅ `1; mode=block` |
| Referrer-Policy | ✅ `strict-origin-when-cross-origin` |
| Permissions-Policy | ✅ 已配置 |
| **CSP** | ❌ **缺失** |
| CORS | ⚠️ `access-control-allow-origin: *` 过宽 |

---

### 9. Google Fonts 阻塞渲染

两个 `<link rel="stylesheet">` 同步加载 Google Fonts，阻塞首次渲染。

**修复**: 使用 `media="print" onload="this.media='all'"` 技术或自托管字体。

---

### 10. PNG Beach Bag 的 origin 字段错误

产品名称明确标注 "Papua New Guinea"，但 schema 中 `"origin": "Samoa"`。

---

### 11. 缺少 BreadcrumbList / FAQPage / BlogPosting Schema

| 页面 | 应有 Schema | 状态 |
|------|------------|------|
| 产品/分类页 | BreadcrumbList | ❌ 缺失 |
| /faq | FAQPage | ❌ 缺失 |
| /blog/* | BlogPosting | ❌ 缺失 |
| /products | ItemList | ❌ 缺失 |
| /our-story | Person | ❌ 缺失 |

---

### 12. 非产品页共用同一张 OG 图片

所有非产品页（/our-story, /impact, /contact, /faq, /blog）都使用 `banner-main.jpg` 作为 `og:image`。

---

### 13. IndexNow 未生效

`BingSiteAuth.xml` 返回 SPA 空白页面而非验证 XML，无法完成 Bing Webmaster Tools 验证。

---

## MEDIUM 优先级（1 月内修复）

### 14. 产品页 schema 图片数量不足

首页 @graph 中每个产品有 5 张图片，但单独产品页 schema 仅 1 张。

### 15. 缺少 aggregateRating 和 review schema

产品页无评分/评论结构化数据，SERP 中无法显示星级。

### 16. Organization schema 缺少地址

llms.txt 提到 "Apia, Samoa & Sydney, Australia"，但 schema 中无 `PostalAddress`。

### 17. Person schema 缺失

品牌声称 "240+ 工匠家庭"、"18 个女性合作社"，但无任何创始人或工匠的 Person schema。

### 18. Impact 页面元描述过于泛泛

"making a difference through fair trade, environmental sustainability, and community support" — 没有引用实际数据（$2.4M, 240+, 18 个合作社）。

### 19. 字体权重加载过多

Playfair Display 加载 4 个权重 (400/500/600/700)，Inter 加载 4 个权重 (300/400/500/600)。多数页面实际只用 2-3 个。

### 20. GA4 + Vercel Analytics 争用主线程

两个分析脚本并行加载，GA4 `gtag.js` 在主线程评估耗时 200-400ms。

### 21. llms-full.txt 内容等同于 llms.txt

未提供扩展内容（完整产品描述、FAQ 问答、博客摘要）。

---

## LOW 优先级（待办）

### 22. Emoji favicon
```html
<link rel="icon" href="data:image/svg+xml,...🌴..." />
```
建议添加 `.png` 或 `.ico` 回退。

### 23. Sitemap lastmod 全部为构建日期

所有 URL 的 `lastmod` 均为 `2026-04-13`（构建日期），非实际内容更新日期。

### 24. 产品页面 `name` 不一致

首页 @graph: "Samoan Handcrafted Coconut Bowl - 100% Natural Eco-Friendly Artisan Serving Bowl"
产品页: "Samoan Handcrafted Coconut Bowl"

### 25. checkout/account/dashboard 页面无 noindex

robots.txt 阻止了爬取，但无 `<meta name="robots" content="noindex">` 标签，其他站点链接到这些页面时仍可能被索引。

### 26. 缺少外部品牌存在

无 YouTube、Reddit、Wikipedia、LinkedIn 存在 — 这些是 AI 引用排名最高的 3 个信号。

### 27. FAQ 页面元标题过于通用

"Frequently Asked Questions | EcoMafola Peace" — 缺少 "Samoan" 或 "handcrafted" 关键词。

### 28. 产品 schema 缺少 @id 属性

无法建立实体间关系链接（Product → Organization → WebSite）。

---

## 快速获胜（Quick Wins）

| # | 操作 | 预期影响 | 工作量 |
|---|------|----------|--------|
| Q1 | 压缩 banner-main.jpg 为 AVIF/WebP | LCP ↓2s | 低 |
| Q2 | 添加 hero 图片 `<link rel="preload">` | LCP ↓0.5s | 低 |
| Q3 | 修复重复 meta description/canonical | SEO 工具评分 | 低 |
| Q4 | 所有产品页 URL 加入 sitemap | 索引覆盖率 | 低 |
| Q5 | 统一所有数据源价格/邮箱/数量 | AI 信任度 | 低 |
| Q6 | 替换 `origin` → `countryOfOrigin` | 验证合规 | 低 |
| Q7 | Google Fonts 改为异步加载 | FCP ↓0.3s | 低 |
| Q8 | 添加 FAQPage schema | 语义标记 | 低 |
| Q9 | 添加 BreadcrumbList schema | 富搜索结果 | 低 |
| Q10 | 创建真实的 BingSiteAuth.xml | Bing 索引 | 低 |

---

## 性能预估

| 指标 | 当前（预估） | 修复后预期 | 状态 |
|------|-------------|-----------|------|
| LCP（移动） | 4.5-6.0s | 2.0-3.0s | ⚠️ → ✅ |
| LCP（桌面） | 2.5-3.5s | 1.0-1.5s | ✅ |
| INP（移动） | 250-400ms | 150-250ms | ⚠️ |
| CLS | 0.05-0.10 | 0.02-0.05 | ✅ |
| 综合性能分 | 35-45 | 65-75 | 显著提升 |

---

## 已实施的最佳实践

- ✅ robots.txt 精细配置（AI 爬虫白名单 + 训练爬虫黑名单）
- ✅ llms.txt 结构完善、内容丰富
- ✅ Organization + WebSite + Product schema 全面部署
- ✅ Open Graph + Twitter Card 完整配置
- ✅ Google Search Console 验证
- ✅ HTTPS + HSTS 已启用
- ✅ 代码分割 + 路由级懒加载
- ✅ Vercel 边缘缓存命中
- ✅ Brotli 压缩
- ✅ SSG 预渲染 18 个路由
- ✅ sitemap.xml 结构清晰
- ✅ 关键 CSS 内联
- ✅ React vendor 使用 modulepreload

---

## 修复路线图

### 第 1 周（关键）
1. 修复重复 meta 标签
2. 产品页加入 sitemap
3. 压缩横幅图片 + preload
4. 修复 schema 描述截断
5. 统一数据源价格/邮箱

### 第 2-3 周（HIGH）
6. 全页 SSG 渲染（不仅是 head）
7. 添加 BreadcrumbList + FAQPage schema
8. 修复 origin → countryOfOrigin
9. 添加 CSP 安全头
10. 异步加载 Google Fonts

### 第 4 周（MEDIUM）
11. 添加 Person schema
12. 添加 BlogPosting schema
13. 创建真实 llms-full.txt
14. 实现 IndexNow
15. 优化字体权重

### 持续优化
- 建立 YouTube 频道展示工匠工艺
- 增加 Reddit 社区参与度
- 定期更新 lastmod 为实际修改日期
- 为每个页面生成独特的 OG 图片
- 监控 Core Web Vitals 数据
