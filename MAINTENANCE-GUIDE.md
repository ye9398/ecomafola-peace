# EcoMafola Peace 项目维护文档

**创建日期**: 2026 年 4 月 11 日  
**维护负责人**: Claude (当前会话 Agent)  
**GitHub 仓库**: https://github.com/ye9398/ecomafola-peace  
**生产环境**: https://ecomafola.com  
**Vercel Dashboard**: https://vercel.com/xuemeijia1998-5006s-projects/ecomafola-peace

---

## 📋 目录

1. [项目状态](#项目状态)
2. [工作目录管理](#工作目录管理)
3. [提交规范](#提交规范)
4. [部署流程](#部署流程)
5. [安全配置](#安全配置)
6. [SEO & GEO 配置](#seo--geo-配置)
7. [常见问题](#常见问题)

---

## 项目状态

### 最新提交

| Commit | 描述 | 日期 |
|--------|------|------|
| `e5969b33` | feat: Merchant Feed, CMS fixes, and performance optimizations | 2026-04-11 |
| `63691cc4` | feat(seo): Restore SEO and GEO optimizations after rollback | 2026-04-11 |

### 已完成功能

- ✅ **SEO 优化**: 14 个页面的 Canonical 标签和 Schema.org 结构化数据
- ✅ **GEO 优化**: llms.txt, robots.txt AI 爬虫配置
- ✅ **Google Merchant Feed**: 产品 Feed 文件和生成器脚本
- ✅ **CMS 管理后台**: Blog 内容管理、产品管理、首页管理
- ✅ **性能优化**: OptimizedImage 组件替换，图片懒加载

---

## 工作目录管理

### ⚠️ 重要：单一工作目录原则

**当前系统中有多个 ecomafola-peace 目录，但只有一个应该用于 Git 操作：**

| 目录路径 | 用途 | Git 操作 |
|---------|------|----------|
| `/c/Users/Administrator.DESKTOP-BLI48LE/AppData/Local/Temp/ecomafola-peace` | **主工作目录** | ✅ 允许 |
| `~/.accio/.../ecomafola-peace` | Accio Agent 临时目录 | ❌ 禁止推送 |
| `~/.openclaw/.../ecomafola-peace` | OpenClaw 临时目录 | ❌ 禁止推送 |

**规则**:
1. 所有 Git 提交和推送必须在**主工作目录**执行
2. Accio/OpenClaw 目录仅用于临时任务，完成后不得推送
3. 如需切换目录，先确认当前分支状态

### 检查工作目录

```bash
# 确认当前目录
pwd

# 确认 git 状态
git status

# 确认远程同步状态
git fetch origin && git log --oneline -3
```

---

## 提交规范

### Commit Message 格式

```
<type>: <description>

[optional body]
```

### Type 类型

| Type | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add blog admin panel` |
| `fix` | Bug 修复 | `fix: resolve image upload issue` |
| `perf` | 性能优化 | `perf: lazy load images` |
| `seo` | SEO 优化 | `seo: add canonical tags` |
| `docs` | 文档更新 | `docs: update README` |
| `chore` | 配置/工具 | `chore: update dependencies` |

### 示例

```bash
git commit -m "feat: add Google Merchant Feed generator

- public/google-merchant-feed.txt: Product feed for Shopping
- scripts/generate-merchant-feed.js: Automated generation
- Runs on every build, outputs to public/"
```

---

## 部署流程

### Vercel 自动部署

**触发条件**: 推送代码到 GitHub `master` 分支

```bash
# 1. 检查状态
git status

# 2. 添加更改
git add .

# 3. 提交
git commit -m "feat: your changes"

# 4. 推送（触发 Vercel 部署）
git push origin master
```

### 部署检查清单

- [ ] 本地构建通过 (`npm run build`)
- [ ] 无 TypeScript 错误
- [ ] 无硬编码 Token（检查 `git grep "shpat_"`）
- [ ] 提交信息清晰描述更改

### 部署后验证

1. 访问 Vercel Dashboard 查看部署状态
2. 部署完成后访问 https://ecomafola.com 验证
3. 检查 Google Search Console 是否有错误

---

## 安全配置

### Token 管理

**禁止硬编码 Token**。使用环境变量：

```typescript
// ❌ 错误：硬编码 Token
const token = "shpat_xxxxxxxxxxxx"

// ✅ 正确：环境变量
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
```

### .env 配置

```bash
# .env.local (不提交到 Git)
VITE_SHOPIFY_STOREFRONT_TOKEN=your_token_here
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
```

### Git 提交前检查

```bash
# 检查是否有硬编码 Token
git grep -n "shpat_\|sk_live_\|Bearer sk_" -- src/ public/ scripts/

# 如果有输出，先清理再提交
```

---

## SEO & GEO 配置

### 已配置的结构化数据

| Schema 类型 | 页面 | 状态 |
|------------|------|------|
| Organization | HomePage | ✅ |
| Product | ProductDetailPage | ✅ |
| Review | ProductDetailPage | ✅ |
| HowTo | ProductDetailPage (保养指南) | ✅ |
| BlogPosting | BlogPostPage | ✅ |
| BreadcrumbList | 所有页面 | ✅ |

### AI 爬虫配置

**robots.txt** - 已允许以下 AI 爬虫：
- GPTBot (ChatGPT)
- ClaudeBot
- PerplexityBot
- OAI-SearchBot
- Google-Extended

**llms.txt** - AI 爬虫内容指导，位于 `/llms.txt`

### 后续 SEO 优化建议

1. 每周发布 1-2 篇博客文章
2. 每月更新产品描述
3. 每季度进行一次完整 SEO 审计

---

## 常见问题

### Q: 多个 Agent 同时操作会覆盖代码吗？

**A**: 如果都从 GitHub 拉取最新代码并推送到 GitHub，不会覆盖。但为避免冲突：
1. 操作前 `git pull origin master`
2. 有冲突时手动解决
3. 不要强行推送 (`git push --force`)

### Q: Vercel 部署失败怎么办？

**A**: 
1. 查看 Vercel Dashboard 的部署日志
2. 常见错误：
   - 构建错误：检查 TypeScript 错误
   - 环境变量缺失：检查 .env.local
   - Token 泄露：GitHub 安全扫描会阻止

### Q: 如何恢复 SEO 配置？

**A**: 参考 `SEO-GEO-RESTORE-COMPLETED.md` 文档，包含完整配置清单。

### Q: 如何生成 Google Merchant Feed？

**A**: 
```bash
node scripts/generate-merchant-feed.js
```
Feed 文件位于 `public/google-merchant-feed.txt`

---

## 维护日志

### 2026-04-11: 统一管理权移交

**问题**: 多个 Agent 同时操作，存在覆盖风险

**解决方案**:
1. 同步 Accio 目录的重要更改到主工作目录
2. 创建干净的提交历史
3. 禁止其他 Agent 推送

**提交**: `e5969b33` - Merchant Feed + CMS fixes + performance optimizations

---

## 联系方式

**项目负责人**: EcoMafola Team  
**技术维护**: Claude (AI Assistant)  
**邮箱**: hello@ecomafola-peace.com

---

**[END OF DOCUMENT]**
