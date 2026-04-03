/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Shared cart state for mocks
const cartState = {
  lines: [] as any[]
};

// Set up module mocks - vi.mock is hoisted, so define everything inline
vi.mock('../lib/cart', async () => {
  const cartState = {
    lines: [] as any[]
  };
  return {
    createCart: vi.fn(async (items: Array<{ merchandiseId: string; quantity: number }>) => {
      const item = items[0];
      cartState.lines = [{
        node: {
          id: `line-${item?.merchandiseId}`,
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
      }];
      return {
        id: 'gid://shopify/Cart/test-cart-123',
        checkoutUrl: 'https://checkout.shopify.com/test',
        lines: { edges: cartState.lines },
        cost: { totalAmount: { amount: '29.99', currencyCode: 'USD' } }
      };
    }),
    addToCart: vi.fn(async (cartId: string, variantId: string, quantity: number = 1) => {
      // Check if variant already exists - deduplication logic
      const existingLine = cartState.lines.find(
        (line: any) => line.node.merchandise.id === variantId
      );

      if (existingLine) {
        existingLine.node.quantity += quantity;
      } else {
        cartState.lines.push({
          node: {
            id: `line-${variantId}`,
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
        });
      }

      const total = cartState.lines.reduce((sum: number, line: any) =>
        sum + (parseFloat(line.node.merchandise.price.amount) * line.node.quantity), 0);

      return {
        id: cartId,
        checkoutUrl: 'https://checkout.shopify.com/test',
        lines: { edges: cartState.lines },
        cost: { totalAmount: { amount: total.toFixed(2), currencyCode: 'USD' } }
      };
    }),
    removeFromCart: vi.fn(async (cartId: string, lineId: string) => {
      cartState.lines = cartState.lines.filter((line: any) => line.node.id !== lineId);
      const total = cartState.lines.reduce((sum: number, line: any) =>
        sum + (parseFloat(line.node.merchandise.price.amount) * line.node.quantity), 0);

      return {
        id: cartId,
        checkoutUrl: 'https://checkout.shopify.com/test',
        lines: { edges: cartState.lines },
        cost: { totalAmount: { amount: total.toFixed(2), currencyCode: 'USD' } }
      };
    }),
    updateCartLines: vi.fn(async (cartId: string, lines: any[]) => {
      lines.forEach(update => {
        const existingLine = cartState.lines.find((line: any) => line.node.id === update.id);
        if (existingLine) {
          existingLine.node.quantity = update.quantity;
        }
      });
      const total = cartState.lines.reduce((sum: number, line: any) =>
        sum + (parseFloat(line.node.merchandise.price.amount) * line.node.quantity), 0);

      return {
        id: cartId,
        checkoutUrl: 'https://checkout.shopify.com/test',
        lines: { edges: cartState.lines },
        cost: { totalAmount: { amount: total.toFixed(2), currencyCode: 'USD' } }
      };
    }),
    // Export reset function for tests
    _resetCart: () => { cartState.lines = []; }
  };
});

vi.mock('../hooks/useShipping', async () => {
  return {
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
  };
});

// Import after mocks
import { CartProvider, useCart } from '../context/CartContext';
import * as cartModule from '../lib/cart';

const mockVariant = {
  id: 'gid://shopify/ProductVariant/12345',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('Cart Optimization', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset cart state
    if ('_resetCart' in cartModule) {
      (cartModule as any)._resetCart();
    }
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('localStorage Persistence', () => {
    it('should save cart ID to localStorage after adding item', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });

      await waitFor(() => {
        expect(localStorage.getItem('cart_id')).toBeTruthy();
      });
    });
  });

  describe('Deduplication', () => {
    it('should merge same variant quantities', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });

      await waitFor(() => {
        expect(result.current.cart).toBeTruthy();
      });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });

      await waitFor(() => {
        const cart = result.current.cart;
        expect(cart?.lines.edges).toHaveLength(1);
      });
    });

    it('should keep different variants separate', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart('variant-1', 1);
      });

      await waitFor(() => {
        expect(result.current.cart).toBeTruthy();
      });

      await act(async () => {
        await result.current.addToCart('variant-2', 1);
      });

      await waitFor(() => {
        expect(result.current.cart?.lines.edges).toHaveLength(2);
      });
    });
  });

  describe('Quantity Update', () => {
    it('should update quantity via updateQuantity method', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });

      await waitFor(() => {
        expect(result.current.cart?.lines.edges).toHaveLength(1);
      });

      const lineId = result.current.cart?.lines.edges[0]?.node.id;

      if (lineId) {
        await act(async () => {
          await result.current.updateQuantity(lineId, 3);
        });

        await waitFor(() => {
          const line = result.current.cart?.lines.edges[0]?.node;
          expect(line?.quantity).toBe(3);
        });
      }
    });

    it('should remove item when quantity set to 0', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 1);
      });

      await waitFor(() => {
        expect(result.current.cart?.lines.edges).toHaveLength(1);
      });

      const lineId = result.current.cart?.lines.edges[0]?.node.id;

      if (lineId) {
        await act(async () => {
          await result.current.updateQuantity(lineId, 0);
        });

        await waitFor(() => {
          expect(result.current.cart?.lines.edges).toHaveLength(0);
        });
      }
    });
  });

  describe('Shipping Estimation', () => {
    it('should include shipping info in cart context', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(result.current.shipping).toBeDefined();
    });

    it('should provide shipping loading state', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      expect(typeof result.current.shippingLoading).toBe('boolean');
    });
  });

  describe('Cart Count', () => {
    it('should calculate total item count correctly', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await act(async () => {
        await result.current.addToCart(mockVariant.id, 2);
      });

      await waitFor(() => {
        expect(result.current.count).toBe(2);
      });
    });
  });
});
