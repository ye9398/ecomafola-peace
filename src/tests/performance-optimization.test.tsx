import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';
import { BrowserRouter } from 'react-router-dom';

// Mock shipping hooks
vi.mock('../hooks/useShipping', () => ({
  useGeoLocation: () => ({
    geo: { country_code: 'US', country: 'United States', city: 'New York', ip: '1.2.3.4' },
    loading: false,
    error: null
  }),
  useShipping: () => ({
    shipping: {
      supported: true,
      country_code: 'US',
      total_shipping_usd: 5.99,
      estimated_days: '3-5'
    },
    loading: false
  })
}));

// Mock cart API - must use factory function
vi.mock('../lib/cart', async () => {
  const actual = await vi.importActual('../lib/cart');
  return {
    ...actual,
    createCart: vi.fn(async (items: Array<{ merchandiseId: string; quantity: number }>) => {
      const item = items[0];
      return {
        id: 'gid://shopify/Cart/test-cart-123',
        checkoutUrl: 'https://checkout.shopify.com/test',
        lines: {
          edges: [{
            node: {
              id: `line-${item?.merchandiseId}-${Date.now()}`,
              quantity: item?.quantity || 1,
              merchandise: {
                id: item?.merchandiseId || 'gid://shopify/ProductVariant/12345',
                title: 'Test Product',
                price: { amount: '29.99', currencyCode: 'USD' },
                product: {
                  title: 'Test Product',
                  images: { edges: [{ node: { url: 'https://example.com/image.jpg' } }] }
                }
              }
            }
          }]
        },
        cost: { totalAmount: { amount: '29.99', currencyCode: 'USD' } }
      };
    }),
    addToCart: vi.fn(async (cartId: string, variantId: string, quantity: number = 1) => ({
      id: cartId,
      checkoutUrl: 'https://checkout.shopify.com/test',
      lines: {
        edges: [{
          node: {
            id: `line-${variantId}-${Date.now()}`,
            quantity,
            merchandise: {
              id: variantId,
              title: 'Test Product',
              price: { amount: '29.99', currencyCode: 'USD' },
              product: {
                title: 'Test Product',
                images: { edges: [{ node: { url: 'https://example.com/image.jpg' } }] }
              }
            }
          }
        }]
      },
      cost: { totalAmount: { amount: (29.99 * quantity).toFixed(2), currencyCode: 'USD' } }
    })),
    removeFromCart: vi.fn(async (cartId: string, lineId: string) => ({
      id: cartId,
      checkoutUrl: 'https://checkout.shopify.com/test',
      lines: { edges: [] },
      cost: { totalAmount: { amount: '0.00', currencyCode: 'USD' } }
    })),
    updateCartLines: vi.fn(async (cartId: string, lines: any[]) => ({
      id: cartId,
      checkoutUrl: 'https://checkout.shopify.com/test',
      lines: {
        edges: lines.map(l => ({
          node: {
            id: l.id,
            quantity: l.quantity,
            merchandise: {
              id: 'gid://shopify/ProductVariant/12345',
              title: 'Test Product',
              price: { amount: '29.99', currencyCode: 'USD' },
              product: {
                title: 'Test Product',
                images: { edges: [{ node: { url: 'https://example.com/image.jpg' } }] }
              }
            }
          }
        }))
      },
      cost: { totalAmount: { amount: (29.99 * lines[0].quantity).toFixed(2), currencyCode: 'USD' } }
    })),
    getCart: vi.fn(async (cartId: string) => ({
      id: cartId,
      checkoutUrl: 'https://checkout.shopify.com/test',
      lines: {
        edges: [{
          node: {
            id: 'line-1',
            quantity: 1,
            merchandise: {
              id: 'gid://shopify/ProductVariant/12345',
              title: 'Test Product',
              price: { amount: '29.99', currencyCode: 'USD' },
              product: {
                title: 'Test Product',
                images: { edges: [{ node: { url: 'https://example.com/image.jpg' } }] }
              }
            }
          }
        }]
      },
      cost: { totalAmount: { amount: '29.99', currencyCode: 'USD' } }
    }))
  };
});

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

describe('Performance Optimization - Cart Features', () => {

  // 测试 1: localStorage 持久化
  describe('localStorage Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should save cart ID to localStorage', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id);
      });

      await waitFor(() => {
        expect(localStorage.getItem('cart_id')).toBeTruthy();
      });

      expect(localStorage.getItem('cart_id')).toBe('gid://shopify/Cart/test-cart-123');
    });

    it('should restore cart from localStorage on init', async () => {
      localStorage.setItem('cart_id', 'gid://shopify/Cart/restored-cart-123');

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.cart).toBeTruthy();
      });

      expect(result.current.cart?.id).toBe('gid://shopify/Cart/restored-cart-123');
    });
  });

  // 测试 2: 去重合并
  describe('Deduplication', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should merge same variant quantities', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });

      // Get the line ID after first add
      const lineId = result.current.cart?.lines.edges[0]?.node.id;

      await act(async () => {
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
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

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
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('should update quantity via updateQuantity', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });

      const lineId = result.current.cart?.lines.edges[0]?.node.id;

      await act(async () => {
        await result.current.updateQuantity(lineId!, 3);
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
        await result.current.updateQuantity(lineId!, 0);
      });

      await waitFor(() => {
        expect(result.current.cart?.lines.edges.length).toBeLessThanOrEqual(0);
      });
    });
  });
});
