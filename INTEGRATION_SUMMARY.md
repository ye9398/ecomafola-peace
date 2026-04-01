# EcoMafola Peace - Shopify 集成完成总结

## ✅ 已完成的工作

### 1. Shopify API 客户端配置
- **文件位置**: `src/lib/shopify.ts`
- **功能**: 
  - 已配置 Shopify Storefront API 客户端
  - Store Domain: `ecomafola-peace.myshopify.com`
  - Storefront Token: `11c0b58bfdee65f96fbbd918d9aeeaa7`
  - API Version: `2025-01`
  - 包含 8 个预置 GraphQL 查询模板
  - 提供 5 个辅助函数（getProducts, getProductByHandle, createCart, addToCart, getCart）

### 2. Shopify 购物车 Hook
- **文件位置**: `src/hooks/useShopifyCart.ts`
- **功能**:
  - `cart` - 当前购物车状态
  - `addToCart(variantId, quantity)` - 添加商品到购物车
  - `removeFromCart(lineId)` - 移除购物车商品
  - `updateQuantity(lineId, quantity)` - 更新商品数量
  - `clearCart()` - 清空购物车
  - `redirectToCheckout()` - 跳转 Shopify 结算台
  - 自动持久化购物车 ID 到 localStorage
  - 错误处理和加载状态管理

### 3. 示例组件
- **文件位置**: `src/components/ShopifyProductList.example.tsx`
- **功能**:
  - 完整的 Shopify 商品列表展示
  - 图片画廊支持
  - 变体选择器
  - Add to Cart 按钮集成
  - 响应式网格布局
  - 加载和错误状态处理

### 4. 配置指南文档
- **文件位置**: `SHOPIFY_SETUP.md`
- **内容**:
  - npm 权限修复命令
  - SDK 安装步骤
  - 环境变量配置（可选）
  - 测试连接代码示例
  - 下一步建议

---

## ⚠️ 需要手动完成的步骤

由于当前环境的安全限制，以下操作需要在**本地终端**执行：

### 第一步：修复 npm 权限
```bash
sudo chown -R 501:20 "/Users/bowfan/.npm"
```

### 第二步：安装 Shopify SDK
```bash
cd /Users/bowfan/.real/users/user-b8e1054842397a96334f63a90388dc8a/workspace/ecomafola-peace
npm install @shopify/storefront-api-client --save
```

### 第三步（可选）：创建 .env 文件
如需使用环境变量而非硬编码配置，在项目根目录创建 `.env`：
```env
VITE_SHOPIFY_STORE_DOMAIN=ecomafola-peace.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=11c0b58bfdee65f96fbbd918d9aeeaa7
```

然后修改 `src/lib/shopify.ts` 使用环境变量：
```typescript
const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ecomafola-peace.myshopify.com';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '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';
```

---

## 🚀 集成到现有项目

### 方案 A：完全使用 Shopify（推荐）

1. **替换商品数据源**
   - 在 `HomePage.tsx` 或 `ProductListPage.tsx` 中
   - 使用 `getShopifyProducts()` 替代现有的 mock 数据
   - 参考 `ShopifyProductList.example.tsx`

2. **集成购物车**
   - 在 `App.tsx` 或主入口添加 `useShopifyCart` Provider
   - 替换现有的 `CartContext` 或使用双购物车系统（过渡期）
   - 修改 `SlideOverCheckout.tsx` 显示 Shopify 购物车数据

3. **结账流程**
   - 点击 "Proceed to Checkout" 时调用 `redirectToCheckout()`
   - 直接跳转 Shopify 官方结算台
   - 收款成功后可回调网站填写地址

### 方案 B：混合模式（过渡方案）

保留现有本地购物车，同时集成 Shopify：

```tsx
// 在 Products.tsx 中
import { useShopifyCart } from '../hooks/useShopifyCart';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addItem: addLocalItem } = useCart(); // 本地购物车
  const { addToCart: addShopifyItem } = useShopifyCart(); // Shopify 购物车

  const handleAddToCart = async () => {
    // 同时添加到两个购物车（过渡期同步）
    addLocalItem(product);
    if (product.shopifyVariantId) {
      await addShopifyItem(product.shopifyVariantId, 1);
    }
  };

  return<button onClick={handleAddToCart}>Add to Cart</button>;
}
```

---

## 📝 关键注意事项

### 1. Shopify Variant ID 映射
- Shopify 商品使用 `variantId` 而非商品 ID
- 需要在商品数据中保存 variant ID
- 可通过 `getProductByHandle` 获取所有 variants

### 2. 货币处理
- Shopify 返回的金额单位为字符串（如 `"38.00"`）
- 需要 `parseFloat()` 转换后计算
- 货币代码默认为 `USD`（可在 Shopify 后台设置）

### 3. 图片优化
- Shopify 返回的图片 URL 可添加尺寸参数：
  ```typescript
  const optimizedUrl = image.url.replace('.jpg', '_400x400.jpg');
  ```

### 4. 错误处理
- Shopify API 错误通过 `result.errors` 返回
- 建议统一错误提示 UI
- 网络错误自动 fallback 到本地 mock 数据

---

## 🎯 下一步建议

### 优先级 1：基础功能
- [ ] 在本地终端完成 npm 权限修复和 SDK 安装
- [ ] 测试 Shopify API 连接
- [ ] 将主页商品列表切换到 Shopify 数据源

### 优先级 2：购物车集成
- [ ] 集成 `useShopifyCart` 到现有购物车系统
- [ ] 更新 `SlideOverCheckout` 显示 Shopify 购物车
- [ ] 测试 Add to Cart → Review → Checkout 完整流程

### 优先级 3：商品详情页
- [ ] 创建 `ShopifyProductDetail.tsx`
- [ ] 实现变体选择器（颜色、尺寸等）
- [ ] 放大镜效果 + Shopify 图片库
- [ ] 库存状态实时显示

### 优先级 4：高级功能
- [ ] 商品搜索和过滤（使用 Shopify GraphQL）
- [ ] 商品集合页面（Collections）
- [ ] 订单同步（Shopify Webhooks）
- [ ] 客户账户集成（Shopify Customer API）

---

## 📞 测试清单

完成安装后，按以下顺序测试：

```bash
# 1. 启动开发服务器
npm run dev

# 2. 浏览器打开 http://localhost:5173

# 3. 控制台测试连接
# 在浏览器 DevTools Console 中运行:
import { shopifyClient, SHOPIFY_QUERIES } from './src/lib/shopify';
const test = async () => {
  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProducts, { variables: { first: 3 } });
  console.log('Shopify products:', data?.products?.edges);
};
test();
```

预期输出：看到 3 个 Shopify 商品信息

---

## 📂 新增文件清单

```
ecomafola-peace/
├── SHOPIFY_SETUP.md              # 配置指南
├── INTEGRATION_SUMMARY.md        # 本文档
└── src/
    ├── lib/
    │   └── shopify.ts            # Shopify API 客户端 ✨
    ├── hooks/
    │   └── useShopifyCart.ts     # 购物车 Hook ✨
    └── components/
        └── ShopifyProductList.example.tsx  # 示例组件 ✨
```

---

## 🔧 技术支持

遇到问题时的排查步骤：

1. **SDK 未安装错误**
   ```bash
   npm list @shopify/storefront-api-client
   # 如果未显示，重新安装
   npm install @shopify/storefront-api-client --save
   ```

2. **API 认证失败**
   - 检查 Storefront Token 是否正确
   - 确认 Shopify 后台已启用 Storefront API 访问
   - 路径：Settings → Apps and sales channels → Develop apps

3. **CORS 错误**
   - Shopify Storefront API 支持跨域请求
   - 确保 storeDomain 不含 `https://` 前缀

4. **TypeScript 类型错误**
   - 运行 `npm run build` 查看详细错误
   - 参考 `ShopifyProductList.example.tsx` 的类型定义

---

**集成状态**: 🟡 等待本地安装依赖  
**最后更新**: 2026-03-22  
**技术栈**: Vite + React + TypeScript + Tailwind CSS + Shopify Storefront API
