import { useState, useEffect, useCallback } from 'react';
import { 
  shopifyClient, 
  SHOPIFY_QUERIES,
  getProducts as shopifyGetProducts,
  getProductByHandle as shopifyGetProductByHandle,
} from '../lib/shopify';

/**
 * Shopify 购物车 Hook
 * 
 * 使用示例:
 * ```tsx
 * const { cart, addToCart, removeFromCart, updateQuantity, isLoading, error } = useShopifyCart();
 * 
 * // 添加商品到购物车
 * await addToCart(variantId, quantity);
 * 
 * // 跳转到 Shopify 结算台
 * window.open(cart?.checkoutUrl, '_blank');
 * ```
 */
export interface ShopifyCartItem {
  id: string;
  variantId: string;
  title: string;
  price: number;
  currencyCode: string;
  image?: {
    url: string;
    altText?: string;
  };
  quantity: number;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  items: ShopifyCartItem[];
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  };
}

export function useShopifyCart() {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从 localStorage 恢复购物车 ID
  useEffect(() => {
    const savedCartId = localStorage.getItem('shopify_cart_id');
    if (savedCartId) {
      loadCart(savedCartId);
    }
  }, []);

  // 保存购物车 ID 到 localStorage
  const saveCartId = useCallback((cartId: string) => {
    localStorage.setItem('shopify_cart_id', cartId);
  }, []);

  // 加载购物车
  const loadCart = async (cartId: string) => {
    try {
      setIsLoading(true);
      const result = await shopifyClient.request(SHOPIFY_QUERIES.getCart, {
        variables: { cartId }
      });

      if (result.errors) {
        console.error('Failed to load cart:', result.errors);
        setError('Failed to load cart');
        return;
      }

      const shopifyCart = result.data?.cart;
      if (shopifyCart) {
        setCart({
          id: shopifyCart.id,
          checkoutUrl: shopifyCart.checkoutUrl,
          items: shopifyCart.lines?.edges?.map((edge: any) => ({
            id: edge.node.id,
            variantId: edge.node.merchandise.id,
            title: edge.node.merchandise.title,
            price: parseFloat(edge.node.merchandise.price.amount),
            currencyCode: edge.node.merchandise.price.currencyCode,
            image: edge.node.merchandise.product?.images?.edges?.[0]?.node || undefined,
            quantity: edge.node.quantity,
          })) || [],
          totalAmount: shopifyCart.cost.totalAmount,
          subtotalAmount: shopifyCart.cost.subtotalAmount,
        });
        saveCartId(shopifyCart.id);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新购物车
  const createNewCart = async () => {
    try {
      setIsLoading(true);
      const result = await shopifyClient.request(SHOPIFY_QUERIES.createCart, {
        variables: { input: { lines: [] } }
      });

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to create cart');
      }

      const newCart = result.data?.cartCreate?.cart;
      if (newCart) {
        setCart({
          id: newCart.id,
          checkoutUrl: newCart.checkoutUrl,
          items: [],
          totalAmount: newCart.cost.totalAmount,
          subtotalAmount: newCart.cost.subtotalAmount,
        });
        saveCartId(newCart.id);
        return newCart.id;
      }
    } catch (err) {
      console.error('Error creating cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to create cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 添加商品到购物车
  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      let cartId = cart?.id;

      // 如果没有购物车，先创建一个
      if (!cartId) {
        cartId = await createNewCart();
        if (!cartId) throw new Error('Failed to create cart');
      }

      const result = await shopifyClient.request(SHOPIFY_QUERIES.addToCart, {
        variables: {
          cartId,
          lines: [{ merchandiseId: variantId, quantity }]
        }
      });

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to add to cart');
      }

      const updatedCart = result.data?.cartLinesAdd?.cart;
      if (updatedCart) {
        setCart({
          id: updatedCart.id,
          checkoutUrl: updatedCart.checkoutUrl,
          items: updatedCart.lines?.edges?.map((edge: any) => ({
            id: edge.node.id,
            variantId: edge.node.merchandise.id,
            title: edge.node.merchandise.title,
            price: parseFloat(edge.node.merchandise.price.amount),
            currencyCode: edge.node.merchandise.price.currencyCode,
            image: edge.node.merchandise.product?.images?.edges?.[0]?.node || undefined,
            quantity: edge.node.quantity,
          })) || [],
          totalAmount: updatedCart.cost.totalAmount,
          subtotalAmount: updatedCart.cost.subtotalAmount,
        });
      }

      return updatedCart;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 更新商品数量
  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;

    try {
      setIsLoading(true);

      // 如果数量为 0，移除商品
      if (quantity <= 0) {
        await removeFromCart(lineId);
        return;
      }

      const result = await shopifyClient.request(SHOPIFY_QUERIES.updateCartLines, {
        variables: {
          cartId: cart.id,
          lines: [{ id: lineId, quantity }]
        }
      });

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to update cart');
      }

      const updatedCart = result.data?.cartLinesUpdate?.cart;
      if (updatedCart) {
        setCart({
          id: updatedCart.id,
          checkoutUrl: updatedCart.checkoutUrl,
          items: updatedCart.lines?.edges?.map((edge: any) => ({
            id: edge.node.id,
            variantId: edge.node.merchandise.id,
            title: edge.node.merchandise.title,
            price: parseFloat(edge.node.merchandise.price.amount),
            currencyCode: edge.node.merchandise.price.currencyCode,
            image: edge.node.merchandise.product?.images?.edges?.[0]?.node || undefined,
            quantity: edge.node.quantity,
          })) || [],
          totalAmount: updatedCart.cost.totalAmount,
          subtotalAmount: updatedCart.cost.subtotalAmount,
        });
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to update cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 从购物车移除商品
  const removeFromCart = async (lineId: string) => {
    if (!cart?.id) return;

    try {
      setIsLoading(true);

      const result = await shopifyClient.request(SHOPIFY_QUERIES.removeFromCart, {
        variables: {
          cartId: cart.id,
          lineIds: [lineId]
        }
      });

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to remove from cart');
      }

      const updatedCart = result.data?.cartLinesRemove?.cart;
      if (updatedCart) {
        setCart({
          id: updatedCart.id,
          checkoutUrl: updatedCart.checkoutUrl,
          items: updatedCart.lines?.edges?.map((edge: any) => ({
            id: edge.node.id,
            variantId: edge.node.merchandise.id,
            title: edge.node.merchandise.title,
            price: parseFloat(edge.node.merchandise.price.amount),
            currencyCode: edge.node.merchandise.price.currencyCode,
            image: edge.node.merchandise.product?.images?.edges?.[0]?.node || undefined,
            quantity: edge.node.quantity,
          })) || [],
          totalAmount: updatedCart.cost.totalAmount,
          subtotalAmount: updatedCart.cost.subtotalAmount,
        });
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 清空购物车
  const clearCart = async () => {
    if (!cart?.id || cart.items.length === 0) return;

    try {
      setIsLoading(true);

      const lineIds = cart.items.map(item => item.id);
      const result = await shopifyClient.request(SHOPIFY_QUERIES.removeFromCart, {
        variables: {
          cartId: cart.id,
          lineIds
        }
      });

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Failed to clear cart');
      }

      const updatedCart = result.data?.cartLinesRemove?.cart;
      if (updatedCart) {
        setCart({
          id: updatedCart.id,
          checkoutUrl: updatedCart.checkoutUrl,
          items: [],
          totalAmount: updatedCart.cost.totalAmount,
          subtotalAmount: updatedCart.cost.subtotalAmount,
        });
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 跳转到 Shopify 结算台
  const redirectToCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    redirectToCheckout,
    isLoading,
    error,
    itemCount: cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    total: cart?.totalAmount.amount || '0',
    currencyCode: cart?.totalAmount.currencyCode || 'USD',
  };
}

// 辅助函数：获取 Shopify 商品列表
export async function getShopifyProducts(first: number = 20) {
  return await shopifyGetProducts(first);
}

// 辅助函数：获取单个商品详情
export async function getShopifyProductByHandle(handle: string) {
  return await shopifyGetProductByHandle(handle);
}
