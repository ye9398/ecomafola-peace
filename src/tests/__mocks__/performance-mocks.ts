import { vi } from 'vitest';

// Mock cart API functions
export const mockCreateCart = vi.fn(async () => ({
  id: 'gid://shopify/Cart/test-cart-123',
  checkoutUrl: 'https://checkout.shopify.com/test',
  lines: { edges: [] as any[] },
  cost: { totalAmount: { amount: '0.00', currencyCode: 'USD' } }
}));

export const mockAddToCart = vi.fn(async (cartId: string, variantId: string, quantity: number = 1) => ({
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
}));

export const mockRemoveFromCart = vi.fn(async (cartId: string, lineId: string) => ({
  id: cartId,
  checkoutUrl: 'https://checkout.shopify.com/test',
  lines: { edges: [] },
  cost: { totalAmount: { amount: '0.00', currencyCode: 'USD' } }
}));

export const mockUpdateCartLines = vi.fn(async (cartId: string, lines: any[]) => ({
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
}));

export const mockGetCart = vi.fn(async (cartId: string) => ({
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
}));

// Mock shipping hooks
export const mockGeoLocation = {
  geo: { country_code: 'US', country: 'United States', city: 'New York', ip: '1.2.3.4' },
  loading: false,
  error: null
};

export const mockShipping = {
  shipping: {
    supported: true,
    country_code: 'US',
    total_shipping_usd: 5.99,
    estimated_days: '3-5'
  },
  loading: false
};
