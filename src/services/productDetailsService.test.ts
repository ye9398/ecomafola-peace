/**
 * Product Detail Service Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchProductDetail,
  findVariantByOptions,
  getSelectedVariantInfo,
  calculatePriceRange,
  getAvailableOptionValues,
  isOptionValueAvailable,
  getPrimaryImage,
  formatPrice,
  isProductInStock,
  getAvailabilityStatus,
  clearProductDetailCache,
  type ProductDetail,
  type ProductVariant,
  type ProductOption,
  type ProductImage,
} from './productDetailsService';

// Mock shopify module
vi.mock('../lib/shopify', () => ({
  shopifyClient: {
    request: vi.fn(),
  },
  SHOPIFY_QUERIES: {
    getProductByHandle: 'query GetProductByHandle { product }',
  },
  getProductByHandle: vi.fn(),
}));

import { shopifyClient } from '../lib/shopify';

describe('productDetailsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Mock product data
  const mockProduct: ProductDetail = {
    id: 'gid://shopify/Product/123',
    title: 'Test Product',
    handle: 'test-product',
    description: 'Test description',
    descriptionHtml: '<p>Test description</p>',
    productType: 'Home Decor',
    vendor: 'EcoMafola',
    tags: ['handmade', 'eco-friendly'],
    images: [
      {
        id: 'img-1',
        url: 'https://cdn.shopify.com/image1.jpg',
        altText: 'Main image',
        width: 800,
        height: 800,
      },
      {
        id: 'img-2',
        url: 'https://cdn.shopify.com/image2.jpg',
        altText: 'Secondary image',
        width: 800,
        height: 800,
      },
    ],
    variants: [
      {
        id: 'variant-1',
        title: 'Small',
        price: { amount: '29.99', currencyCode: 'USD' },
        compareAtPrice: { amount: '39.99', currencyCode: 'USD' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: 'Small' }],
      },
      {
        id: 'variant-2',
        title: 'Medium',
        price: { amount: '34.99', currencyCode: 'USD' },
        compareAtPrice: null,
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: 'Medium' }],
      },
      {
        id: 'variant-3',
        title: 'Large',
        price: { amount: '39.99', currencyCode: 'USD' },
        compareAtPrice: { amount: '49.99', currencyCode: 'USD' },
        availableForSale: false,
        selectedOptions: [{ name: 'Size', value: 'Large' }],
      },
    ],
    options: [
      {
        id: 'opt-1',
        name: 'Size',
        values: ['Small', 'Medium', 'Large'],
      },
    ],
    priceRange: {
      minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '39.99', currencyCode: 'USD' },
    },
  };

  const mockVariants: ProductVariant[] = mockProduct.variants;
  const mockOptions: ProductOption[] = mockProduct.options;
  const mockImages: ProductImage[] = mockProduct.images;

  describe('fetchProductDetail', () => {
    it('should fetch product detail successfully', async () => {
      vi.mocked(shopifyClient.request).mockResolvedValue({
        data: {
          product: {
            ...mockProduct,
            images: { edges: mockProduct.images.map((img) => ({ node: img })) },
            variants: { edges: mockProduct.variants.map((v) => ({ node: v })) },
          },
        },
        errors: undefined,
      });

      const result = await fetchProductDetail('test-product');

      expect(result).toBeTruthy();
      expect(result?.title).toBe('Test Product');
      expect(result?.handle).toBe('test-product');
      expect(result?.variants).toHaveLength(3);
    });

    it('should use cache on second request', async () => {
      vi.mocked(shopifyClient.request).mockResolvedValue({
        data: { product: { ...mockProduct } },
        errors: undefined,
      });

      // First request
      await fetchProductDetail('test-product');

      // Second request (should use cache)
      const result = await fetchProductDetail('test-product');

      expect(result).toBeTruthy();
      expect(shopifyClient.request).toHaveBeenCalledTimes(1);
    });

    it('should skip cache when requested', async () => {
      vi.mocked(shopifyClient.request).mockResolvedValue({
        data: { product: { ...mockProduct } },
        errors: undefined,
      });

      await fetchProductDetail('test-product', { skipCache: true });
      await fetchProductDetail('test-product', { skipCache: true });

      expect(shopifyClient.request).toHaveBeenCalledTimes(2);
    });

    it('should return null when product not found', async () => {
      vi.mocked(shopifyClient.request).mockResolvedValue({
        data: { product: null },
        errors: undefined,
      });

      const result = await fetchProductDetail('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null on API error', async () => {
      vi.mocked(shopifyClient.request).mockResolvedValue({
        data: null,
        errors: [{ message: 'Product not found' }],
      });

      const result = await fetchProductDetail('test-product');

      expect(result).toBeNull();
    });

    it('should handle API rejection gracefully', async () => {
      vi.mocked(shopifyClient.request).mockRejectedValue(new Error('Network error'));

      const result = await fetchProductDetail('test-product');

      expect(result).toBeNull();
    });

    it('should transform Shopify response correctly', async () => {
      vi.mocked(shopifyClient.request).mockResolvedValue({
        data: {
          product: {
            ...mockProduct,
            images: { edges: mockProduct.images.map((img) => ({ node: img })) },
            variants: { edges: mockProduct.variants.map((v) => ({ node: v })) },
          },
        },
        errors: undefined,
      });

      const result = await fetchProductDetail('test-product');

      expect(result?.images[0].url).toBe('https://cdn.shopify.com/image1.jpg');
      expect(result?.variants[0].price.amount).toBe('29.99');
      expect(result?.priceRange.minVariantPrice.amount).toBe('29.99');
    });
  });

  describe('findVariantByOptions', () => {
    it('should find variant by matching options', () => {
      const variant = findVariantByOptions(mockVariants, { Size: 'Medium' });

      expect(variant).toBeTruthy();
      expect(variant?.id).toBe('variant-2');
      expect(variant?.title).toBe('Medium');
    });

    it('should return null when no matching variant', () => {
      const variant = findVariantByOptions(mockVariants, { Size: 'XLarge' });

      expect(variant).toBeNull();
    });

    it('should match multiple options', () => {
      const variantsWithMultipleOptions: ProductVariant[] = [
        {
          id: 'v1',
          title: 'Small / Red',
          price: { amount: '29.99', currencyCode: 'USD' },
          compareAtPrice: null,
          availableForSale: true,
          selectedOptions: [
            { name: 'Size', value: 'Small' },
            { name: 'Color', value: 'Red' },
          ],
        },
        {
          id: 'v2',
          title: 'Small / Blue',
          price: { amount: '29.99', currencyCode: 'USD' },
          compareAtPrice: null,
          availableForSale: true,
          selectedOptions: [
            { name: 'Size', value: 'Small' },
            { name: 'Color', value: 'Blue' },
          ],
        },
      ];

      const variant = findVariantByOptions(variantsWithMultipleOptions, {
        Size: 'Small',
        Color: 'Blue',
      });

      expect(variant).toBeTruthy();
      expect(variant?.id).toBe('v2');
    });

    it('should handle empty variants array', () => {
      const variant = findVariantByOptions([], { Size: 'Small' });
      expect(variant).toBeNull();
    });

    it('should handle empty options object', () => {
      const variant = findVariantByOptions(mockVariants, {});
      expect(variant).toBe(mockVariants[0]);
    });
  });

  describe('getSelectedVariantInfo', () => {
    it('should return variant info with sale calculation', () => {
      const saleVariant = mockVariants[0]; // Has compareAtPrice
      const result = getSelectedVariantInfo(saleVariant);

      expect(result.variant).toBe(saleVariant);
      expect(result.available).toBe(true);
      expect(result.price).toBe('29.99');
      expect(result.compareAtPrice).toBe('39.99');
      expect(result.isOnSale).toBe(true);
      expect(result.discountPercentage).toBe(25); // (39.99-29.99)/39.99 * 100 ≈ 25
    });

    it('should return variant info without sale', () => {
      const regularVariant = mockVariants[1]; // No compareAtPrice
      const result = getSelectedVariantInfo(regularVariant);

      expect(result.variant).toBe(regularVariant);
      expect(result.available).toBe(true);
      expect(result.price).toBe('34.99');
      expect(result.compareAtPrice).toBeNull();
      expect(result.isOnSale).toBe(false);
      expect(result.discountPercentage).toBe(0);
    });

    it('should handle unavailable variant', () => {
      const unavailableVariant = mockVariants[2];
      const result = getSelectedVariantInfo(unavailableVariant);

      expect(result.available).toBe(false);
    });

    it('should handle null variant', () => {
      const result = getSelectedVariantInfo(null);

      expect(result.variant).toBeNull();
      expect(result.available).toBe(false);
      expect(result.price).toBe('0');
      expect(result.compareAtPrice).toBeNull();
      expect(result.isOnSale).toBe(false);
    });
  });

  describe('calculatePriceRange', () => {
    it('should calculate price range from variants', () => {
      const range = calculatePriceRange(mockVariants);

      expect(range.minVariantPrice.amount).toBe('29.99');
      expect(range.maxVariantPrice.amount).toBe('39.99');
      expect(range.minVariantPrice.currencyCode).toBe('USD');
      expect(range.maxVariantPrice.currencyCode).toBe('USD');
    });

    it('should handle empty variants array', () => {
      const range = calculatePriceRange([]);

      expect(range.minVariantPrice.amount).toBe('0');
      expect(range.maxVariantPrice.amount).toBe('0');
    });

    it('should handle single variant', () => {
      const range = calculatePriceRange([mockVariants[0]]);

      expect(range.minVariantPrice.amount).toBe('29.99');
      expect(range.maxVariantPrice.amount).toBe('29.99');
    });

    it('should use correct currency from first variant', () => {
      const variants: ProductVariant[] = [
        {
          id: 'v1',
          title: 'Test',
          price: { amount: '10.00', currencyCode: 'EUR' },
          compareAtPrice: null,
          availableForSale: true,
          selectedOptions: [],
        },
        {
          id: 'v2',
          title: 'Test 2',
          price: { amount: '20.00', currencyCode: 'EUR' },
          compareAtPrice: null,
          availableForSale: true,
          selectedOptions: [],
        },
      ];

      const range = calculatePriceRange(variants);

      expect(range.minVariantPrice.currencyCode).toBe('EUR');
      expect(range.maxVariantPrice.currencyCode).toBe('EUR');
    });
  });

  describe('getAvailableOptionValues', () => {
    it('should return values for existing option', () => {
      const values = getAvailableOptionValues(mockOptions, 'Size');

      expect(values).toEqual(['Small', 'Medium', 'Large']);
    });

    it('should return empty array for non-existent option', () => {
      const values = getAvailableOptionValues(mockOptions, 'Color');

      expect(values).toEqual([]);
    });

    it('should handle empty options array', () => {
      const values = getAvailableOptionValues([], 'Size');

      expect(values).toEqual([]);
    });
  });

  describe('isOptionValueAvailable', () => {
    it('should return true for available option value', () => {
      const available = isOptionValueAvailable(mockVariants, 'Size', 'Small');

      expect(available).toBe(true);
    });

    it('should return false for unavailable option value', () => {
      const available = isOptionValueAvailable(mockVariants, 'Size', 'Large');

      expect(available).toBe(false); // Large variant is not availableForSale
    });

    it('should return false for non-existent option', () => {
      const available = isOptionValueAvailable(mockVariants, 'Color', 'Red');

      expect(available).toBe(false);
    });

    it('should handle empty variants array', () => {
      const available = isOptionValueAvailable([], 'Size', 'Small');

      expect(available).toBe(false);
    });
  });

  describe('getPrimaryImage', () => {
    const mockProductWithImages: ProductDetail = {
      ...mockProduct,
      images: mockImages,
    };

    it('should return first image for product without variant', () => {
      const image = getPrimaryImage(mockProductWithImages);

      expect(image).toBe(mockImages[0]);
    });

    it('should return first image when variant provided', () => {
      const image = getPrimaryImage(mockProductWithImages, mockVariants[0]);

      expect(image).toBe(mockImages[0]);
    });

    it('should return null for null product', () => {
      const image = getPrimaryImage(null);

      expect(image).toBeNull();
    });

    it('should return null for product with no images', () => {
      const productNoImages: ProductDetail = { ...mockProduct, images: [] };
      const image = getPrimaryImage(productNoImages);

      expect(image).toBeNull();
    });
  });

  describe('formatPrice', () => {
    it('should format USD price correctly', () => {
      expect(formatPrice('29.99', 'USD')).toBe('$29.99');
      expect(formatPrice('100', 'USD')).toBe('$100.00');
    });

    it('should format EUR price correctly', () => {
      expect(formatPrice('29.99', 'EUR', 'en-US')).toContain('€');
    });

    it('should use default USD currency', () => {
      expect(formatPrice('29.99')).toBe('$29.99');
    });

    it('should handle custom locale', () => {
      // German locale should use comma as decimal separator
      const formatted = formatPrice('29.99', 'EUR', 'de-DE');
      expect(formatted).toContain('29,99');
    });

    it('should fallback to simple format on error', () => {
      const formatted = formatPrice('invalid', 'USD');
      expect(formatted).toBe('$invalid');
    });
  });

  describe('isProductInStock', () => {
    it('should return true when at least one variant is available', () => {
      expect(isProductInStock(mockProduct)).toBe(true);
    });

    it('should return false when no variants are available', () => {
      const outOfStockProduct: ProductDetail = {
        ...mockProduct,
        variants: mockVariants.map((v) => ({ ...v, availableForSale: false })),
      };

      expect(isProductInStock(outOfStockProduct)).toBe(false);
    });

    it('should return false for null product', () => {
      expect(isProductInStock(null)).toBe(false);
    });

    it('should return false for product with empty variants', () => {
      const noVariantsProduct: ProductDetail = { ...mockProduct, variants: [] };

      expect(isProductInStock(noVariantsProduct)).toBe(false);
    });
  });

  describe('getAvailabilityStatus', () => {
    it('should return "In Stock" when variant is available', () => {
      const status = getAvailabilityStatus(mockProduct, mockVariants[0]);

      expect(status).toBe('In Stock');
    });

    it('should return "Out of Stock" when variant is unavailable', () => {
      const status = getAvailabilityStatus(mockProduct, mockVariants[2]);

      expect(status).toBe('Out of Stock');
    });

    it('should return "In Stock" when all variants available', () => {
      const inStockProduct: ProductDetail = {
        ...mockProduct,
        variants: mockVariants.map((v) => ({ ...v, availableForSale: true })),
      };

      const status = getAvailabilityStatus(inStockProduct);

      expect(status).toBe('In Stock');
    });

    it('should return "Select Options for Availability" when mixed stock', () => {
      const status = getAvailabilityStatus(mockProduct);

      expect(status).toBe('Select Options for Availability');
    });

    it('should return "Out of Stock" when all variants unavailable', () => {
      const outOfStockProduct: ProductDetail = {
        ...mockProduct,
        variants: mockVariants.map((v) => ({ ...v, availableForSale: false })),
      };

      const status = getAvailabilityStatus(outOfStockProduct);

      expect(status).toBe('Out of Stock');
    });

    it('should return "Unknown availability" for null product', () => {
      const status = getAvailabilityStatus(null);

      expect(status).toBe('Unknown availability');
    });
  });

  describe('clearProductDetailCache', () => {
    it('should clear product detail cache entries', () => {
      localStorage.setItem('product-detail:test', 'value');
      localStorage.setItem('other-key', 'value');

      clearProductDetailCache();

      expect(localStorage.getItem('product-detail:test')).toBeNull();
      expect(localStorage.getItem('other-key')).toBe('value');
    });

    it('should handle empty cache gracefully', () => {
      expect(() => clearProductDetailCache()).not.toThrow();
    });
  });

  describe('productDetailService export', () => {
    it('should export all functions', async () => {
      const { productDetailService } = await import('./productDetailsService');

      expect(productDetailService.fetchProductDetail).toBeTypeOf('function');
      expect(productDetailService.findVariantByOptions).toBeTypeOf('function');
      expect(productDetailService.getSelectedVariantInfo).toBeTypeOf('function');
      expect(productDetailService.calculatePriceRange).toBeTypeOf('function');
      expect(productDetailService.getAvailableOptionValues).toBeTypeOf('function');
      expect(productDetailService.isOptionValueAvailable).toBeTypeOf('function');
      expect(productDetailService.getPrimaryImage).toBeTypeOf('function');
      expect(productDetailService.formatPrice).toBeTypeOf('function');
      expect(productDetailService.isProductInStock).toBeTypeOf('function');
      expect(productDetailService.getAvailabilityStatus).toBeTypeOf('function');
      expect(productDetailService.clearProductDetailCache).toBeTypeOf('function');
    });
  });
});
