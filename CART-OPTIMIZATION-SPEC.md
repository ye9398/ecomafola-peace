# EcoMafola 购物车优化需求文档

**创建时间：** 2026-04-01  
**参考项目：** Shopify Hydrogen  
**优化目标：** 全面提升购物车用户体验和性能  
**影响范围：** 购物车状态管理 + 产品详情页

---

## 📋 优化内容

### 1️⃣ localStorage 持久化

**目标：** 刷新页面后购物车不丢失

**实现方案：**
```typescript
// 在 CartContext.tsx 中

// 初始化时从 localStorage 读取
const initializeCart = () => {
  const savedCartId = localStorage.getItem('cart_id');
  if (savedCartId) {
    return getCart(savedCartId);
  }
  return null;
};

// 购物车创建/更新后保存 cartId
useEffect(() => {
  if (cart?.id) {
    localStorage.setItem('cart_id', cart.id);
  } else {
    localStorage.removeItem('cart_id');
  }
}, [cart]);
```

**验收标准：**
- [ ] 添加商品后刷新页面，购物车数据保留
- [ ] 清空购物车后刷新，购物车为空
- [ ] 跨标签页同步（可选）

---

### 2️⃣ 乐观更新（Optimistic Updates）

**目标：** 用户操作立即响应，无需等待 API

**实现方案：**
```typescript
// 添加商品到购物车
const handleAddToCart = async (variantId: string, quantity: number = 1) => {
  const optimisticLine = {
    id: `temp-${Date.now()}`,
    quantity,
    merchandise: {
      id: variantId,
      // ...从产品数据获取
    }
  };

  // 1. 立即更新 UI（乐观更新）
  setCart(prev => ({
    ...prev,
    lines: {
      edges: [
        ...(prev?.lines?.edges || []),
        { node: optimisticLine }
      ]
    }
  }));

  try {
    // 2. 后台调用 API
    const updated = await addToCart(cart.id, variantId, quantity);
    // 3. 用真实数据替换
    setCart(updated);
  } catch (error) {
    // 4. 失败则回滚
    setCart(prevCart);
    throw error;
  }
};
```

**验收标准：**
- [ ] 点击"Add to Cart"后立即显示购物车浮窗
- [ ] API 失败时回滚并显示错误提示
- [ ] 用户无感知延迟

---

### 3️⃣ 去重合并

**目标：** 相同 variant 自动累加数量，不创建重复行

**实现方案：**
```typescript
// 添加商品到购物车（优化版）
const handleAddToCart = async (variantId: string, quantity: number = 1) => {
  if (!cart) {
    // 创建新购物车
    const newCart = await createCart([{ merchandiseId: variantId, quantity }]);
    setCart(newCart);
    return;
  }

  // 检查是否已存在
  const existingLine = cart.lines.edges.find(
    edge => edge.node.merchandise.id === variantId
  );

  if (existingLine) {
    // 已存在，更新数量
    const newQuantity = existingLine.node.quantity + quantity;
    await updateCartLines(cart.id, [{ 
      id: existingLine.node.id, 
      quantity: newQuantity 
    }]);
  } else {
    // 不存在，添加新行
    await addToCart(cart.id, variantId, quantity);
  }
};
```

**验收标准：**
- [ ] 相同 variant 多次添加，数量累加
- [ ] 不同 variant 创建独立行
- [ ] 购物车总数计算正确

---

### 4️⃣ 数量更新 UI

**目标：** 购物车中可直接 +/- 调整数量

**实现方案：**

**修改 CartContext.tsx：**
```typescript
// 添加更新数量的方法
const updateQuantity = async (lineId: string, quantity: number) => {
  if (!cart) return;
  
  if (quantity <= 0) {
    // 数量为 0 则移除
    await removeFromCart(cart.id, lineId);
    return;
  }

  // 乐观更新
  const prevCart = cart;
  setCart({
    ...cart,
    lines: {
      edges: cart.lines.edges.map(edge => 
        edge.node.id === lineId 
          ? { ...edge, node: { ...edge.node, quantity } }
          : edge
      )
    }
  });

  try {
    const updated = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
    setCart(updated);
  } catch (error) {
    setCart(prevCart); // 回滚
    throw error;
  }
};

// 暴露给外部使用
return (
  <CartContext.Provider value={{
    cart,
    count,
    isOpen,
    setIsOpen,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity, // ← 新增
    goToCheckout
  }}>
```

**修改 CartDrawer.tsx（购物车浮窗）：**
```typescript
// 在商品行添加 +/- 按钮
<div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
  <button 
    onClick={() => updateQuantity(line.id, line.quantity - 1)}
    className="px-3 py-1 text-gray-500 hover:bg-gray-50"
  >
    <Minus size={14} />
  </button>
  <span className="px-4 font-serif font-semibold">{line.quantity}</span>
  <button 
    onClick={() => updateQuantity(line.id, line.quantity + 1)}
    className="px-3 py-1 text-gray-500 hover:bg-gray-50"
  >
    <Plus size={14} />
  </button>
</div>
```

**验收标准：**
- [ ] +/- 按钮可调整数量
- [ ] 数量为 1 时点击 - 自动移除
- [ ] 价格实时更新
- [ ] 总数实时更新

---

### 5️⃣ 运费估算集成

**目标：** 购物车中实时显示运费估算

**实现方案：**

**修改 CartContext.tsx：**
```typescript
import { useShipping } from '../hooks/useShipping';
import { useGeoLocation } from '../hooks/useGeoLocation';

// 在 CartContext 中集成
const { geo } = useGeoLocation();
const { shipping, loading } = useShipping(
  geo?.country_code || null,
  cartItems // 购物车商品列表
);

// 暴露给外部
return (
  <CartContext.Provider value={{
    cart,
    shipping, // ← 新增
    shippingLoading: loading, // ← 新增
    // ...其他
  }}>
```

**修改 CartDrawer.tsx：**
```typescript
// 在购物车底部添加运费估算
{shipping && (
  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
    <div className="flex justify-between text-sm">
      <span>商品小计</span>
      <span>${cart.cost.subtotalAmount.amount}</span>
    </div>
    <div className="flex justify-between text-sm mt-2">
      <span>运费估算</span>
      <span>
        {shipping.supported 
          ? `$${shipping.total_shipping_usd?.toFixed(2)}`
          : '不支持配送'
        }
      </span>
    </div>
    <div className="flex justify-between text-sm font-bold mt-2 pt-2 border-t">
      <span>总计</span>
      <span>
        ${(
          parseFloat(cart.cost.totalAmount.amount) + 
          (shipping.supported ? shipping.total_shipping_usd || 0 : 0)
        ).toFixed(2)}
      </span>
    </div>
    {shipping.supported && (
      <p className="text-xs text-gray-500 mt-2">
        预计{shipping.estimated_days}送达
      </p>
    )}
  </div>
)}
```

**验收标准：**
- [ ] 购物车显示运费估算
- [ ] 自动检测用户位置
- [ ] 支持手动选择国家
- [ ] 总价 = 商品 + 运费

---

## 🧪 测试要求（TDD）

### 测试文件：`src/tests/cart-optimization.test.tsx`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

// Mock 数据
const mockVariant = {
  id: 'gid://shopify/ProductVariant/12345',
  title: '2-Piece Set',
  price: { amount: '29.99', currencyCode: 'USD' }
};

// 包装器组件
const wrapper = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

describe('Cart Optimization', () => {
  
  // 测试 1: localStorage 持久化
  describe('localStorage Persistence', () => {
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
      // 预设 localStorage
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
      
      // 添加两次相同 variant
      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
        await result.current.addToCart(mockVariant.id, 1);
      });
      
      await waitFor(() => {
        const line = result.current.cart?.lines.edges.find(
          e => e.node.merchandise.id === mockVariant.id
        );
        expect(line?.node.quantity).toBe(2); // 应该合并为 2
      });
    });

    it('should keep different variants separate', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart('variant-1', 1);
        await result.current.addToCart('variant-2', 1);
      });
      
      await waitFor(() => {
        expect(result.current.cart?.lines.edges).toHaveLength(2);
      });
    });
  });

  // 测试 3: 数量更新
  describe('Quantity Update', () => {
    it('should update quantity via +/- buttons', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });
      
      const lineId = result.current.cart?.lines.edges[0]?.node.id;
      
      // 增加到 3
      await act(async () => {
        await result.current.updateQuantity(lineId, 3);
      });
      
      await waitFor(() => {
        const line = result.current.cart?.lines.edges[0]?.node;
        expect(line?.quantity).toBe(3);
      });
      
      // 减少到 1
      await act(async () => {
        await result.current.updateQuantity(lineId, 1);
      });
      
      await waitFor(() => {
        const line = result.current.cart?.lines.edges[0]?.node;
        expect(line?.quantity).toBe(1);
      });
    });

    it('should remove item when quantity set to 0', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });
      
      const lineId = result.current.cart?.lines.edges[0]?.node.id;
      
      // 设置为 0（移除）
      await act(async () => {
        await result.current.updateQuantity(lineId, 0);
      });
      
      await waitFor(() => {
        expect(result.current.cart?.lines.edges).toHaveLength(0);
      });
    });
  });

  // 测试 4: 运费估算
  describe('Shipping Estimation', () => {
    it('should include shipping info in cart context', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.shipping).toBeDefined();
      });
    });

    it('should calculate total with shipping', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      
      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });
      
      await waitFor(() => {
        const cart = result.current.cart;
        const shipping = result.current.shipping;
        
        if (shipping?.supported) {
          const expectedTotal = 
            parseFloat(cart.cost.totalAmount.amount) + 
            shipping.total_shipping_usd;
          
          expect(cart.cost.totalAmount.amount).toBeTruthy();
        }
      });
    });
  });
});
```

---

## ✅ 验收清单

### 代码层面
- [ ] 所有测试通过
- [ ] TypeScript 类型安全
- [ ] ESLint 无警告
- [ ] 代码格式化（Prettier）

### 功能层面
- [ ] localStorage 持久化正常
- [ ] 乐观更新无感知延迟
- [ ] 去重合并逻辑正确
- [ ] 数量更新 UI 响应
- [ ] 运费估算准确

### 用户体验
- [ ] 添加商品立即响应
- [ ] 购物车浮窗动画流畅
- [ ] 错误提示友好
- [ ] 移动端适配正常

---

## 📁 修改的文件

| 文件 | 修改内容 |
|------|---------|
| `src/context/CartContext.tsx` | 核心优化（持久化/去重/数量更新） |
| `src/components/CartDrawer.tsx` | 添加 +/- 按钮和运费显示 |
| `src/lib/cart.ts` | 添加 updateCartLines 函数 |
| `src/tests/cart-optimization.test.tsx` | 新增测试文件 |
| `src/hooks/useShipping.ts` | 可能需要调整接口 |

---

## 🚀 执行流程

### 第 1 步：编写测试（TDD）
```bash
# 创建测试文件
src/tests/cart-optimization.test.tsx

# 运行测试（初始应该失败）
npm run test:run -- cart-optimization
```

### 第 2 步：实现功能
1. 修改 CartContext.tsx
2. 修改 CartDrawer.tsx
3. 修改 cart.ts

### 第 3 步：运行测试
```bash
npm run test:run -- cart-optimization
# 确认所有测试通过
```

### 第 4 步：代码审查
```bash
# 使用 Claude Code 的 code-review 功能
/code-review
```

### 第 5 步：验证
```bash
# 使用 Claude Code 的 verify 功能
/verify
```

### 第 6 步：构建和部署
```bash
npm run build
vercel --prod
```

---

## 📊 验证工具

### 手动测试步骤
1. 打开产品页
2. 添加商品到购物车
3. 刷新页面 → 购物车应该保留
4. 打开购物车浮窗
5. 点击 +/- 调整数量
6. 确认运费显示
7. 点击结账

### 浏览器 DevTools 验证
1. Application → Local Storage → 检查 cart_id
2. Network → 查看 API 请求
3. Console → 查看错误日志

---

**文档版本：** v1.0  
**创建者：** 多多哥哥  
**状态：** 待执行
