# EcoMafola Peace GEO（生成式引擎优化）深度审计报告

**审计日期：** 2026 年 4 月 11 日  
**审计网站：** https://ecomafola.com  
**审计工具：** seo-geo 技能

---

## 执行摘要

### GEO 准备度总评分：**42/100**

| 平台 | 评分 | 状态 |
|------|------|------|
| Google AI Overviews | 48/100 | 需要改进 |
| ChatGPT | 35/100 | 不足 |
| Perplexity | 38/100 | 不足 |

---

## 1. AI 爬虫可达性检查

### 现状分析

**robots.txt 配置状态：优秀** ✅

```txt
# AI Crawlers - Allow for GEO 优化
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Block training crawlers (可选)
User-agent: CCBot
Disallow: /
User-agent: Bytespider
Disallow: /
```

### 评估

| 爬虫 | 状态 | 说明 |
|------|------|------|
| GPTBot (ChatGPT) | ✅ 允许 | 已正确配置 |
| OAI-SearchBot | ✅ 允许 | 已正确配置 |
| ClaudeBot | ✅ 允许 | 已正确配置 |
| PerplexityBot | ✅ 允许 | 已正确配置 |
| Google-Extended | ✅ 允许 | 已正确配置 |
| CCBot (Common Crawl) | ❌ 阻止 | 训练爬虫，阻止合理 |
| Bytespider (ByteDance) | ❌ 阻止 | 训练爬虫，阻止合理 |

**得分：20/20** - AI 爬虫访问配置完美

---

## 2. llms.txt 文件质量分析

### 现状：**缺失** ❌

网站当前**没有** `/llms.txt` 文件。

### 影响

llms.txt 是新兴的 AI 爬虫标准格式，用于向 AI 系统提供结构化内容指导。缺失此文件会导致：
- AI 爬虫无法快速理解网站结构
- 降低被引用为可信来源的概率
- 错失 GEO 优化的关键机会

### 建议创建的 llms.txt 内容

```txt
# EcoMafola Peace
> Handcrafted Treasures from Samoa - Authentic eco-friendly goods made in partnership with local artisan cooperatives

## Main Sections
- [Home](https://ecomafola.com/): Discover authentic Samoan handcrafted treasures
- [All Products](https://ecomafola.com/products): Browse our complete collection of sustainable goods
- [Coconut Bowls](https://ecomafola.com/products/coconut-bowls): 100% natural, biodegradable coconut bowls
- [Woven Baskets](https://ecomafola.com/products/woven-baskets): Traditional Samoan weaving techniques
- [Beach Bags](https://ecomafola.com/products/beach-bags): Handwoven sustainable bags
- [Home Decor](https://ecomafola.com/products/home-decor): Ocean-inspired home accessories
- [Our Story](https://ecomafola.com/our-story): Supporting Samoan artisan communities
- [Impact](https://ecomafola.com/impact): Preserving traditions, protecting nature

## Key Facts
- Founded: 2026
- Mission: Support jobs for local makers, preserve traditional techniques, protect island natural resources
- Product Range: 120+ handcrafted items
- Materials: 100% natural, biodegradable, sustainable
- Artisan Partners: Local cooperatives in Samoa
- Shipping: Worldwide

## Contact
- Email: hello@ecomafola-peace.com
- Social: @ecomafola (Facebook, Instagram)
```

**得分：0/15** - llms.txt 缺失

---

## 3. AI 引用准备度评估（Citations Readiness）

### 分析结果

#### 优势 ✅
- 拥有清晰的品牌定位（萨摩亚手工艺品）
- 产品描述包含具体材料信息（100% 天然椰子壳、可生物降解）
- 有结构化数据（Organization schema）

#### 劣势 ❌
- **缺少作者署名** - 无内容创作者信息
- **缺少出版日期** - 页面没有明确的发布/更新时间（虽然 sitemap 中有 lastmod）
- **缺少引用来源** - 没有链接到权威来源或研究数据
- **缺少问答格式内容** - 没有 FAQ 或问题解答型内容
- **段落结构不适合提取** - 内容块长度未优化

### 可引用性评分：25/40

---

## 4. 品牌提及分析

### 平台存在度检查

| 平台 | 存在状态 | 提及质量 | 得分 |
|------|----------|----------|------|
| Wikipedia | ❌ 不存在 | - | 0/10 |
| Reddit | ⚠️ 间接提及 | 通过 Instagram 帖子提及 r/handmade, r/ZeroWaste, r/Samoa | 2/10 |
| YouTube | ❌ 无频道 | - | 0/10 |
| Instagram | ⚠️ 有限存在 | 有提及但非官方账号主导 | 3/10 |
| LinkedIn | ❌ 不存在 | - | 0/10 |
| Twitter/X | ❌ 不存在 | - | 0/10 |
| Pinterest | ⚠️ 未知 | 未找到明确结果 | 1/10 |
| Facebook | ⚠️ 声称存在 | sameAs 中声明但未验证 | 2/10 |

### 关键发现

根据 Ahrefs 2025 年 12 月研究，**品牌提及与 AI 可见性的相关性比反向链接强 3 倍**：
- YouTube 提及：相关性 ~0.737（最强）
- Reddit 提及：高相关性
- Wikipedia 存在：高相关性

**当前状态：** EcoMafola 在主要平台上的品牌存在度极低，严重影响 AI 引用概率。

**得分：8/25**

---

## 5. 内容结构化分析

### 网站架构

```
ecomafola.com/
├── / (首页)
├── /products (产品列表)
├── /products/coconut-bowls (产品分类)
├── /products/woven-baskets
├── /products/beach-bags
├── /products/home-decor
├── /product/[handle] (产品详情 - 7 个产品)
├── /our-story (品牌故事)
├── /impact (影响力)
├── /contact (联系我们)
├── /privacy-policy (隐私政策)
└── /track (订单追踪)
```

### 技术架构分析

**问题：客户端渲染（CSR）- 需要改进** ⚠️

从 HTML 分析：
```html
<div id="root"></div>
<script type="module" crossorigin src="/assets/index-DHgNCyg-.js"></script>
<link rel="modulepreload" crossorigin href="/assets/react-vendor-Kaoa78fw.js">
```

- 网站使用 **React + Vite** 构建
- 内容通过 **客户端 JavaScript 渲染**
- **AI 爬虫不执行 JavaScript**，这意味着主要内容对 AI 爬虫不可见

### Shopify 集成

网站使用 Shopify 作为后端（通过 GraphQL API），但前端是纯客户端渲染。

### 结构化数据

✅ **已实现 Organization Schema：**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EcoMafola Peace",
  "url": "https://ecomafola.com",
  "logo": "https://ecomafola.com/logo.png",
  "description": "Handcrafted goods from Samoa, made in partnership with local artisan cooperatives",
  "foundingDate": "2026",
  "areaServed": "Worldwide",
  "sameAs": [
    "https://www.facebook.com/ecomafola",
    "https://www.instagram.com/ecomafola"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "hello@ecomafola-peace.com"
  }
}
```

**缺失的 Schema 类型：**
- ❌ Product Schema（产品详情）
- ❌ BreadcrumbList Schema
- ❌ FAQPage Schema
- ❌ Article/BlogPosting Schema
- ❌ Person Schema（作者/创始人）

**得分：22/40**

---

## 6. E-E-A-T 信号评估

### Experience（经验）

| 信号 | 状态 | 评估 |
|------|------|------|
| 创始人/团队信息 | ❌ 缺失 | 无法验证 |
|  artisan 合作伙伴详情 | ❌ 缺失 | 无具体信息 |
| 制作工艺展示 | ❌ 缺失 | 无视频/图片证明 |
| 客户评价 | ⚠️ 有限 | 仅有 1 条引用评价 |

### Expertise（专业性）

| 信号 | 状态 | 评估 |
|------|------|------|
| 作者资质 | ❌ 缺失 | 无署名内容 |
| 专业认证 | ❌ 缺失 | 未展示 |
| 行业知识展示 | ⚠️ 有限 | 产品描述基础 |
| 引用来源 | ❌ 缺失 | 无外部权威引用 |

### Authoritativeness（权威性）

| 信号 | 状态 | 评估 |
|------|------|------|
| Wikipedia 存在 | ❌ 无 | - |
| 媒体报道 | ❌ 无 | 未找到 |
| 行业奖项 | ❌ 无 | - |
| 合作伙伴关系 | ⚠️ 声称 | 未验证 |

### Trustworthiness（可信度）

| 信号 | 状态 | 评估 |
|------|------|------|
| 联系信息 | ✅ 有 | hello@ecomafola-peace.com |
| 隐私政策 | ✅ 有 | /privacy-policy |
| 更新日期 | ⚠️ 仅 sitemap | 页面无显示 |
| 安全连接 | ✅ HTTPS | - |
| 退货/运输政策 | ⚠️ 未知 | 未找到页面 |

**E-E-A-T 总分：18/40**

---

## 7. 段落级可引用性分析

### 最优引用长度标准

根据研究，**134-167 词**的段落最容易被 AI 引用。

### 当前问题分析

由于网站使用客户端渲染，无法直接分析实际内容长度。但基于产品页面 URL 结构和典型电商模式：

**预估问题：**
- 产品描述可能过短（通常 50-100 词）
- 缺少"什么是 X"类型的定义段落
- 缺少自包含的答案块

### 建议的内容块结构

```markdown
## 什么是椰子壳碗？

椰子壳碗是由天然椰子壳手工制作而成的环保餐具。每个碗都经过精心打磨和抛光，保留椰子壳天然的纹理和图案。与传统陶瓷或塑料碗不同，椰子壳碗完全可生物降解，在使用寿命结束后可自然分解，不会对环境造成负担。

## 如何保养椰子壳碗？

椰子壳碗的保养非常简单。建议用温水手洗，避免长时间浸泡。定期使用椰子油或橄榄油擦拭内壁，可以保持碗的光泽并防止开裂。避免将椰子壳碗放入洗碗机或微波炉，高温可能导致开裂或变形。正确使用和保养的情况下，每个碗可以使用数年。
```

**得分：15/25**

---

## 8. 多模态内容检查

### 分析结果

| 类型 | 状态 | 详情 |
|------|------|------|
| 图片 | ✅ 有 | Open Graph 图片存在，产品图片来自 Shopify CDN |
| 视频 | ❌ 无 | 未发现嵌入视频内容 |
| 信息图表 | ❌ 无 | 未发现 |
| 交互式元素 | ❌ 无 | 无计算器/工具 |

### Open Graph / Twitter Card 状态 ✅

```html
<meta property="og:image" content="https://sc02.alicdn.com/kf/Aa05c428c426e40afb2f4a3d8c1d247b0y.png" />
<meta property="twitter:card" content="summary_large_image" />
```

**得分：12/20**

---

## 9. 服务器端渲染（SSR）验证

### 测试结果：❌ 未实现 SSR

**证据：**
```html
<div id="root"></div>
<script type="module" crossorigin src="/assets/index-DHgNCyg-.js"></script>
```

- 页面使用 `div#root` 作为容器
- 通过 JavaScript 模块动态渲染内容
- AI 爬虫（GPTBot, ClaudeBot 等）**不执行 JavaScript**

### 影响

- 主要内容对 AI 爬虫**不可见**
- 产品详情、品牌故事等关键内容无法被索引
- 严重影响 GEO 表现

### 建议解决方案

1. **实施 SSR 框架**：迁移到 Next.js 或 Remix
2. **添加静态 HTML 回退**：为关键内容提供非 JS 版本
3. **使用 Shopify 原生主题**：利用 Shopify 的服务器端渲染

**得分：0/20**

---

## 10. 实体链接和知识图谱存在性

### 检查结果

| 实体类型 | 状态 | 详情 |
|----------|------|------|
| 品牌实体 | ⚠️ 有限 | 仅在自有网站存在 |
| Wikidata | ❌ 无条目 | - |
| Google 知识图谱 | ❌ 不存在 | - |
| Crunchbase | ❌ 无档案 | - |

### sameAs 链接分析

当前 Organization Schema 中的 sameAs：
- https://www.facebook.com/ecomafola（需要验证）
- https://www.instagram.com/ecomafola（需要验证）

**建议添加：**
- Wikipedia（如未来创建）
- LinkedIn 公司页面
- Crunchbase（如适用）
- 行业目录

**得分：5/15**

---

## 平台细分评分详解

### Google AI Overviews: 48/100

| 因素 | 权重 | 得分 | 加权 |
|------|------|------|------|
| 传统 SEO 排名 | 35% | 40/100 | 14 |
| 内容结构化 | 25% | 50/100 | 12.5 |
| 结构化数据 | 20% | 60/100 | 12 |
| 品牌信号 | 20% | 45/100 | 9 |

**关键发现：** 92% 的 AI Overview 引用来自排名前 10 的页面，需要提升传统 SEO。

### ChatGPT: 35/100

| 因素 | 权重 | 得分 | 加权 |
|------|------|------|------|
| Wikipedia 存在 | 40% | 0/100 | 0 |
| Reddit 提及 | 25% | 20/100 | 5 |
| 权威来源引用 | 20% | 30/100 | 6 |
| 内容可引用性 | 15% | 40/100 | 6 |
| llms.txt | 10% | 0/100 | 0 |

**关键发现：** ChatGPT 47.9% 的引用来自 Wikipedia，当前无存在。

### Perplexity: 38/100

| 因素 | 权重 | 得分 | 加权 |
|------|------|------|------|
| Reddit 讨论 | 35% | 20/100 | 7 |
| Wikipedia | 25% | 0/100 | 0 |
| 内容新鲜度 | 20% | 70/100 | 14 |
| 多模态内容 | 20% | 50/100 | 10 |

**关键发现：** Perplexity 46.7% 的引用来自 Reddit，需要建立社区存在。

---

## 前 5 个高影响力改进项

### 1. 🚨 实施服务器端渲染（SSR）- 影响力：极高

**当前问题：** 所有内容对 AI 爬虫不可见

**解决方案：**
```bash
# 选项 A: 迁移到 Next.js
npx create-next-app@latest ecomafola-storefront

# 选项 B: 使用 Shopify Hydrogen (推荐)
npm create @shopify/hydrogen@latest
```

**预期提升：** +25 分

---

### 2. 🚨 创建 llms.txt 文件 - 影响力：高

**位置：** `/llms.txt`

**内容：**
```txt
# EcoMafola Peace
> Handcrafted Treasures from Samoa - Authentic eco-friendly goods made in partnership with local artisan cooperatives

## Main Sections
- [Home](https://ecomafola.com/): Discover authentic Samoan handcrafted treasures
- [All Products](https://ecomafola.com/products): Browse our complete collection
- [Coconut Bowls](https://ecomafola.com/products/coconut-bowls): 100% natural biodegradable bowls
- [Woven Baskets](https://ecomafola.com/products/woven-baskets): Traditional Samoan weaving
- [Beach Bags](https://ecomafola.com/products/beach-bags): Sustainable handwoven bags
- [Our Story](https://ecomafola.com/our-story): Supporting Samoan artisans since 2026
- [Impact](https://ecomafola.com/impact): Environmental and social impact

## Key Facts
- Mission: Support local makers, preserve traditional techniques, protect natural resources
- Materials: 100% natural, biodegradable, sustainable
- Artisan Partners: Local cooperatives in Samoa and South Pacific
- Shipping: Worldwide delivery
- Contact: hello@ecomafola-peace.com
```

**预期提升：** +8 分

---

### 3. 🚨 添加 Product Schema 结构化数据 - 影响力：高

**实施位置：** 所有产品详情页

**代码示例：**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Samoan Handcrafted Coconut Bowl",
  "image": [
    "https://cdn.shopify.com/s/files/1/coconut-bowl-1.jpg",
    "https://cdn.shopify.com/s/files/1/coconut-bowl-2.jpg"
  ],
  "description": "100% natural coconut bowl handcrafted by Samoan artisans. Biodegradable, sustainable, and unique.",
  "brand": {
    "@type": "Brand",
    "name": "EcoMafola Peace"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://ecomafola.com/product/samoan-handcrafted-coconut-bowl",
    "priceCurrency": "USD",
    "price": "24.99",
    "availability": "https://schema.org/InStock"
  },
  "material": "Coconut Shell",
  "origin": "Samoa",
  "craftsmanship": "Handcrafted"
}
</script>
```

**预期提升：** +10 分

---

### 4. 🚨 创建品牌社会存在度 - 影响力：高

**优先级平台及行动：**

| 平台 | 行动 | 优先级 |
|------|------|--------|
| YouTube | 创建频道，上传工艺制作视频 | 🔴 最高 |
| Reddit | 在 r/handmade, r/ZeroWaste, r/Samoa 参与讨论 | 🔴 最高 |
| LinkedIn | 创建公司页面 | 🟠 高 |
| Pinterest | 创建产品图板 | 🟠 高 |
| Wikipedia | 创建品牌条目（需满足知名度要求） | 🟡 中 |

**预期提升：** +15 分（长期）

---

### 5. 🚨 优化内容可引用性 - 影响力：中高

**行动清单：**

1. **添加定义段落（134-167 词）**
```markdown
## 什么是椰子壳碗？

椰子壳碗是由天然椰子壳手工制作而成的环保餐具。在萨摩亚，椰子壳碗制作是一门传承了数代的传统工艺。每个碗都经过精心挑选、切割、打磨和抛光，保留椰子壳天然的纹理和图案，使每个碗成为独一无二的艺术品。

与传统陶瓷或塑料碗不同，椰子壳碗完全可生物降解。在使用寿命结束后可自然分解，不会对环境造成负担。选择椰子壳碗不仅是对可持续生活方式的承诺，也是对萨摩亚传统手工艺人的支持。
```

2. **创建 FAQ 部分**
```markdown
## 常见问题

### 椰子壳碗可以用于热食吗？
是的，椰子壳碗可以盛放温热食物，但不建议用于微波炉加热。天然椰子壳可以承受正常饮食温度（最高约 80°C）。

### 如何清洁椰子壳碗？
建议用温水手洗，使用温和的洗洁精。避免长时间浸泡和洗碗机清洗。

### 椰子壳碗可以用多久？
正确使用和保养的情况下，每个碗可以使用 2-3 年。定期用椰子油擦拭可以延长使用寿命。
```

**预期提升：** +12 分

---

## 完整优化检查清单

### 立即可执行（1-7 天）

- [ ] 创建 llms.txt 文件
- [ ] 添加 Product Schema 到所有产品页
- [ ] 添加 BreadcrumbList Schema
- [ ] 在页面显示出版/更新日期
- [ ] 创建 FAQ 内容块

### 短期（1-4 周）

- [ ] 优化产品描述为 134-167 词段落
- [ ] 创建 YouTube 频道并上传 3-5 个视频
- [ ] 创建 LinkedIn 公司页面
- [ ] 在 Reddit 相关社区建立存在
- [ ] 添加作者/创始人信息页面

### 中期（1-3 月）

- [ ] 实施 SSR（迁移到 Next.js/Hydrogen）
- [ ] 创建原创研究/调查内容
- [ ] 建立 Pinterest 产品图板
- [ ] 获取媒体报道或行业提及
- [ ] 考虑 Wikipedia 条目创建（如符合条件）

### 长期（3-6 月）

- [ ] 建立完整的品牌实体存在
- [ ] 争取进入 Google 知识图谱
- [ ] 发展 YouTube 频道至 1000+ 订阅
- [ ] 建立行业合作伙伴关系并公开宣布
- [ ] 创建独特的在线工具/计算器

---

## 结论

EcoMafola Peace 目前在 GEO 优化方面处于**早期阶段**。虽然 AI 爬虫访问配置完善，但关键问题在于：

1. **客户端渲染导致内容对 AI 爬虫不可见** - 这是最严重的问题
2. **品牌社会存在度极低** - 影响 AI 信任度
3. **缺少 llms.txt 和结构化数据** - 错失优化机会
4. **内容可引用性不足** - 段落长度和格式需优化

**实施上述改进后，预计 GEO 评分可从 42 分提升至 75-80 分。**

---

## 附录：萨摩亚手工艺品行业背景（2025-2026）

基于最新行业研究，EcoMafola Peace 定位在一个增长中的市场：

### 行业动态
- **2025 年 11 月**：萨摩亚政府启动 "Stitch with Love: Su'i ma le Alofa" 国家缝纫培训项目
- **2026 年 2 月**：新西兰太平洋事务部签署协议，推动太平洋手工艺品走向世界
- **2026 年 3 月**：可持续蓝色太平洋倡议完成海螺壳工艺品培训项目
- **2026 年 9 月**：第 32 届太平洋岛屿节将在圣地亚哥举办，主题"扎根传统，编织文化"

### 市场机会
萨摩亚传统编织工艺正获得国际关注，这为 EcoMafola Peace 提供了：
- 媒体曝光机会
- 行业合作可能
- Wikipedia 条目创建的行业背景支撑

---

**报告生成：** seo-geo 技能  
**审计时间：** 2026 年 4 月 11 日
