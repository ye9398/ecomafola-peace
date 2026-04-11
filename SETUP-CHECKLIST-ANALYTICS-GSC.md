# Vercel Analytics 和 Google Search Console 设置检查清单

**创建日期**: 2026 年 4 月 11 日  
**执行状态**: 待用户执行

---

## 📋 任务 1: 启用 Vercel Analytics（5 分钟）

### 步骤清单

- [ ] **第 1 步**: 访问 Vercel Dashboard
  - URL: https://vercel.com/xuemeijia1998-5006s-projects/ecomafola-peace
  - 操作：登录并进入项目页面

- [ ] **第 2 步**: 点击 Analytics 标签
  - 位置：顶部导航栏
  - 找到 "Analytics" 选项卡

- [ ] **第 3 步**: 启用 Web Analytics
  - 点击 "Enable Web Analytics" 按钮
  - 确认启用

- [ ] **第 4 步**: 启用 Speed Insights
  - 找到 "Speed Insights" 部分
  - 点击 "Enable Speed Insights" 按钮

- [ ] **第 5 步**: 验证启用成功
  - 应看到仪表板界面
  - 显示 "Collecting data..." 或类似提示

### 预期结果

启用后，您将看到：

```
┌─────────────────────────────────────────────┐
│ Vercel Analytics Dashboard                  │
├─────────────────────────────────────────────┤
│ Visitors                                    │
│ ▓▓▓▓▓▓▓▓  (数据将在 24-48 小时后显示)       │
│                                             │
│ Speed Insights                              │
│ LCP: -- ms (收集中)                         │
│ INP: -- ms (收集中)                         │
│ CLS: -- (收集中)                            │
└─────────────────────────────────────────────┘
```

### 数据可用时间

- **Visitors**: 启用后 24 小时开始显示
- **Speed Insights**: 启用后 48 小时开始显示
- **完整数据**: 启用后 7 天

### 访问链接

启用后，随时访问：
```
https://vercel.com/xuemeijia1998-5006s-projects/ecomafola-peace/analytics
```

---

## 📋 任务 2: 提交 Sitemap 到 Google Search Console（15-30 分钟）

### 前置准备

确认您有以下权限：
- [ ] ecomafola.com 域名管理权限（用于 DNS 验证）
- [ ] 或网站首页代码修改权限（用于 HTML 标签验证）
- [ ] Google 账号（建议使用官方账号）

### 步骤清单

#### A. 登录 Google Search Console

- [ ] **第 1 步**: 打开 https://search.google.com/search-console
- [ ] **第 2 步**: 使用 Google 账号登录

#### B. 添加网站属性（选择一种验证方式）

**方式一：域名验证（推荐）**

- [ ] **第 3 步 A-1**: 选择"域名"选项卡
- [ ] **第 4 步 A-2**: 输入 `ecomafola.com`
- [ ] **第 5 步 A-3**: 复制 DNS TXT 记录值
  - 格式：`google-site-verification=xxxxxxxxxxxxxxx`
- [ ] **第 6 步 A-4**: 登录域名注册商后台
  - 常见注册商：GoDaddy, Namecheap, Cloudflare, 阿里云等
- [ ] **第 7 步 A-5**: 添加 DNS TXT 记录
  - 主机/名称：`@`
  - 类型：`TXT`
  - 值：`google-site-verification=xxxxxxxxxxxxxxx`（复制 Google 提供的值）
  - TTL：自动或 3600
- [ ] **第 8 步 A-6**: 等待 DNS 生效
  - 通常需要 5-10 分钟
  - 某些注册商可能需要更长时间（最多 48 小时）
- [ ] **第 9 步 A-7**: 返回 GSC 点击"验证"
  - 验证成功后会显示"已验证"

**方式二：URL 前缀验证（备选）**

- [ ] **第 3 步 B-1**: 选择"URL 前缀"选项卡
- [ ] **第 4 步 B-2**: 输入 `https://ecomafola.com`
- [ ] **第 5 步 B-3**: 选择验证方式（推荐 HTML 标签）
- [ ] **第 6 步 B-4**: 复制 HTML meta 标签
  - 格式：`<meta name="google-site-verification" content="xxxxxxxxxxxxxxx" />`
- [ ] **第 7 步 B-5**: 添加到网站首页 `<head>` 部分
  - **注意**: 这需要修改代码并重新部署
- [ ] **第 8 步 B-6**: 保存并部署网站
- [ ] **第 9 步 B-7**: 返回 GSC 点击"验证"

#### C. 提交 Sitemap

- [ ] **第 10 步**: 进入 Sitemap 页面
  - 左侧菜单 → 索引 → Sitemap

- [ ] **第 11 步**: 添加新 Sitemap
  - 点击"添加新 Sitemap"按钮

- [ ] **第 12 步**: 输入 Sitemap URL
  - 在"Sitemap"字段输入：`sitemap.xml`
  - 完整 URL：`https://ecomafola.com/sitemap.xml`

- [ ] **第 13 步**: 提交
  - 点击"提交"按钮

#### D. 验证提交

- [ ] **第 14 步**: 检查提交状态
  - 应显示：
    - Sitemap: `sitemap.xml`
    - 状态：✓ 成功
    - 已发现网址：15+ (首页 + 产品 + 分类 + 品牌页 + 博客)

### 预期结果

提交成功后，Sitemap 列表应显示：

```
┌─────────────────────────────────────────────────────┐
│ Sitemap 列表                                        │
├─────────────────────────────────────────────────────┤
│ sitemap.xml                                         │
│ 状态：✓ 成功                                        │
│ 已发现网址：15+                                     │
│ 已编入索引：待处理 (Google 需要 1-3 天)              │
│ 类型：XML                                           │
│ 大小：< 10MB                                        │
│ 最后读取：刚刚                                      │
└─────────────────────────────────────────────────────┘
```

### 后续检查

**24 小时后检查**:
- [ ] 访问"索引 → 网页"报告
- [ ] 查看"已编入索引"数量
- [ ] 预期：5-10 个页面索引

**3 天后检查**:
- [ ] 确认所有页面索引
- [ ] 检查是否有错误
- [ ] 预期：10-15 个页面索引

**1 周后检查**:
- [ ] 访问"效果"报告
- [ ] 查看展示次数和点击次数
- [ ] 预期：开始有少量展示

---

## 📋 任务 3: 验证 Rich Results（5 分钟）

### 步骤清单

- [ ] **第 1 步**: 访问 Rich Results Test
  - URL: https://search.google.com/test/rich-results

- [ ] **第 2 步**: 输入产品 URL
  - 输入：`https://ecomafola.com/product/samoan-handcrafted-coconut-bowl`

- [ ] **第 3 步**: 点击"测试"

- [ ] **第 4 步**: 检查结果
  - 应显示：
    - ✅ Product Schema
    - ✅ Review Schema
    - ✅ AggregateRating
    - ✅ HowTo Schema
    - ✅ BreadcrumbList

### 预期结果

```
┌─────────────────────────────────────────────┐
│ Rich Results Test                           │
├─────────────────────────────────────────────┤
│ 产品                                         │
│ ✓ 检测到的结构化数据类型                     │
│   • Product (产品)                          │
│   • Review (评价)                           │
│   • AggregateRating (综合评分)              │
│   • HowTo (操作指南)                        │
│   • BreadcrumbList (面包屑列表)             │
│                                             │
│ 所有项目均有效 ✓                            │
└─────────────────────────────────────────────┘
```

---

## 时间线总览

| 时间 | 操作 | 预期结果 |
|------|------|----------|
| **现在 (T+0)** | 启用 Vercel Analytics | 开始收集数据 |
| **现在 (T+0)** | 提交 GSC Sitemap | 开始索引流程 |
| **T+24 小时** | 检查 Vercel Analytics | 开始显示访客数据 |
| **T+24 小时** | 检查 GSC 索引状态 | 5-10 个页面索引 |
| **T+48 小时** | 检查 Speed Insights | 开始显示 Core Web Vitals |
| **T+3 天** | 检查 GSC | 10-15 个页面索引 |
| **T+1 周** | 检查 GSC 效果报告 | 开始有搜索展示 |
| **T+2-4 周** | 检查 GSC 排名 | 核心关键词开始有排名 |

---

## 常见问题

### Q1: Vercel Analytics 显示"无数据"

**原因**: 数据收集需要时间

**解决方案**:
- 等待 24-48 小时
- 确认网站有真实访问流量
- 检查是否正确启用

### Q2: GSC Sitemap 显示"无法读取"

**可能原因**:
- Sitemap URL 错误
- robots.txt 阻止 Google 访问
- Sitemap 格式错误

**解决方案**:
1. 确认 URL 正确：`https://ecomafola.com/sitemap.xml`
2. 在浏览器中打开 sitemap URL，确认能正常访问
3. 检查 robots.txt 是否有 `Disallow: /sitemap.xml`

### Q3: GSC 验证失败（DNS 方式）

**可能原因**:
- DNS 记录未生效
- TXT 记录值复制错误
- 主机记录填写错误

**解决方案**:
1. 等待更长时间（DNS 可能需要 48 小时全球生效）
2. 使用在线 DNS 工具检查 TXT 记录是否正确
3. 确认主机记录是 `@` 而不是 `www` 或其他

### Q4: Rich Results 测试失败

**可能原因**:
- Schema 格式错误
- 必需字段缺失

**解决方案**:
1. 使用 Schema Validator 验证：https://validator.schema.org/
2. 检查 JSON-LD 语法是否正确
3. 确认所有必需字段都存在

---

## 需要帮助？

### Google Search Console 支持

- **官方文档**: https://support.google.com/webmasters/answer/9128668
- **帮助社区**: https://support.google.com/webmasters/community
- **提交反馈**: 在 GSC 内点击"发送反馈"

### Vercel Analytics 支持

- **官方文档**: https://vercel.com/docs/analytics
- **技术支持**: https://vercel.com/support

---

## 执行完成后

完成以上步骤后，请：

1. **记录访问链接**:
   - Vercel Analytics: https://vercel.com/xuemeijia1998-5006s-projects/ecomafola-peace/analytics
   - Google Search Console: https://search.google.com/search-console

2. **设置定期检查**:
   - 每周检查 Vercel Analytics 性能数据
   - 每周检查 GSC 索引状态
   - 每月检查 GSC 效果报告

3. **记录基准数据** (用于后续对比):
   - 初始 LCP: ______ ms (在 Vercel Analytics 中查看)
   - 初始 INP: ______ ms
   - 初始 CLS: ______
   - 初始索引页面数：______

---

**指南版本**: 1.0  
**更新日期**: 2026 年 4 月 11 日  
**执行状态**: 待用户执行
