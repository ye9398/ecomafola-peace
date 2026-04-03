/**
 * Image Optimizer Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  extractBaseUrl,
  getShopifyImageUrl,
  generateSrcSet,
  getResponsiveSizes,
  IMAGE_SIZES,
  preloadImage,
  LAZY_LOAD_DEFAULTS,
  getOptimizedImageUrl,
  calculateOptimalQuality,
  shouldUseAVIF,
  getImageDimensions,
} from '../imageOptimizer';

describe('imageOptimizer', () => {
  describe('IMAGE_SIZES', () => {
    it('should have predefined size presets', () => {
      expect(IMAGE_SIZES.thumbnail).toEqual({ width: 300, height: 300 });
      expect(IMAGE_SIZES.card).toEqual({ width: 500, height: 500 });
      expect(IMAGE_SIZES.detailDesktop).toEqual({ width: 1200, height: 1200 });
      expect(IMAGE_SIZES.hero).toEqual({ width: 1920, height: 800 });
    });
  });

  describe('extractBaseUrl', () => {
    it('should remove size parameters from Shopify CDN URLs', () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/image_100x100.jpg';
      expect(extractBaseUrl(url)).toBe(
        'https://cdn.shopify.com/s/files/1/0001/image.jpg'
      );
    });

    it('should handle different size parameter formats', () => {
      expect(extractBaseUrl('image_500x500.jpg')).toBe('image.jpg');
      expect(extractBaseUrl('image_1200x.jpg')).toBe('image.jpg');
      expect(extractBaseUrl('image_800.png')).toBe('image_800.png');
    });

    it('should return URLs without size params unchanged', () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/image.jpg';
      expect(extractBaseUrl(url)).toBe(url);
    });

    it('should handle non-Shopify URLs', () => {
      const url = 'https://images.unsplash.com/photo-123?w=800&q=80';
      expect(extractBaseUrl(url)).toBe(url);
    });

    it('should return null for null/undefined inputs', () => {
      expect(extractBaseUrl(null)).toBeNull();
      expect(extractBaseUrl(undefined)).toBeNull();
      expect(extractBaseUrl('')).toBeNull();
    });
  });

  describe('getShopifyImageUrl', () => {
    const baseUrl = 'https://cdn.shopify.com/s/files/1/0001/image.jpg';

    it('should return null for invalid input', () => {
      expect(getShopifyImageUrl(null)).toBeNull();
      expect(getShopifyImageUrl(undefined)).toBeNull();
    });

    it('should generate URL with width parameter', () => {
      const url = getShopifyImageUrl(baseUrl, { width: 500 });
      expect(url).toContain('width=500');
    });

    it('should generate URL with height parameter', () => {
      const url = getShopifyImageUrl(baseUrl, { height: 600 });
      expect(url).toContain('height=600');
    });

    it('should generate URL with multiple parameters', () => {
      const url = getShopifyImageUrl(baseUrl, {
        width: 800,
        height: 800,
        quality: 90,
      });
      expect(url).toContain('width=800');
      expect(url).toContain('height=800');
      expect(url).toContain('quality=90');
    });

    it('should use preset sizes', () => {
      const url = getShopifyImageUrl(baseUrl, 'thumbnail');
      expect(url).toContain('width=300');
      expect(url).toContain('height=300');
    });

    it('should handle crop parameter', () => {
      const url = getShopifyImageUrl(baseUrl, { width: 500, crop: 'scale' });
      expect(url).toContain('crop=scale');
    });

    it('should handle format parameter', () => {
      const url = getShopifyImageUrl(baseUrl, { width: 500, format: 'webp' });
      expect(url).toContain('format=webp');
    });

    it('should not add format=auto to URL', () => {
      const url = getShopifyImageUrl(baseUrl, { width: 500, format: 'auto' });
      expect(url).not.toContain('format=auto');
    });

    it('should handle blur parameter', () => {
      const url = getShopifyImageUrl(baseUrl, { width: 100, blur: 50 });
      expect(url).toContain('blur=50');
    });

    it('should return base URL when no params provided', () => {
      expect(getShopifyImageUrl(baseUrl)).toBe(baseUrl);
    });

    it('should handle URLs with existing query params', () => {
      const urlWithParams = 'https://cdn.shopify.com/image.jpg?existing=1';
      const result = getShopifyImageUrl(urlWithParams, { width: 500 });
      expect(result).toContain('existing=1');
      expect(result).toContain('width=500');
    });
  });

  describe('generateSrcSet', () => {
    const baseUrl = 'https://cdn.shopify.com/s/files/1/0001/image.jpg';

    it('should generate srcset with standard breakpoints', () => {
      const srcset = generateSrcSet(baseUrl, 1200);
      expect(srcset).toContain('300w');
      expect(srcset).toContain('500w');
      expect(srcset).toContain('700w');
      expect(srcset).toContain('900w');
      expect(srcset).toContain('1200w');
    });

    it('should limit breakpoints to baseWidth', () => {
      const srcset = generateSrcSet(baseUrl, 500);
      expect(srcset).not.toContain('700w');
      expect(srcset).not.toContain('1600w');
    });

    it('should return empty string for invalid input', () => {
      expect(generateSrcSet(null)).toBe('');
      expect(generateSrcSet(undefined)).toBe('');
    });

    it('should format breakpoints correctly', () => {
      const srcset = generateSrcSet(baseUrl, 1200);
      const parts = srcset.split(', ');
      parts.forEach((part) => {
        expect(part).toMatch(/\.jpg.*\d+w$/);
      });
    });
  });

  describe('getResponsiveSizes', () => {
    it('should return default sizes', () => {
      expect(getResponsiveSizes()).toBe(
        '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
      );
    });

    it('should accept custom sizes', () => {
      expect(getResponsiveSizes('100vw', '50vw', '33vw')).toBe(
        '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
      );
    });
  });

  describe('preloadImage', () => {
    let createElementSpy: any;
    let appendChildSpy: any;
    let mockLink: HTMLLinkElement;

    beforeEach(() => {
      mockLink = document.createElement('link');
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      appendChildSpy = vi.spyOn(document.head, 'appendChild');
    });

    afterEach(() => {
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      vi.clearAllMocks();
    });

    it('should create preload link element', () => {
      const imageUrl = 'https://cdn.shopify.com/image.jpg';
      preloadImage(imageUrl);

      expect(createElementSpy).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('preload');
      expect(mockLink.as).toBe('image');
    });

    it('should set imagesrcset and imagesizes for images', () => {
      const imageUrl = 'https://cdn.shopify.com/image.jpg';
      preloadImage(imageUrl, 'image', '100vw');

      expect(mockLink.getAttribute('imagesrcset')).toBeTruthy();
      expect(mockLink.getAttribute('imagesizes')).toBe('100vw');
    });

    it('should return early for null image', () => {
      preloadImage(null);
      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    it('should append link to document head', () => {
      const imageUrl = 'https://cdn.shopify.com/image.jpg';
      preloadImage(imageUrl);

      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    });
  });

  describe('LAZY_LOAD_DEFAULTS', () => {
    it('should have correct default values', () => {
      expect(LAZY_LOAD_DEFAULTS.rootMargin).toBe('100px');
      expect(LAZY_LOAD_DEFAULTS.threshold).toBe(0);
      expect(LAZY_LOAD_DEFAULTS.blurUp).toBe(true);
    });
  });

  // ============================================================
  // 任务 1: Shopify CDN 图片优化 - 新增测试（图片体积 -30%）
  // ============================================================

  describe('calculateOptimalQuality', () => {
    it('should return lower quality for larger images', () => {
      expect(calculateOptimalQuality(1920)).toBeLessThanOrEqual(75);
      expect(calculateOptimalQuality(1200)).toBeLessThanOrEqual(80);
    });

    it('should return higher quality for smaller images', () => {
      expect(calculateOptimalQuality(300)).toBeGreaterThanOrEqual(85);
      expect(calculateOptimalQuality(500)).toBeGreaterThanOrEqual(80);
    });

    it('should use default quality for medium sizes', () => {
      const quality = calculateOptimalQuality(800);
      expect(quality).toBeGreaterThanOrEqual(75);
      expect(quality).toBeLessThanOrEqual(85);
    });
  });

  describe('shouldUseAVIF', () => {
    let originalCSSSupports: typeof CSS.supports | undefined;

    beforeEach(() => {
      originalCSSSupports = CSS.supports;
    });

    afterEach(() => {
      if (originalCSSSupports) {
        CSS.supports = originalCSSSupports;
      }
    });

    it('should return true when CSS.supports detects AVIF support', () => {
      CSS.supports = vi.fn().mockReturnValue(true);
      expect(shouldUseAVIF()).toBe(true);
    });

    it('should return false when CSS.supports detects no AVIF support', () => {
      CSS.supports = vi.fn().mockReturnValue(false);
      expect(shouldUseAVIF()).toBe(false);
    });

    it('should return false in SSR environment', () => {
      // Simulate SSR by temporarily removing CSS
      const originalCSS = global.CSS;
      (global as any).CSS = undefined;

      expect(shouldUseAVIF()).toBe(false);

      (global as any).CSS = originalCSS;
    });

    it('should fall back to false when CSS.supports is not available', () => {
      CSS.supports = undefined as any;
      expect(shouldUseAVIF()).toBe(false);
    });
  });

  describe('getOptimizedImageUrl', () => {
    const baseUrl = 'https://cdn.shopify.com/s/files/1/0001/image.jpg';

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should apply automatic quality optimization based on size', () => {
      const url = getOptimizedImageUrl(baseUrl, { width: 1920 });
      expect(url).toContain('quality=');
      expect(url).toContain('width=1920');
    });

    it('should use AVIF format when CSS.supports detects support', () => {
      // Mock CSS.supports to return true for AVIF
      const originalCSS = global.CSS;
      (global as any).CSS = {
        supports: vi.fn().mockReturnValue(true),
      };

      const url = getOptimizedImageUrl(baseUrl, { width: 800, autoFormat: true });
      expect(url).toContain('format=avif');

      (global as any).CSS = originalCSS;
    });

    it('should fall back to WebP when CSS.supports detects no AVIF support', () => {
      // Mock CSS.supports to return false for AVIF
      const originalCSS = global.CSS;
      (global as any).CSS = {
        supports: vi.fn().mockReturnValue(false),
      };

      const url = getOptimizedImageUrl(baseUrl, { width: 800, autoFormat: true });
      expect(url).toContain('format=webp');

      (global as any).CSS = originalCSS;
    });

    it('should apply lazy loading by default', () => {
      const url = getOptimizedImageUrl(baseUrl, { width: 500 });
      expect(url).toContain('loading=lazy');
    });

    it('should disable lazy loading for above-fold images', () => {
      const url = getOptimizedImageUrl(baseUrl, { width: 1920, lazy: false });
      expect(url).not.toContain('loading=lazy');
    });

    it('should combine multiple optimizations', () => {
      // Mock CSS.supports to return true for AVIF
      const originalCSS = global.CSS;
      (global as any).CSS = {
        supports: vi.fn().mockReturnValue(true),
      };

      const url = getOptimizedImageUrl(baseUrl, {
        width: 1200,
        autoFormat: true,
        lazy: false,
        quality: 85,
      });
      expect(url).toContain('format=avif');
      expect(url).toContain('quality=85');
      expect(url).toContain('width=1200');
      expect(url).not.toContain('loading=lazy');

      (global as any).CSS = originalCSS;
    });
  });

  describe('getImageDimensions', () => {
    it('should parse dimensions from Shopify URL', () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/image_800x600.jpg';
      const dims = getImageDimensions(url);
      expect(dims).toEqual({ width: 800, height: 600 });
    });

    it('should return null for URLs without dimensions', () => {
      const url = 'https://cdn.shopify.com/s/files/1/0001/image.jpg';
      const dims = getImageDimensions(url);
      expect(dims).toBeNull();
    });

    it('should return null for invalid URLs', () => {
      expect(getImageDimensions(null)).toBeNull();
      expect(getImageDimensions(undefined)).toBeNull();
      expect(getImageDimensions('')).toBeNull();
    });
  });
});
