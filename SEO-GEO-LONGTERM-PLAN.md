# EcoMafola Peace SEO & GEO 长期优化方案

**制定日期**: 2026 年 4 月 11 日  
**审计网站**: https://ecomafola.com  
**当前评分**: 技术 SEO 42/100 | GEO 42/100 | 内容 E-E-A-T 36/100 | 图片 SEO 72/100

---

## 执行摘要

### 当前状态总览

| 维度 | 评分 | 等级 | 优先级 |
|------|------|------|--------|
| 技术 SEO | 42/100 | ❌ 需改进 | 高 |
| GEO (AI 搜索) | 42/100 | ❌ 需改进 | 高 |
| 内容 E-E-A-T | 36/100 | ❌ 需改进 | 高 |
| 图片 SEO | 72/100 | ⚠️ 良好 | 中 |
| **综合评分** | **48/100** | ❌ 需改进 | - |

### 关键问题发现

#### 🔴 Critical 关键问题（立即修复）
1. **Sitemap 包含 9+ 个 404 URL** - 严重浪费爬取预算
2. **产品页面全部返回 404** - Shopify 集成未完成
3. **关于我们/联系方式页面返回 403** - 信任信号缺失
4. **缺少 Canonical 标签** - 可能导致重复内容问题

#### 🟠 High 高优先级问题
1. **无服务器端渲染 (SSR)** - AI 爬虫无法索引 JavaScript 内容
2. **缺少 Product Schema** - 失去富搜索结果机会
3. **llms.txt 文件缺失** - AI 搜索可见性受损
4. **内容严重不足** - 产品描述仅 100-150 词（建议 350+）
5. **E-E-A-T 信号弱** - 无创始人故事、工匠资质、社会证明

#### 🟡 Medium 中优先级问题
1. **图片 Alt 文本不完整** - 影响图片搜索曝光
2. **LCP 图片未预加载** - 影响 Core Web Vitals
3. **博客内容为空** - 缺少内容营销策略
4. **无用户评价系统** - 缺少社交证明

---

## 优化路线图（12 周计划）

### 第一阶段：紧急修复（第 1-2 周）

**目标**: 解决所有 Critical 问题，恢复基本功能

#### 1.1 修复 Sitemap 和 404 错误
- [ ] 从 sitemap.xml 移除所有 404 URL
- [ ] 验证产品页面 Shopify 集成
- [ ] 修复 /products 路由
- [ ] 创建自定义 404 页面

#### 1.2 添加基础 SEO 元素
- [ ] 所有页面添加 Canonical 标签
- [ ] 修复 H1 标签缺失问题
- [ ] 添加 WebPage Schema 到所有页面
- [ ] 添加 BreadcrumbList Schema

#### 1.3 恢复关键页面
- [ ] 修复 /our-story 页面（403 错误）
- [ ] 修复 /contact 页面（403 错误）
- [ ] 修复 /impact 页面
- [ ] 添加 /shipping, /returns, /privacy 页面

**预期改进**: 技术 SEO 42→65 (+23 分)

---

### 第二阶段：内容优化（第 3-5 周）

**目标**: 提升 E-E-A-T 信号和内容深度

#### 2.1 产品页面内容扩展
每个产品添加以下内容（目标 350-400 词/产品）：
- [ ] 产品故事（150 词）- 工匠背景、制作过程
- [ ] 材料详情（50 词）- 来源、可持续性
- [ ] 尺寸规格（50 词）- 详细尺寸、重量、容量
- [ ] 使用场景（50 词）- 如何使用、保养建议
- [ ] 社会影响（50 词）- 购买如何帮助工匠社区

**7 个核心产品 × 400 词 = 2,800 词新增内容**

#### 2.2 品牌故事页面完善
- [ ] 创始人故事和照片
- [ ] 工匠合作伙伴介绍（3-5 个故事）
- [ ] 制作过程照片/视频
- [ ] 社会影响数据（工匠人数、支付金额、社区项目）
- [ ] 媒体报道/奖项（如有）

#### 2.3 联系方式页面完善
- [ ] 物理地址（ Samoa 和/或 Australia）
- [ ] 电话号码（可选项）
- [ ] 联系表单
- [ ] 响应时间承诺
- [ ] FAQ 部分（5-10 个问题）

#### 2.4 创建内容支柱页面
- [ ] "萨摩亚手工编织传统" - 文化背景（1,500 词）
- [ ] "可持续材料指南" - 教育内容（1,200 词）
- [ ] "如何保养天然椰壳碗" - 使用指南（800 词）
- [ ] "公平贸易 vs 普通贸易" - 价值观内容（1,000 词）

**预期改进**: 内容 E-E-A-T 36→65 (+29 分)

---

### 第三阶段：技术 SEO 和 GEO（第 6-8 周）

**目标**: 实施 SSR 和 AI 搜索优化

#### 3.1 迁移到 Next.js (SSR)
**原因**: React SPA 架构导致 AI 爬虫无法看到内容

**迁移计划**:
- [ ] 搭建 Next.js 项目框架
- [ ] 迁移首页（/）
- [ ] 迁移产品列表页（/products）
- [ ] 迁移产品详情页（/product/[handle]）
- [ ] 迁移品牌页面（/our-story, /impact, /contact）
- [ ] 迁移博客（/blog）
- [ ] 部署到 Vercel

**预期收益**: 
- AI 爬虫可见性 +100%
- LCP 改善 40-60%
- GEO 评分 +25 分

#### 3.2 实施完整的 Schema.org 结构化数据
- [ ] Product Schema（所有产品页）
  - name, description, image, offers, aggregateRating, review
- [ ] Organization Schema（首页）
  - name, logo, sameAs, contactPoint
- [ ] WebSite Schema（首页）
  - name, url, potentialAction (SearchAction)
- [ ] Article Schema（博客文章）
  - headline, author, datePublished, image
- [ ] FAQPage Schema（联系页）
  - mainEntity (Question/Answer 数组)
- [ ] BreadcrumbList Schema（所有页面）

#### 3.3 创建和优化 llms.txt
```txt
# EcoMafola Peace
> Handcrafted Treasures from Samoa - Authentic eco-friendly goods made in partnership with local artisan cooperatives

## Brand Overview
- Founded: 2019
- Location: Apia, Samoa & Sydney, Australia
- Mission: Preserving traditional Samoan craftsmanship while supporting sustainable livelihoods
- Impact: 240+ artisan partners, $2.4M paid to artisans, 18 women-led cooperatives

## Products
- [Coconut Bowls](/product/samoan-handcrafted-coconut-bowl): $29.99 - Hand-carved from fallen coconut shells
- [Shell Necklace](/product/samoan-handcrafted-shell-necklace): $24.99 - Naturally collected shells
- [Grass Tote Bag](/product/samoan-handwoven-grass-tote-bag): $34.99 - Traditional pandanus weaving
- [Woven Basket](/product/samoan-woven-basket): $39.99 - Multi-purpose storage
- [Beach Bag](/product/handwoven-papua-new-guinea-beach-bag): $34.99 - PNG artisan made
- [Coasters](/product/samoan-handcrafted-natural-shell-coasters): $27.99 - Decorative shell coasters
- [Doormat](/product/natural-coir-handwoven-coconut-palm-doormat): $34.99 - Natural coconut fiber

## Sustainability
- 94% sustainable materials
- 100% handmade using traditional techniques
- Carbon-neutral shipping
- 1% of sales to children's education

## Certifications
- Fair Trade Partner
- B Corp Certified (pending)
- Carbon Neutral Shipping
```

#### 3.4 优化 AI 爬虫可达性
- [ ] 确保所有 AI 爬虫被允许（已配置 ✅）
- [ ] 添加 RSL 1.0 许可协议
- [ ] 创建 AI 爬虫专用 sitemap
- [ ] 优化 robots.txt 注释

**预期改进**: GEO 42→75 (+33 分)

---

### 第四阶段：图片 SEO（第 9 周）

**目标**: 优化所有图片元素

#### 4.1 修复 Alt 文本
- [ ] HeroBanner 背景图转换为 `<img>` 并添加 alt
- [ ] Impact 统计卡片背景图优化
- [ ] Features 轮播图优化 alt 文本
- [ ] 所有产品图片添加描述性 alt

#### 4.2 实施 OptimizedImage 组件
```tsx
// 统一图片组件，已创建
<OptimizedImage
  src={imageUrl}
  alt="描述性文本"
  preset="card|hero|thumbnail|detail"
  priority={关键图片}
  loading="lazy"
  fetchpriority="high"
  width={800}
  height={600}
/>
```

#### 4.3 添加 ImageObject Schema
- [ ] 产品主图添加 ImageObject Schema
- [ ] Hero 图片添加 ImageObject Schema
- [ ] 品牌故事图片添加 ImageObject Schema

#### 4.4 LCP 图片优化
- [ ] Hero 图片添加 `<link rel="preload">`
- [ ] 产品主图添加预加载
- [ ] 压缩首屏图片至 200KB 以下

**预期改进**: 图片 SEO 72→88 (+16 分)

---

### 第五阶段：内容营销和社交证明（第 10-12 周）

**目标**: 建立持续内容流和用户信任

#### 5.1 启动博客
**内容日历（12 周）**:

| 周次 | 主题 | 类型 | 词数 |
|------|------|------|------|
| 1 | 萨摩亚编织传统 | 文化故事 | 1,500 |
| 2 | 椰壳碗的 10 种创意用途 | 使用指南 | 1,200 |
| 3 | 工匠故事：Ana 的 15 年工艺 | 人物专访 | 1,000 |
| 4 | 可持续材料全解析 | 教育内容 | 1,500 |
| 5 | 如何保养天然椰壳制品 | 保养指南 | 800 |
| 6 | 公平贸易的力量 | 价值观 | 1,000 |
| 7 | 太平洋岛屿工艺之旅 | 文化探索 | 1,500 |
| 8 | 客户故事：为什么选择 EcoMafola | 客户专访 | 800 |
| 9 | 环境影响报告 2026 | 数据报告 | 1,200 |
| 10 | 节日礼物指南 | 购物指南 | 1,000 |
| 11 | 新品发布：限量版系列 | 产品公告 | 600 |
| 12 | 2026 年社区影响总结 | 年度报告 | 1,500 |

#### 5.2 客户评价系统
- [ ] 产品页添加评价模块
- [ ] 邮件邀请客户留评
- [ ] 评价 Schema  markup
- [ ] 图片评价功能

#### 5.3 建立社会存在
- [ ] YouTube 频道创建（工艺视频）
- [ ] Pinterest 商业账户（产品图板）
- [ ] Instagram 内容策略（每周 3 帖）
- [ ] LinkedIn 公司页面（B2B 合作）

#### 5.4 建立品牌提及
- [ ] 创建 Wikipedia 草稿（品牌历史）
- [ ] 参与 Reddit 社区（r/sustainability, r/handmade）
- [ ] 联系旅游/生活方式博主评论
- [ ] 提交产品到可持续生活媒体

**预期改进**: 社交证明从 0→60 分

---

## 长期维护计划

### 每周任务
- [ ] 发布 1 篇博客文章（1,000-1,500 词）
- [ ] 发布 3 条社交媒体帖子
- [ ] 回复所有客户评价
- [ ] 监控 Google Search Console 错误

### 每月任务
- [ ] SEO 健康检查（运行审计脚本）
- [ ] 更新 2-3 个产品页面内容
- [ ] 添加 2-3 个新客户评价
- [ ] 分析竞争对手排名变化
- [ ] 优化低表现页面（CTR < 2%）

### 每季度任务
- [ ] 全面 SEO 审计（使用 claude-seo）
- [ ] 内容差距分析
- [ ] 技术债务清理
- [ ] 新功能规划

---

## 成功指标（KPIs）

### 3 个月目标
| 指标 | 当前 | 目标 | 测量方式 |
|------|------|------|----------|
| 综合 SEO 评分 | 48/100 | 75/100 | claude-seo |
| GEO 准备度 | 42/100 | 70/100 | seo-geo |
| 索引页面数 | ~10 | 50+ | GSC |
| 有机流量 | 未知 | 500/月 | GA4 |
| 核心关键词排名 | 无 | Top 10: 5 个 | SEMrush |

### 6 个月目标
| 指标 | 当前 | 目标 |
|------|------|------|
| 综合 SEO 评分 | 48/100 | 85/100 |
| GEO 准备度 | 42/100 | 80/100 |
| 有机流量 | 未知 | 2,000/月 |
| 核心关键词排名 | 无 | Top 10: 20 个 |
| AI 引用次数 | 0 | 10+ |

### 12 个月目标
| 指标 | 当前 | 目标 |
|------|------|------|
| 有机流量 | 未知 | 10,000/月 |
| 博客文章数 | 0 | 50+ |
| 产品评价数 | 0 | 200+ |
| 品牌提及数 | 0 | 50+ |

---

## 工具和资源

### 使用的工具
| 工具 | 用途 | 频率 |
|------|------|------|
| claude-seo | 全面 SEO 审计 | 每季度 |
| seo-geo | AI 搜索优化 | 每季度 |
| Google Search Console | 索引监控 | 每周 |
| Google Analytics 4 | 流量分析 | 每周 |
| Vercel Analytics | 性能监控 | 每周 |
| Shopify CDN | 图片优化 | 持续 |

### 团队角色
| 角色 | 职责 | 时间投入 |
|------|------|----------|
| SEO 专家 | 审计、策略、执行 | 20 小时/周（前 3 月） |
| 内容作家 | 博客、产品描述 | 15 小时/周 |
| 开发者 | 技术实施、SSR 迁移 | 40 小时（一次性） |
| 社交媒体经理 | 社交存在、品牌提及 | 10 小时/周 |

---

## 风险和缓解措施

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| SSR 迁移导致功能回归 | 中 | 高 | 全面测试、分阶段发布 |
| 内容质量不达标 | 低 | 中 | 建立编辑流程、使用专业作家 |
| AI 爬虫策略变化 | 中 | 中 | 持续监控、快速适应 |
| 竞争对手超越 | 高 | 中 | 持续优化、差异化内容 |
| 技术债务积累 | 高 | 低 | 定期代码审查、季度清理 |

---

## 预算估算

| 项目 | 成本 | 周期 |
|------|------|------|
| Next.js 开发（外包） | $5,000-8,000 | 一次性 |
| 内容创作（12 周） | $3,600 ($300/周) | 3 月 |
| SEO 工具订阅 | $300/月 | 持续 |
| 社交媒体管理 | $1,200/月 | 持续 |
| **首季总预算** | **$15,000-18,000** | - |

---

## 下一步行动

### 本周（第 1 周）
1. [ ] 修复 sitemap.xml 404 问题
2. [ ] 修复产品页面路由
3. [ ] 添加所有页面 Canonical 标签
4. [ ] 创建临时 404 页面

### 下周（第 2 周）
1. [ ] 修复/our-story, /contact, /impact 页面
2. [ ] 实施基础 Schema.org 结构化数据
3. [ ] 创建 llms.txt 文件
4. [ ] 运行第一次周度 SEO 检查

---

**报告生成**: Claude Code with claude-seo & SEO Machine  
**下次审计**: 2026 年 4 月 18 日（周度检查）
