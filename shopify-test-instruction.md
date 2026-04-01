# Shopify API 连接测试指南

## 🔍 问题诊断步骤

### 步骤 1：确认 SDK 已安装

在**本地终端**运行：

```bash
cd /Users/bowfan/.real/users/user-b8e1054842397a96334f63a90388dc8a/workspace/ecomafola-peace
npm list @shopify/storefront-api-client
```

如果显示 `empty` 或报错，说明没有安装。请运行：

```bash
npm install @shopify/storefront-api-client
```

然后**重启开发服务器**（Ctrl+C 停止，再运行 `npm run dev`）

---

### 步骤 2：正确打开浏览器控制台

#### Chrome 浏览器（推荐）
1. 访问 http://localhost:4173
2. 按 **Cmd + Option + J** 直接打开控制台
3. 或者按 **Cmd + Option + I** → 点击顶部 **Console** 标签

#### Safari 浏览器
1. 先启用开发者菜单：**Safari → 设置 → 高级 → 勾选"显示'开发'菜单"**
2. 按 **Cmd + Option + C** 打开控制台

#### Firefox 浏览器
- 按 **Cmd + Option + K** 打开 Web 控制台

---

### 步骤 3：检查控制台筛选器

确保控制台顶部的筛选器设置正确：

1. **取消选中 "Errors only"** - 这个选项会隐藏普通日志
2. **取消选中 "Hide network messages"** 
3. **确保 "All levels" 被选中**
4. 在搜索框中**不要输入任何内容**

---

### 步骤 4：手动测试（如果自动测试没显示）

在控制台底部输入以下代码并按回车：

```javascript
fetch('https://ecomafola-peace.myshopify.com/api/2025-01/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': '11c0b58bfdee65f96fbbd918d9aeeaa7'
  },
  body: JSON.stringify({
    query: `{ products(first: 3) { edges { node { id title } } } }`
  })
})
.then(r => r.json())
.then(d => console.log('✅ Shopify 测试结果:', d))
.catch(e => console.error('❌ 错误:', e));
```

如果看到 `✅ Shopify 测试结果:` 且有商品数据，说明 API 连通正常！

---

## ✅ 预期输出示例

成功时应该看到：

```
✅ 接入成功！商品数据：(6) [{…}, {…}, {…}, {…}, {…}, {…}]
📦 共获取 6 个商品
```

展开数组可以看到每个商品的详细信息。

---

## ❌ 常见错误及解决方案

### 错误 1: "Failed to fetch" 或网络错误
**原因**: SDK 未安装或开发服务器需要重启  
**解决**: 
```bash
npm install @shopify/storefront-api-client
# 重启开发服务器
npm run dev
```

### 错误 2: "Unauthorized" 或 "Invalid token"
**原因**: Token 无效  
**解决**: 检查 Shopify 后台的 Storefront API token 是否正确

### 错误 3: 控制台完全空白
**原因**: 页面可能有 JavaScript 错误阻止加载  
**解决**: 
1. 刷新页面 (Cmd+R)
2. 查看控制台是否有红色错误信息
3. 检查 App.tsx 是否正确导入 shopifyClient

---

## 📞 需要帮助？

把控制台的**完整截图**或**错误信息**发给我，我会帮你分析具体问题。
