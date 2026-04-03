import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createCart, addToCart, removeFromCart, updateCartLines, getCart as fetchCart } from '../lib/cart';
import { useGeoLocation, useShipping } from '../hooks/useShipping';

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      images: {
        edges: Array<{
          node: {
            url: string;
          };
        }>;
      };
    };
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ShippingResult {
  supported: boolean;
  country_code: string;
  total_shipping_usd?: number;
  estimated_days?: string;
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
  shipping: ShippingResult | null;
  shippingLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 获取地理位置和运费信息
  const { geo } = useGeoLocation();
  const { shipping, loading: shippingLoading } = useShipping(
    geo?.country_code || null,
    cart?.lines.edges.map(e => ({
      product_id: parseInt(e.node.merchandise.id.split('/').pop() || '0'),
      quantity: e.node.quantity
    })) || []
  );

  // 初始化时从 localStorage 恢复购物车
  useEffect(() => {
    const restoreCart = async () => {
      const savedCartId = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCartId) {
        try {
          console.log('Restoring cart from localStorage:', savedCartId);
          const restoredCart = await fetchCart(savedCartId);
          if (restoredCart) {
            setCart(restoredCart);
          }
        } catch (error) {
          console.error('Failed to restore cart:', error);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
      setIsInitialized(true);
    };

    restoreCart();
  }, []);

  // 购物车创建/更新后保存 cartId 到 localStorage
  useEffect(() => {
    if (!isInitialized) return;

    if (cart?.id) {
      localStorage.setItem(CART_STORAGE_KEY, cart.id);
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart, isInitialized]);

  // 计算购物车商品数量
  const count = cart?.lines?.edges?.reduce((sum, edge) => sum + (edge.node.quantity || 0), 0) || 0;

  // 检查购物车中是否已存在某个 variant
  const findExistingLine = useCallback((variantId: string) => {
    if (!cart) return null;
    return cart.lines.edges.find(
      edge => edge.node.merchandise.id === variantId
    );
  }, [cart]);

  // 添加商品到购物车（支持去重合并和乐观更新）
  const handleAddToCart = useCallback(async (variantId: string, quantity: number = 1) => {
    console.log('[CartContext] addToCart called:', { variantId, quantity, currentCart: cart?.id });
    const prevCart = cart;

    if (!cart) {
      console.log('[CartContext] No cart, creating new one');
      // 创建新购物车 - 乐观更新
      const optimisticCart: Cart = {
        id: `temp-cart-${Date.now()}`,
        checkoutUrl: '',
        lines: {
          edges: [{
            node: {
              id: `temp-line-${Date.now()}`,
              quantity,
              merchandise: {
                id: variantId,
                title: 'Loading...',
                price: { amount: '0.00', currencyCode: 'USD' },
                product: {
                  title: 'Loading...',
                  images: { edges: [] }
                }
              }
            }
          }]
        },
        cost: { totalAmount: { amount: '0.00', currencyCode: 'USD' } }
      };
      setCart(optimisticCart);
      console.log('[CartContext] Setting isOpen=true (new cart)');
      setIsOpen(true);

      try {
        console.log('[CartContext] Creating cart via API...');
        const newCart = await createCart([{ merchandiseId: variantId, quantity }]);
        console.log('[CartContext] Cart created:', newCart?.id);
        if (newCart) {
          setCart(newCart);
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
        setCart(prevCart); // 回滚
        throw error;
      }
    } else {
      console.log('[CartContext] Cart exists, checking for existing line');
      // 检查是否已存在相同 variant
      const existingLine = findExistingLine(variantId);
      console.log('[CartContext] existingLine:', existingLine);

      if (existingLine) {
        console.log('[CartContext] Variant exists in cart, updating quantity');
        // 已存在 - 乐观更新数量
        const newQuantity = existingLine.node.quantity + quantity;
        setCart({
          ...cart,
          lines: {
            edges: cart.lines.edges.map(edge =>
              edge.node.id === existingLine.node.id
                ? { ...edge, node: { ...edge.node, quantity: newQuantity } }
                : edge
            )
          }
        });
        console.log('[CartContext] Setting isOpen=true (existing variant, updated quantity)');
        setIsOpen(true);

        try {
          const updated = await updateCartLines(cart.id, [{
            id: existingLine.node.id,
            quantity: newQuantity
          }]);
          if (updated) {
            setCart(updated);
          }
        } catch (error) {
          console.error('Failed to update cart line:', error);
          setCart(prevCart); // 回滚
          setIsOpen(false); // 失败时关闭
          throw error;
        }
      } else {
        // 不存在 - 乐观添加新行
        const optimisticLine: CartLine = {
          id: 'temp-line-' + Date.now(),
          quantity,
          merchandise: {
            id: variantId,
            title: 'Loading...',
            price: { amount: '0.00', currencyCode: 'USD' },
            product: {
              title: 'Loading...',
              images: { edges: [] }
            }
          }
        };

        setCart({
          ...cart,
          lines: {
            edges: [...cart.lines.edges, { node: optimisticLine }]
          }
        });
        console.log('[CartContext] Setting isOpen=true (existing cart, new line)');
        setIsOpen(true);

        try {
          const updated = await addToCart(cart.id, variantId, quantity);
          if (updated) {
            setCart(updated);
          }
        } catch (error) {
          console.error('Failed to add to cart:', error);
          setCart(prevCart); // 回滚
          throw error;
        }
      }
    }
  }, [cart, findExistingLine]);

  // 从购物车移除商品
  const handleRemoveFromCart = useCallback(async (lineId: string) => {
    if (!cart) return;

    const prevCart = cart;

    // 乐观更新：立即从 UI 移除
    setCart({
      ...cart,
      lines: {
        edges: cart.lines.edges.filter(edge => edge.node.id !== lineId)
      }
    });

    try {
      const updated = await removeFromCart(cart.id, lineId);
      if (updated) {
        setCart(updated);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setCart(prevCart); // 回滚
      throw error;
    }
  }, [cart]);

  // 更新商品数量（支持 +/- 按钮）
  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;

    const prevCart = cart;

    if (quantity <= 0) {
      // 数量为 0 则移除
      await handleRemoveFromCart(lineId);
      return;
    }

    // 乐观更新 UI
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
      if (updated) {
        setCart(updated);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setCart(prevCart); // 回滚
      throw error;
    }
  }, [cart, handleRemoveFromCart]);

  const goToCheckout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart?.checkoutUrl]);

  return (
    <CartContext.Provider value={{
      cart,
      count,
      isOpen,
      setIsOpen,
      addToCart: handleAddToCart,
      removeFromCart: handleRemoveFromCart,
      updateQuantity,
      goToCheckout,
      shipping,
      shippingLoading
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
