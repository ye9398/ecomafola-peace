# EcoMafola 网站性能优化需求文档

**创建时间：** 2026-04-01  
**参考项目：** Vercel Commerce + Shopify Hydrogen  
**优化目标：** PageSpeed 性能分数 76 → 92-95  
**影响范围：** 全站性能优化（不影响 UI 展示）

---

## 📊 当前状况

| 指标 | 当前分数 | 目标分数 | 差距 |
|------|---------|---------|------|
| **性能** | 76/100 | 92-95/100 | +16-19 分 |
| **LCP** | ~3.5s | ~2.0s | -1.5 秒 |
| **FCP** | ~2.0s | ~0.9s | -1.1 秒 |
| **初始 JS** | 67KB | ~12KB | -82% |

---

## 🎯 P0 优先级优化（今天执行）

### 1️⃣ 预连接 Shopify API（5 分钟）

**参考：** Vercel Commerce 远程模式配置

**修改文件：** `index.html`

**实现内容：**
```html
<head>
  <!-- 字体预连接（已有） -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- 新增：Shopify API 预连接 -->
  <link rel="preconnect" href="https://ecomafola-peace.myshopify.com" crossorigin>
  <link rel="dns-prefetch" href="https://ecomafola-peace.myshopify.com">
  
  <!-- 新增：CDN 预连接 -->
  <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
</head>
```

**验收标准：**
- [ ] HTML 头部包含所有 preconnect 标签
- [ ] 标签格式正确（rel、href、crossorigin）
- [ ] 不影响页面渲染

**预期效果：** LCP 减少 330ms

---

### 2️⃣ 组件懒加载（30-60 分钟）

**参考：** Hydrogen 的 Suspense 模式 + Vercel Commerce 服务端组件

**修改文件：** 
- `src/App.tsx`
- `src/components/LoadingSkeleton.tsx`（新建）

**实现内容：**

**新建 LoadingSkeleton 组件：**
```typescript
// src/components/LoadingSkeleton.tsx
export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse min-h-screen bg-white">
      {/* Hero 占位 */}
      <div className="h-96 bg-gray-200" />
      
      {/* 内容占位 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  )
}
```

**修改 App.tsx：**
```typescript
import { lazy, Suspense } from 'react'
import LoadingSkeleton from './components/LoadingSkeleton'

// 高频访问页面（直接导入）
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'

// 低频访问页面（懒加载）
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const CartDrawer = lazy(() => import('./components/CartDrawer'))

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        
        {/* 懒加载路由 */}
        <Route 
          path="/products/:id" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <ProductDetailPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/checkout" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <CheckoutPage />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  )
}
```

**验收标准：**
- [ ] ProductDetailPage 使用 lazy 导入
- [ ] CheckoutPage 使用 lazy 导入
- [ ] CartDrawer 使用 lazy 导入
- [ ] 所有懒加载路由都有 Suspense 包裹
- [ ] LoadingSkeleton 显示正常
- [ ] 路由切换流畅

**预期效果：** 初始 JS 减少 44KB，FCP 提升 0.5-1 秒

---

### 3️⃣ 图片格式优化（30-60 分钟）

**参考：** Vercel Commerce next.config.ts 图片配置

**修改文件：**
- `vite.config.ts`
- `package.json`

**实现内容：**

**安装依赖：**
```bash
npm install -D vite-plugin-image-optimizer
```

**修改 vite.config.ts：**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // PNG 优化
      png: {
        quality: 80,
        compressionLevel: 9,
      },
      // JPEG 优化
      jpeg: {
        quality: 80,
        progressive: true,
      },
      // WebP 转换（现代浏览器）
      webp: {
        quality: 80,
        lossless: false,
      },
      // AVIF 转换（最新浏览器）
      avif: {
        quality: 70,
        compression: 'avif',
      },
      // SVG 优化
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 不内联小文件（利于缓存）
    assetsInlineLimit: 0,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'shopify': ['@shopify/storefront-api-client'],
          'icons': ['lucide-react'],
        },
      },
    },
  },
})
```

**验收标准：**
- [ ] 构建后图片转 WebP/AVIF 格式
- [ ] 图片质量在 70-80 之间
- [ ] 构建产物包含多种格式
- [ ] 图片体积减少 50% 以上

**预期效果：** 图片体积减少 50-80%，节省 185KB

---

## 🎯 P1 优先级优化（本周执行）

### 4️⃣ 代码分割优化（20 分钟）

**参考：** Hydrogen vite.config.ts 构建配置

**修改文件：** `vite.config.ts`

**实现内容：**
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Shopify API
          'shopify': ['@shopify/storefront-api-client'],
          // 图标库
          'icons': ['lucide-react'],
          // 工具函数
          'utils': ['clsx'],
        },
      },
    },
    // 分块大小限制
    chunkSizeWarningLimit: 500,
  },
})
```

**验收标准：**
- [ ] 构建产物包含多个 vendor chunk
- [ ] 每个 chunk 大小合理（<500KB）
- [ ] 无 chunk 大小警告

**预期效果：** 初始 JS 减少 30-40%

---

### 5️⃣ 长期缓存策略（10 分钟）

**参考：** Vercel Commerce + Hydrogen 缓存策略

**修改文件：** `vercel.json`

**实现内容：**
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**验收标准：**
- [ ] vercel.json 格式正确
- [ ] 静态资源缓存 1 年
- [ ] HTML 文件不缓存（必须重新验证）
- [ ] Vercel 部署成功

**预期效果：** 二次访问速度提升 50%

---

### 6️⃣ GraphQL/API 缓存（30 分钟）

**参考：** Hydrogen GraphQL 缓存策略

**修改文件：** `src/lib/shopify.ts`

**实现内容：**

```typescript
// 缓存配置
const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟
const CACHE_PREFIX = 'shopify:';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// 生成缓存键
function getCacheKey(prefix: string, variables: Record<string, any>): string {
  return `${CACHE_PREFIX}${prefix}:${JSON.stringify(variables)}`;
}

// 从缓存读取
function readFromCache<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cached) as CachedData<T>;
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

// 写入缓存
function writeToCache<T>(cacheKey: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

// 获取单个商品（带缓存）
export async function getProductByHandle(handle: string) {
  const cacheKey = getCacheKey('product', { handle });
  
  // 尝试从缓存读取
  const cached = readFromCache<typeof data>(cacheKey);
  if (cached) {
    console.log('[Shopify Cache] HIT:', cacheKey);
    return cached;
  }
  
  console.log('[Shopify Cache] MISS:', cacheKey);
  
  // API 调用
  const { data, errors } = await shopifyClient.request(
    SHOPIFY_QUERIES.getProductByHandle,
    { variables: { handle } }
  );
  
  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }
  
  // 写入缓存
  writeToCache(cacheKey, data);
  
  return data;
}

// 获取商品列表（带缓存）
export async function getProducts(first: number = 20) {
  const cacheKey = getCacheKey('products', { first });
  
  const cached = readFromCache<typeof data>(cacheKey);
  if (cached) {
    return cached;
  }
  
  const { data, errors } = await shopifyClient.request(
    SHOPIFY_QUERIES.getProducts,
    { variables: { first } }
  );
  
  if (errors) {
    console.error('Shopify API errors:', errors);
    return null;
  }
  
  writeToCache(cacheKey, data);
  
  return data;
}

// 清除缓存（用于后台更新后）
export function clearShopifyCache() {
  if (typeof window === 'undefined') return;
  
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
  
  console.log('[Shopify Cache] Cleared all cache');
}
```

**验收标准：**
- [ ] getProductByHandle 使用缓存
- [ ] getProducts 使用缓存
- [ ] 缓存 5 分钟后自动失效
- [ ] clearShopifyCache 函数可用
- [ ] 控制台输出缓存命中/未命中日志

**预期效果：** API 请求减少 50%，加载速度提升

---

### 7️⃣ 购物车乐观更新（30 分钟）

**参考：** Vercel Commerce add-to-cart.tsx

**修改文件：** 
- `src/context/CartContext.tsx`
- `src/lib/cart.ts`

**实现内容：**

**修改 CartContext.tsx：**
```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { createCart, addToCart, removeFromCart, updateCartLines } from '../lib/cart';

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      images: { edges: Array<{ node: { url: string } }> };
    };
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  lines: { edges: Array<{ node: CartLine }> };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
}

interface CartContextType {
  cart: Cart | null;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  goToCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 初始化：从 localStorage 读取 cartId
  useEffect(() => {
    const savedCartId = localStorage.getItem('cart_id');
    if (savedCartId) {
      getCart(savedCartId).then(setCart);
    }
  }, []);

  // 保存 cartId 到 localStorage
  useEffect(() => {
    if (cart?.id) {
      localStorage.setItem('cart_id', cart.id);
    } else {
      localStorage.removeItem('cart_id');
    }
  }, [cart]);

  // 计算购物车商品数量
  const count = cart?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0;

  // 添加商品到购物车（乐观更新 + 去重合并）
  const handleAddToCart = async (variantId: string, quantity: number = 1) => {
    const prevCart = cart;
    
    // 检查是否已存在相同 variant
    if (cart) {
      const existingLine = cart.lines.edges.find(
        edge => edge.node.merchandise.id === variantId
      );
      
      if (existingLine) {
        // 已存在：乐观更新数量
        const newQuantity = existingLine.node.quantity + quantity;
        setCart({
          ...cart,
          lines: {
            edges: cart.lines.edges.map(edge =>
              edge.node.id === existingLine.node.id
                ? { ...edge, node: { ...edge.node, quantity: newQuantity } }
                : edge
            ),
          },
        });
        
        try {
          // 后台调用 API
          const updated = await updateCartLines(cart.id, [
            { id: existingLine.node.id, quantity: newQuantity },
          ]);
          setCart(updated);
        } catch (error) {
          // 失败回滚
          setCart(prevCart);
          throw error;
        }
        return;
      }
    }
    
    // 不存在：创建新购物车或添加新行
    let currentCart = cart;
    
    if (!currentCart) {
      // 创建新购物车（乐观更新）
      const tempCart: Cart = {
        id: 'temp-' + Date.now(),
        checkoutUrl: '',
        lines: {
          edges: [{
            node: {
              id: 'temp-line-' + Date.now(),
              quantity,
              merchandise: { id: variantId, title: '', price: { amount: '0', currencyCode: 'USD' }, product: { title: '', images: { edges: [] } } },
            },
          }],
        },
        cost: { totalAmount: { amount: '0', currencyCode: 'USD' } },
      };
      setCart(tempCart);
      
      try {
        const newCart = await createCart([{ merchandiseId: variantId, quantity }]);
        setCart(newCart);
      } catch (error) {
        setCart(null);
        throw error;
      }
    } else {
      // 添加到现有购物车（乐观更新）
      const tempLine: CartLine = {
        id: 'temp-line-' + Date.now(),
        quantity,
        merchandise: { id: variantId, title: '', price: { amount: '0', currencyCode: 'USD' }, product: { title: '', images: { edges: [] } } },
      };
      
      setCart({
        ...cart,
        lines: {
          edges: [...cart.lines.edges, { node: tempLine }],
        },
      });
      
      try {
        const updated = await addToCart(cart.id, variantId, quantity);
        setCart(updated);
      } catch (error) {
        setCart(prevCart);
        throw error;
      }
    }
    
    setIsOpen(true);
  };

  // 从购物车移除商品
  const handleRemoveFromCart = async (lineId: string) => {
    if (!cart) return;
    
    const prevCart = cart;
    
    // 乐观更新
    setCart({
      ...cart,
      lines: {
        edges: cart.lines.edges.filter(edge => edge.node.id !== lineId),
      },
    });
    
    try {
      const updated = await removeFromCart(cart.id, lineId);
      setCart(updated);
    } catch (error) {
      setCart(prevCart);
      throw error;
    }
  };

  // 更新商品数量
  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;
    
    const prevCart = cart;
    
    // 数量为 0 则移除
    if (quantity <= 0) {
      await handleRemoveFromCart(lineId);
      return;
    }
    
    // 乐观更新
    setCart({
      ...cart,
      lines: {
        edges: cart.lines.edges.map(edge =>
          edge.node.id === lineId
            ? { ...edge, node: { ...edge.node, quantity } }
            : edge
        ),
      },
    });
    
    try {
      const updated = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
      setCart(updated);
    } catch (error) {
      setCart(prevCart);
      throw error;
    }
  };

  const goToCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      count,
      isOpen,
      setIsOpen,
      addToCart: handleAddToCart,
      removeFromCart: handleRemoveFromCart,
      updateQuantity: handleUpdateQuantity,
      goToCheckout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

**验收标准：**
- [ ] localStorage 持久化正常
- [ ] 乐观更新无感知延迟
- [ ] 相同 variant 自动合并数量
- [ ] 失败时自动回滚
- [ ] updateQuantity 函数可用
- [ ] 购物车浮窗自动打开

**预期效果：** 用户感知零延迟，体验流畅

---

## 🧪 测试要求（TDD）

### 测试文件：`src/tests/performance-optimization.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';

// Mock 数据
const mockVariant = {
  id: 'gid://shopify/ProductVariant/12345',
  title: '2-Piece Set',
  price: { amount: '29.99', currencyCode: 'USD' },
};

// 包装器组件
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <CartProvider>{children}</CartProvider>
  </BrowserRouter>
);

describe('Performance Optimization', () => {
  
  // 测试 1: localStorage 持久化
  describe('localStorage Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save cart ID to localStorage', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart(mockVariant.id);
      });
      
      await waitFor(() => {
        expect(localStorage.getItem('cart_id')).toBeTruthy();
      });
    });

    it('should restore cart from localStorage on init', async () => {
      localStorage.setItem('cart_id', 'test-cart-id');
      
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.cart).toBeTruthy();
      });
    });
  });

  // 测试 2: 去重合并
  describe('Deduplication', () => {
    it('should merge same variant quantities', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
        await result.current.addToCart(mockVariant.id, 1);
      });
      
      await waitFor(() => {
        const line = result.current.cart?.lines.edges.find(
          e => e.node.merchandise.id === mockVariant.id
        );
        expect(line?.node.quantity).toBe(2);
      });
    });
  });

  // 测试 3: 乐观更新
  describe('Optimistic Updates', () => {
    it('should update UI immediately', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      const beforeCount = result.current.count;
      
      await act(async () => {
        result.current.addToCart(mockVariant.id, 1);
      });
      
      // 立即检查（乐观更新）
      expect(result.current.count).toBeGreaterThan(beforeCount);
    });
  });

  // 测试 4: 数量更新
  describe('Quantity Update', () => {
    it('should update quantity via updateQuantity', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });
      
      const lineId = result.current.cart?.lines.edges[0]?.node.id;
      
      await act(async () => {
        await result.current.updateQuantity(lineId, 3);
      });
      
      await waitFor(() => {
        const line = result.current.cart?.lines.edges[0]?.node;
        expect(line?.quantity).toBe(3);
      });
    });

    it('should remove item when quantity set to 0', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });
      
      const lineId = result.current.cart?.lines.edges[0]?.node.id;
      
      await act(async () => {
        await result.current.updateQuantity(lineId, 0);
      });
      
      await waitFor(() => {
        expect(result.current.cart?.lines.edges).toHaveLength(0);
      });
    });
  });
});
```

---

## ✅ 验收清单

### 代码层面
- [ ] 所有测试通过（15+ 个测试用例）
- [ ] TypeScript 类型安全
- [ ] ESLint 无警告
- [ ] 代码格式化（Prettier）

### 功能层面
- [ ] preconnect 标签正确
- [ ] 组件懒加载正常
- [ ] 图片格式优化完成
- [ ] 代码分割合理
- [ ] 缓存策略生效
- [ ] API 缓存正常
- [ ] 购物车乐观更新流畅

### 性能层面
- [ ] PageSpeed 性能分数 ≥ 90
- [ ] LCP < 2.5s
- [ ] FCP < 1.5s
- [ ] 初始 JS < 20KB

---

## 📁 修改的文件列表

| 文件 | 修改内容 | 优先级 |
|------|---------|--------|
| `index.html` | 添加 preconnect 标签 | P0 |
| `src/App.tsx` | 组件懒加载 | P0 |
| `src/components/LoadingSkeleton.tsx` | 新建加载占位组件 | P0 |
| `vite.config.ts` | 图片优化 + 代码分割 | P0 |
| `vercel.json` | 长期缓存策略 | P1 |
| `src/lib/shopify.ts` | API 缓存层 | P1 |
| `src/context/CartContext.tsx` | 乐观更新 + 持久化 | P1 |
| `src/lib/cart.ts` | updateCartLines 函数 | P1 |
| `src/tests/performance-optimization.test.tsx` | 新增测试文件 | P0 |

---

## 🚀 执行流程

### 第 1 步：编写测试（TDD）
```bash
# 创建测试文件
src/tests/performance-optimization.test.tsx

# 运行测试（初始应该失败）
npm run test:run -- performance-optimization
```

### 第 2 步：实现 P0 优化
1. 修改 index.html（preconnect）
2. 修改 App.tsx（懒加载）
3. 修改 vite.config.ts（图片优化）

### 第 3 步：实现 P1 优化
4. 修改 vercel.json（缓存策略）
5. 修改 shopify.ts（API 缓存）
6. 修改 CartContext.tsx（乐观更新）

### 第 4 步：运行测试
```bash
npm run test:run -- performance-optimization
# 确认所有测试通过
```

### 第 5 步：代码审查
```bash
/code-review
```

### 第 6 步：验证
```bash
/verify
```

### 第 7 步：构建和部署
```bash
npm run build
vercel --prod
```

---

## 📊 验证工具

### 自动验证
- Vitest 测试套件
- ESLint 代码检查
- TypeScript 类型检查

### 手动验证
1. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - 测试：https://ecomafola.com

2. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results

3. **WebPageTest**
   - URL: https://www.webpagetest.org/

---

**文档版本：** v1.0  
**创建者：** 多多哥哥  
**状态：** 待执行
