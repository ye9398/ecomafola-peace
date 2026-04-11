# Vercel Analytics 设置指南

**执行日期**: 2026 年 4 月 11 日  
**状态**: 待用户确认

---

## Vercel Analytics 配置方案

根据用户"不修改 UI 和文字"的约束，我提供两种配置方案：

### 方案 A：纯 Dashboard 监控（推荐 ✅）

**优点**:
- ✅ 无需修改代码
- ✅ 无需重新部署
- ✅ 立即启用
- ✅ 自动收集 Core Web Vitals 数据

**缺点**:
- ⚠️ 数据延迟 24-48 小时
- ⚠️ 仅汇总数据，无页面级详细分析

**启用步骤**:

1. **访问 Vercel Dashboard**
   ```
   https://vercel.com/xuemeijia1998-5006s-projects/ecomafola-peace/analytics
   ```

2. **启用 Analytics**
   - 点击 "Analytics" 标签
   - 点击 "Enable Web Analytics"
   - 确认启用

3. **查看数据**
   - Visitors: 访客统计
   - Page Views: 页面浏览
   - Speed: 性能指标（含 LCP, INP, CLS）

---

### 方案 B：代码集成（需要部署）

**优点**:
- ✅ 实时数据
- ✅ 页面级详细分析
- ✅ 自定义事件追踪

**缺点**:
- ⚠️ 需要修改代码
- ⚠️ 需要重新部署

**如果要实施方案 B**，需要添加以下代码：

#### 1. 安装依赖

```bash
npm install @vercel/analytics
```

#### 2. 修改 App.tsx

```tsx
// src/App.tsx
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      {/* ... existing code ... */}
      <Analytics />
    </>
  )
}
```

#### 3. 部署

```bash
npm run build
vercel deploy --prod
```

---

## 推荐执行步骤（方案 A - 无需代码修改）

### 步骤 1: 启用 Vercel Analytics

1. 访问：https://vercel.com/xuemeijia1998-5006s-projects/ecomafola-peace
2. 点击顶部 "Analytics" 标签
3. 点击 "Enable Web Analytics" 按钮

### 步骤 2: 启用 Speed Insights

1. 在同一页面找到 "Speed Insights" 部分
2. 点击 "Enable Speed Insights"
3. 等待数据收集（24-48 小时）

### 步骤 3: 监控 Core Web Vitals

启用后，您可以查看：

**指标仪表板**:
- LCP (Largest Contentful Paint)
- FID (First Input Delay) 
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)

**数据维度**:
- 按页面分组
- 按设备类型（桌面/移动）
- 按地理位置
- 按时间趋势

---

## Google Search Console 提交步骤

由于 GSC 提交需要用户手动操作（登录、验证），以下是详细步骤：

### 第 1 步：访问 Google Search Console

1. 打开：https://search.google.com/search-console
2. 使用 Google 账号登录（建议使用 ecomafola 官方账号）

### 第 2 步：添加网站属性

**推荐方式：域名验证**

1. 选择"域名"选项卡
2. 输入：`ecomafola.com`
3. 复制 DNS TXT 记录值
4. 登录域名注册商后台（如 GoDaddy、Namecheap）
5. 添加 TXT 记录：
   - 主机/名称：`@`
   - 值：`google-site-verification=xxxxxx`（复制 Google 提供的值）
   - TTL：自动或 3600
6. 等待 5-10 分钟 DNS 生效
7. 返回 GSC 点击"验证"

**备选方式：URL 前缀验证**

1. 选择"URL 前缀"选项卡
2. 输入：`https://ecomafola.com`
3. 选择 HTML 标签验证
4. 复制 meta 标签
5. 添加到网站首页 `<head>` 部分（需要修改代码并部署）

### 第 3 步：提交 Sitemap

1. 左侧菜单 → 索引 → Sitemap
2. 点击"添加新 Sitemap"按钮
3. 在"Sitemap"字段输入：`sitemap.xml`
4. 点击"提交"

**完整 URL**: `https://ecomafola.com/sitemap.xml`

### 第 4 步：验证提交

预期结果：
```
┌─────────────────────────────────────────┐
│ Sitemap: sitemap.xml                    │
│ 状态：✓ 成功                            │
│ 已发现网址：15+                         │
│ 已编入索引：待 Google 处理 (1-3 天)     │
└─────────────────────────────────────────┘
```

---

## 执行检查清单

### Vercel Analytics

- [ ] 访问 Vercel Dashboard
- [ ] 点击 Analytics 标签
- [ ] 启用 Web Analytics
- [ ] 启用 Speed Insights
- [ ] 等待 24-48 小时数据收集

### Google Search Console

- [ ] 登录 Google Search Console
- [ ] 添加网站属性（域名验证或 URL 前缀验证）
- [ ] 完成所有权验证
- [ ] 进入 Sitemap 页面
- [ ] 提交 sitemap.xml
- [ ] 验证提交成功状态

---

## 预期时间线

| 时间 | 预期状态 |
|------|----------|
| 启用后 24 小时 | Vercel Analytics 开始显示数据 |
| 启用后 48 小时 | Speed Insights 显示 Core Web Vitals |
| GSC 提交后 1-3 天 | Google 开始索引页面 |
| GSC 提交后 1 周 | 查看"效果"报告初步数据 |
| GSC 提交后 2-4 周 | 核心关键词开始有排名 |

---

## 需要用户执行的步骤

由于以下操作需要权限验证，需要您亲自执行：

### 必须用户执行

1. **Google Search Console 验证**
   - 需要登录 Google 账号
   - 需要域名 DNS 访问权限（如选择域名验证）
   - 或网站首页代码修改权限（如选择 HTML 标签验证）

2. **Vercel Analytics 启用**
   - 需要 Vercel 账号权限
   - 点击按钮即可启用

### 我可以协助的

如果用户授权修改代码，我可以：

1. 添加 `@vercel/analytics` 依赖
2. 修改 App.tsx 集成 Analytics 组件
3. 重新部署到 Vercel

但根据当前约束（不修改 UI），推荐先使用方案 A（纯 Dashboard）。

---

**参考文档**:
- [docs/GOOGLE-SEARCH-CONSOLE-SUBMIT-GUIDE.md](./docs/GOOGLE-SEARCH-CONSOLE-SUBMIT-GUIDE.md)
- https://vercel.com/docs/analytics
- https://support.google.com/webmasters/answer/9128668
