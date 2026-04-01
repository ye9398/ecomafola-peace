# Shopify Storefront API 配置指南

## 第一步：修复 npm 权限问题

在终端执行以下命令：

```bash
sudo chown -R 501:20 "/Users/bowfan/.npm"
```

## 第二步：安装 Shopify SDK

在项目根目录执行：

```bash
cd /Users/bowfan/.real/users/user-b8e1054842397a96334f63a90388dc8a/workspace/ecomafola-peace
npm install @shopify/storefront-api-client --save
```

## 第三步：创建环境变量文件（可选）

项目根目录创建 `.env` 文件：

```env
VITE_SHOPIFY_STORE_DOMAIN=ecomafola-peace.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=11c0b58bfdee65f96fbbd918d9aeeaa7
```

**注意**：当前代码已将配置直接写在 `src/lib/shopify.ts` 中，你可以暂时跳过此步骤。

## 第四步：测试连接

在任意组件中添加测试代码：

```tsx
import { shopifyClient, SHOPIFY_QUERIES } from '../lib/shopify';

async function testShopify() {
  const { data, errors } = await shopifyClient.request(SHOPIFY_QUERIES.getProducts, {
    variables: { first: 6 }
  });
  
  if (errors) {
    console.error('Shopify API errors:', errors);
    return;
  }
  
  console.log('Products:', data?.products?.edges);
}

// 在 useEffect 或事件处理函数中调用
testShopify();
```

## 已创建的 Shopify 辅助函数

`src/lib/shopify.ts` 已包含以下开箱即用的函数：

- `getProducts(first: number)` - 获取商品列表
- `getProductByHandle(handle: string)` - 获取单个商品详情
- `createCart(lines)` - 创建购物车
- `addToCart(cartId, lines)` - 添加商品到购物车
- `getCart(cartId)` - 获取购物车信息

## GraphQL 查询模板

已预置以下常用查询：

- `SHOPIFY_QUERIES.getProducts` - 商品列表查询
- `SHOPIFY_QUERIES.getProductByHandle` - 单个商品查询
- `SHOPIFY_QUERIES.getCollections` - 商品集合查询
- `SHOPIFY_QUERIES.createCart` - 创建购物车
- `SHOPIFY_QUERIES.addToCart` - 添加到购物车
- `SHOPIFY_QUERIES.updateCartLines` - 更新购物车数量
- `SHOPIFY_QUERIES.removeFromCart` - 移除购物车商品
- `SHOPIFY_QUERIES.getCart` - 获取购物车详情

## 下一步建议

1. 完成上述配置后，可以在 `HomePage.tsx` 或 `ProductListPage.tsx` 中集成 Shopify 商品数据
2. 将现有的 mock 商品数据替换为 Shopify 真实数据
3. 使用 `createCart` 和 `addToCart` 函数优化购物车流程
4. 通过 `checkoutUrl` 直接跳转 Shopify 结算台
