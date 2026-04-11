# Core Web Vitals 优化指南 - EcoMafola Peace

**优化日期**: 2026 年 4 月 11 日
**当前状态**: 待测量

---

## Core Web Vitals 指标说明

| 指标 | 目标 | 当前 | 状态 |
|------|------|------|------|
| **LCP** (Largest Contentful Paint) | < 2.5 秒 | 待测量 | ⏳ |
| **INP** (Interaction to Next Paint) | < 200 毫秒 | 待测量 | ⏳ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 待测量 | ⏳ |

---

## 已实施优化措施

### 1. 图片优化 ✅

- **Vite 图片优化插件**: 49% 体积减少
- **Shopify CDN**: 自动响应式图片
- **懒加载**: 非关键图片 lazy loading
- **预加载**: Hero 图片 priority loading

### 2. 代码分割 ✅

- **Vite 自动代码分割**: 1652 modules
- **动态导入**: Admin 页面懒加载
- **Vendor 分离**: react-vendor 独立 chunk

### 3. 结构化数据优化 ✅

- **HowTo Schema**: 保养指南结构化
- **Product Schema**: 产品信息
- **Review Schema**: 用户评价

---

## 待实施优化建议

### LCP 优化

1. **预加载关键图片**
```html
<link rel="preload" as="image" href="/hero-image.jpg" fetchpriority="high" />
```

2. **减少服务器响应时间**
- 使用 Vercel Edge Network（已配置）
- 启用 CDN 缓存（已配置）

3. **移除渲染阻塞资源**
- 关键 CSS 内联
- 非关键 JS 延迟加载

### INP 优化

1. **减少 JavaScript 执行时间**
- 长任务分割
- Web Worker 用于重计算

2. **优化事件处理器**
- 使用 debounce/throttle
- 避免频繁 DOM 操作

3. **减少第三方脚本**
- 审核所有第三方 JS
- 延迟非关键第三方

### CLS 优化

1. **设置图片尺寸**
```tsx
<OptimizedImage 
  src="..." 
  width={800} 
  height={600} 
  alt="..." 
/>
```

2. **为动态内容预留空间**
- 广告位预留高度
- 图片加载占位符

3. **避免在现有内容上方插入内容**
- 通知/弹窗在底部显示
- 懒加载内容预留空间

---

## 测量工具

### 1. PageSpeed Insights
https://pagespeed.web.dev/analysis/https-ecomafola-com

### 2. Vercel Analytics
https://vercel.com/xuemeijia1998-5006s-projects/ecomafola-peace/analytics

### 3. Chrome DevTools
- Lighthouse 面板
- Performance 面板

### 4. CrUX Dashboard
- Google Data Studio
- 真实用户体验数据

---

## 监控频率

- **每周**: Vercel Analytics 检查
- **每月**: PageSpeed Insights 完整测试
- **每季度**: 深度性能审计

---

## 目标值

| 指标 | 当前 | 3 个月目标 | 6 个月目标 |
|------|------|-----------|-----------|
| LCP | < 3s | < 2.5s | < 2.0s |
| INP | < 300ms | < 200ms | < 150ms |
| CLS | < 0.15 | < 0.1 | < 0.05 |

---

**下次测量**: 2026 年 4 月 18 日
**负责人**: 开发团队
