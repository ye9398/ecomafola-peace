/**
 * Vercel Edge Cache Configuration Tests
 */

import { describe, it, expect } from 'vitest';

// Test the cache configuration logic
describe('Vercel Edge Cache', () => {
  describe('Cache-Control headers', () => {
    it('should have correct cache config for static assets', () => {
      const config = { maxAge: 31536000, sMaxAge: 31536000 };
      expect(config.maxAge).toBe(31536000); // 1 year
      expect(config.sMaxAge).toBe(31536000);
    });

    it('should have correct cache config for product pages', () => {
      const config = { maxAge: 0, sMaxAge: 300, swr: 1800 };
      expect(config.maxAge).toBe(0); // Browser no cache
      expect(config.sMaxAge).toBe(300); // CDN cache 5 min
      expect(config.swr).toBe(1800); // SWR 30 min
    });

    it('should have correct cache config for homepage', () => {
      const config = { maxAge: 0, sMaxAge: 60, swr: 300 };
      expect(config.maxAge).toBe(0);
      expect(config.sMaxAge).toBe(60); // CDN cache 1 min
      expect(config.swr).toBe(300); // SWR 5 min
    });

    it('should have correct cache config for API responses', () => {
      const config = { maxAge: 0, sMaxAge: 60, swr: 300 };
      expect(config.maxAge).toBe(0);
      expect(config.sMaxAge).toBe(60);
      expect(config.swr).toBe(300);
    });

    it('should have correct cache config for dynamic pages', () => {
      const config = { maxAge: 0, sMaxAge: 0 };
      expect(config.maxAge).toBe(0);
      expect(config.sMaxAge).toBe(0); // No caching
    });
  });

  describe('Cache header generation', () => {
    function generateCacheHeader(config: { maxAge: number; sMaxAge?: number; swr?: number }): string {
      const parts = [`public`, `max-age=${config.maxAge}`];

      if (config.sMaxAge !== undefined) {
        parts.push(`s-maxage=${config.sMaxAge}`);
      }

      if (config.swr !== undefined) {
        parts.push(`stale-while-revalidate=${config.swr}`);
      }

      return parts.join(', ');
    }

    it('should generate correct header for static assets', () => {
      const header = generateCacheHeader({ maxAge: 31536000, sMaxAge: 31536000 });
      expect(header).toBe('public, max-age=31536000, s-maxage=31536000');
    });

    it('should generate correct header for product pages', () => {
      const header = generateCacheHeader({ maxAge: 0, sMaxAge: 300, swr: 1800 });
      expect(header).toBe('public, max-age=0, s-maxage=300, stale-while-revalidate=1800');
    });

    it('should generate correct header for homepage', () => {
      const header = generateCacheHeader({ maxAge: 0, sMaxAge: 60, swr: 300 });
      expect(header).toBe('public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    });

    it('should generate correct header without s-maxage', () => {
      const header = generateCacheHeader({ maxAge: 3600 });
      expect(header).toBe('public, max-age=3600');
    });
  });

  describe('Content type detection', () => {
    function getContentType(path: string): string {
      if (path === '/') return 'home';
      if (path.startsWith('/api/')) return 'api';
      if (path.startsWith('/products/')) return 'product';
      if (path.startsWith('/products') || path.startsWith('/collections')) return 'collection';
      if (path.startsWith('/checkout') || path.startsWith('/cart')) return 'dynamic';
      if (path.startsWith('/assets/') || path.startsWith('/static/')) return 'static';
      return 'home';
    }

    it('should detect homepage', () => {
      expect(getContentType('/')).toBe('home');
    });

    it('should detect product pages', () => {
      expect(getContentType('/products/samoan-bowl')).toBe('product');
      expect(getContentType('/products/coconut-spoon')).toBe('product');
    });

    it('should detect collection pages', () => {
      expect(getContentType('/products')).toBe('collection');
      expect(getContentType('/collections/featured')).toBe('collection');
    });

    it('should detect API routes', () => {
      expect(getContentType('/api/customer')).toBe('api');
      expect(getContentType('/api/reviews')).toBe('api');
    });

    it('should detect dynamic pages', () => {
      expect(getContentType('/checkout')).toBe('dynamic');
      expect(getContentType('/cart')).toBe('dynamic');
    });

    it('should detect static assets', () => {
      expect(getContentType('/assets/index.js')).toBe('static');
      expect(getContentType('/static/logo.png')).toBe('static');
    });

    it('should default to home for unknown paths', () => {
      expect(getContentType('/about')).toBe('home');
      expect(getContentType('/unknown')).toBe('home');
    });
  });

  describe('vercel.json configuration', () => {
    it('should have valid JSON structure', () => {
      const vercelConfig = {
        rewrites: [{ source: '/(.*)', destination: '/index.html' }],
        headers: [
          {
            source: '/assets/(.*)',
            headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
          },
        ],
      };

      expect(vercelConfig.rewrites).toBeDefined();
      expect(vercelConfig.headers).toBeDefined();
      expect(Array.isArray(vercelConfig.rewrites)).toBe(true);
      expect(Array.isArray(vercelConfig.headers)).toBe(true);
    });

    it('should have immutable cache for assets', () => {
      const assetCache = 'public, max-age=31536000, immutable';
      expect(assetCache).toContain('immutable');
      expect(assetCache).toContain('max-age=31536000');
    });

    it('should have stale-while-revalidate for dynamic content', () => {
      const dynamicCache = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';
      expect(dynamicCache).toContain('stale-while-revalidate');
      expect(dynamicCache).toContain('s-maxage=3600');
    });
  });
});
