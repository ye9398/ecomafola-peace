# EcoMafola 订单追踪系统需求文档

**创建时间：** 2026-04-01  
**实现方式：** TDD（测试驱动开发）  
**参考架构：** Shopify Storefront API + Customer Account API

---

## 📋 功能概述

### 方案一：/track 访客追踪（Storefront API）

**特点：**
- ✅ 无需登录
- ✅ 输入订单号 + 邮箱查询
- ✅ 使用 Storefront API（公开 token）

**用户流程：**
1. 访问 `/track`
2. 输入订单号 + 邮箱
3. 点击查询
4. 显示订单状态和物流信息

---

### 方案二：/account/orders 登录后自动拉取（Customer Account API）

**特点：**
- ✅ 需要登录
- ✅ 自动显示用户所有订单
- ✅ 使用 Customer Account API（OAuth token）

**用户流程：**
1. 访问 `/account`
2. 自动显示订单列表
3. 点击订单查看详情

---

## 🎯 实现内容

### 前端页面
1. ✅ `src/pages/TrackOrderPage.tsx` - 订单追踪页（已存在，需优化）
2. ✅ `src/pages/AccountOrdersPage.tsx` - 我的订单页（新建）
3. ✅ `src/lib/customerAccount.ts` - Customer Account API 封装（新建）

### 路由配置
1. ✅ `/track` - 订单追踪路由
2. ✅ `/account/orders` - 我的订单路由

### 环境变量
```bash
# .env
VITE_STOREFRONT_TOKEN=11c0b58bfdee65f96fbbd918d9aeeaa7
```

---

## 🧪 测试要求（TDD）

### 测试文件
1. ✅ `src/tests/order-tracking.test.tsx` - 订单追踪测试

### 测试用例
1. ✅ TrackOrderPage 渲染测试
2. ✅ 订单查询成功测试
3. ✅ 订单查询失败测试
4. ✅ AccountOrdersPage 渲染测试
5. ✅ 未登录重定向测试
6. ✅ 订单数据加载测试

---

## 📊 验收标准

### 功能验收
- [ ] 访客可以通过订单号 + 邮箱查询订单
- [ ] 登录用户可以查看自己的订单列表
- [ ] 显示订单状态（付款/物流）
- [ ] 显示物流追踪信息
- [ ] 显示订单商品列表

### 代码质量
- [ ] 所有测试通过
- [ ] TypeScript 类型安全
- [ ] 错误处理完善
- [ ] 代码审查通过

---

## 🚀 部署检查清单

- [ ] 环境变量配置（VITE_STOREFRONT_TOKEN）
- [ ] 路由配置正确
- [ ] Shopify API 权限正确
- [ ] 测试通过
- [ ] 代码审查通过

---

**文档版本：** v1.0  
**创建者：** 多多哥哥
